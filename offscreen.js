const videoElement = document.getElementById('webcam');
const previewCanvas = document.getElementById('previewCanvas') || document.createElement('canvas');
const previewCtx = previewCanvas.getContext('2d');

let isLocked = false;
let slouchCounter = 0;
let isPreviewStreaming = false;
let lastPoseResults = null;
let unlockGraceFrames = 0;

// 1. Cấu hình MediaPipe Pose (đọc file offline trong cùng thư mục)
const pose = new Pose({
  locateFile: (file) => chrome.runtime.getURL(file)
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

let SLOUCH_THRESHOLD = 0.22;

// Lấy ngưỡng đã lưu từ background.js qua messaging (vì offscreen không có quyền chrome.storage)
chrome.runtime.sendMessage({ action: "GET_INITIAL_THRESHOLD" }, (res) => {
  if (chrome.runtime.lastError) return;
  if (res && res.threshold) {
    SLOUCH_THRESHOLD = parseFloat(res.threshold);
    console.log("Đã nạp ngưỡng từ Cài đặt:", SLOUCH_THRESHOLD);
  }
});

// Lắng nghe lệnh cập nhật ngưỡng trực tiếp từ trang Settings
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "UPDATE_OFFSCREEN_THRESHOLD" && msg.threshold) {
    SLOUCH_THRESHOLD = parseFloat(msg.threshold);
    console.log("🎯 Ngưỡng phát hiện gù lưng đã đổi thành:", SLOUCH_THRESHOLD);
    if (sendResponse) sendResponse({ ok: true });
  }
});

let isFirstResult = true;

// 2. Phân tích tư thế và gửi tín hiệu
pose.onResults((results) => {
  lastPoseResults = results;

  if (isFirstResult) {
    isFirstResult = false;
    console.log("🚀 MediaPipe Pose AI đã sẵn sàng và đang nhận diện chuyển động cơ thể!");
  }

  if (!results.poseLandmarks) return;

  const nose = results.poseLandmarks[0];
  const leftShoulder = results.poseLandmarks[11];
  const rightShoulder = results.poseLandmarks[12];

  const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
  const postureDistance = shoulderY - nose.y;

  if (postureDistance < SLOUCH_THRESHOLD) {
    slouchCounter++;
    console.log(`⚠️ [SAI TƯ THẾ] Khoảng cách: ${postureDistance.toFixed(2)} < ${SLOUCH_THRESHOLD} | Đếm: ${slouchCounter}/10`);
    
    // Gù lưng liên tục đủ 10 frames (~0.5s - 1s) -> Khóa
    if (slouchCounter >= 10 && !isLocked) {
      isLocked = true;
      console.log(">>> 🚨 ĐÃ GỬI LỆNH KHÓA MÀN HÌNH TỚI CÁC TRANG WEB! <<<");
      chrome.runtime.sendMessage({ action: "TRIGGER_LOCK" }).catch(() => {});
    }
  } else {
    // Ngồi thẳng dậy -> Mở khóa
    if (isLocked) {
      isLocked = false;
      slouchCounter = 0;
      unlockGraceFrames = 5; // Duy trì gửi thêm 5 frames để hiển thị tư thế chuẩn xanh lá trước khi đóng
      console.log(">>> ✅ NGỒI THẲNG TRỞ LẠI -> ĐÃ GỬI LỆNH MỞ KHÓA! <<<");
      chrome.runtime.sendMessage({ action: "TRIGGER_UNLOCK" }).catch(() => {});
    } else {
      slouchCounter = 0;
      console.log(`🟢 [TƯ THẾ CHUẨN] Khoảng cách: ${postureDistance.toFixed(2)} >= ${SLOUCH_THRESHOLD}`);
    }
  }
});

let mediaStream = null;
let loopIntervalId = null;
let isStartingCamera = false;

// 3. Khởi chạy Webcam với vòng lặp ngầm độc lập (không bị Chrome đóng băng khi chuyển tab)
async function startWebcamLoop() {
  if (isStartingCamera) return;
  if (mediaStream && mediaStream.active && loopIntervalId) {
    console.log("Webcam đã đang chạy rồi.");
    return;
  }

  isStartingCamera = true;

  // Dọn dẹp luồng cũ nếu có
  if (loopIntervalId) {
    clearInterval(loopIntervalId);
    loopIntervalId = null;
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }

  try {
    console.log("Đang yêu cầu kết nối luồng camera ngầm...");

    // Thử với cấu hình lý tưởng (ideal) trước, tự động tương thích 4:3 và 16:9
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      });
    } catch (constraintErr) {
      console.warn("Không khớp cấu hình lý tưởng 640x480, chuyển sang cấu hình tự động (video: true):", constraintErr);
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    }

    videoElement.srcObject = mediaStream;

    // Phát video trực tiếp để nhận luồng frame
    try {
      await videoElement.play();
    } catch (playErr) {
      console.warn("videoElement.play() warning:", playErr);
    }

    // Lắng nghe nếu track bị ngắt đột ngột
    mediaStream.getVideoTracks().forEach((track) => {
      track.onended = () => {
        console.warn("Luồng camera đã kết thúc.");
        chrome.runtime.sendMessage({
          action: "CAMERA_STATUS_UPDATE",
          status: "ERROR",
          error: "Camera bị ngắt kết nối hoặc thiết bị bị ứng dụng khác chiếm dụng."
        }).catch(() => {});
      };
    });

    console.log("🟢 AI Posture Camera đã chạy ngầm thành công! Đèn webcam đã sáng.");

    // Báo cáo thành công cho background.js và settings.js
    chrome.runtime.sendMessage({
      action: "CAMERA_STATUS_UPDATE",
      status: "ACTIVE",
      error: null
    }).catch(() => { });

    let isProcessing = false;

    // Sử dụng setInterval thay vì requestAnimationFrame vì requestAnimationFrame
    // sẽ bị Chrome tạm dừng (0 FPS) ngay khi người dùng chuyển sang tab khác!
    loopIntervalId = setInterval(async () => {
      // Đảm bảo video đã có frame (videoWidth > 0 hoặc readyState >= 2) và không bị đè frame
      const isVideoReady = videoElement && (videoElement.videoWidth > 0 || videoElement.readyState >= 2);
      if (isVideoReady && !isProcessing) {
        isProcessing = true;
        try {
          await pose.send({ image: videoElement });
        } catch (err) {
          console.error("Lỗi xử lý frame MediaPipe:", err);
        } finally {
          isProcessing = false;
        }
      }

      // Nếu đang bật xem trước ở Settings HOẶC đang bị khóa sai tư thế: Vẽ frame và gửi
      const shouldStream = isPreviewStreaming || isLocked || unlockGraceFrames > 0;
      if (unlockGraceFrames > 0) unlockGraceFrames--;

      if (shouldStream && isVideoReady) {
        try {
          previewCanvas.width = 480;
          previewCanvas.height = 360;

          // 1. Áp dụng hiệu ứng lật gương cho video và khung xương AI
          previewCtx.save();
          previewCtx.translate(480, 0);
          previewCtx.scale(-1, 1);

          previewCtx.drawImage(videoElement, 0, 0, 480, 360);

          // Vẽ khung xương nhận diện tư thế trực quan (tự động khớp với hình ảnh lật gương)
          if (lastPoseResults && lastPoseResults.poseLandmarks) {
            const nose = lastPoseResults.poseLandmarks[0];
            const leftShoulder = lastPoseResults.poseLandmarks[11];
            const rightShoulder = lastPoseResults.poseLandmarks[12];

            // Đường nối hai vai
            previewCtx.strokeStyle = isLocked ? "#ff4757" : "#2ed573";
            previewCtx.lineWidth = 4;
            previewCtx.beginPath();
            previewCtx.moveTo(leftShoulder.x * 480, leftShoulder.y * 360);
            previewCtx.lineTo(rightShoulder.x * 480, rightShoulder.y * 360);
            previewCtx.stroke();

            // Điểm mũi
            previewCtx.fillStyle = isLocked ? "#ff4757" : "#2ed573";
            previewCtx.beginPath();
            previewCtx.arc(nose.x * 480, nose.y * 360, 6, 0, 2 * Math.PI);
            previewCtx.fill();
          }

          // Khôi phục hệ tọa độ
          previewCtx.restore();

          const frameData = previewCanvas.toDataURL('image/jpeg', 0.55);
          chrome.runtime.sendMessage({
            action: "PREVIEW_FRAME",
            dataUrl: frameData,
            isLocked: isLocked
          }).catch(() => { });
        } catch (canvasErr) {
          console.warn("Lỗi render preview frame:", canvasErr);
        }
      }
    }, 100); // 10 FPS (100ms/lần) - mượt mà, tối ưu CPU/RAM
  } catch (err) {
    console.error("❌ Không thể mở webcam trong offscreen:", err);
    // Báo cáo lỗi chi tiết về background để thông báo cho người dùng
    chrome.runtime.sendMessage({
      action: "CAMERA_STATUS_UPDATE",
      status: "ERROR",
      error: (err.name || "Error") + ": " + (err.message || "Không thể truy cập Camera.")
    }).catch(() => { });
  } finally {
    isStartingCamera = false;
  }
}

function stopWebcamLoop() {
  if (loopIntervalId) {
    clearInterval(loopIntervalId);
    loopIntervalId = null;
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => {
      track.onended = null; // Ngăn chặn kích hoạt listener lỗi khi chủ động tắt
      track.stop();
    });
    mediaStream = null;
  }
  if (videoElement) {
    videoElement.srcObject = null;
  }
  console.log("Đã giải phóng phần cứng webcam.");
}

// Lắng nghe lệnh khởi động lại hoặc tắt camera từ background/settings
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "RESTART_CAMERA") {
    console.log("Nhận tín hiệu RESTART_CAMERA từ background/settings...");
    startWebcamLoop();
    if (sendResponse) sendResponse({ ok: true });
  } else if (msg.action === "STOP_CAMERA") {
    console.log("Nhận tín hiệu STOP_CAMERA...");
    stopWebcamLoop();
    if (sendResponse) sendResponse({ ok: true });
  } else if (msg.action === "START_PREVIEW_STREAM") {
    console.log("Nhận tín hiệu START_PREVIEW_STREAM...");
    isPreviewStreaming = true;
    if (sendResponse) sendResponse({ ok: true });
  } else if (msg.action === "STOP_PREVIEW_STREAM") {
    console.log("Nhận tín hiệu STOP_PREVIEW_STREAM...");
    isPreviewStreaming = false;
    if (sendResponse) sendResponse({ ok: true });
  }
});

// Khi offscreen document bị đóng (người dùng tắt tiện ích): Giải phóng ngay phần cứng camera
window.addEventListener("beforeunload", () => {
  stopWebcamLoop();
});

startWebcamLoop();