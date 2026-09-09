const videoElement = document.getElementById('webcam');

let isLocked = false;
let slouchCounter = 0;

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

// Đọc ngưỡng đã lưu từ bộ nhớ tiện ích
chrome.storage.local.get(['slouchThreshold'], (res) => {
  if (res && res.slouchThreshold) {
    SLOUCH_THRESHOLD = parseFloat(res.slouchThreshold);
    console.log("Đã nạp ngưỡng từ Cài đặt:", SLOUCH_THRESHOLD);
  }
});

// Lắng nghe lệnh cập nhật ngưỡng trực tiếp từ trang Settings
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "UPDATE_OFFSCREEN_THRESHOLD" && msg.threshold) {
    SLOUCH_THRESHOLD = parseFloat(msg.threshold);
    console.log("🎯 Ngưỡng phát hiện gù lưng đã đổi thành:", SLOUCH_THRESHOLD);
  }
});

let isFirstResult = true;

// 2. Phân tích tư thế và gửi tín hiệu
pose.onResults((results) => {
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
      chrome.runtime.sendMessage({ action: "TRIGGER_LOCK" });
    }
  } else {
    // Ngồi thẳng dậy -> Mở khóa
    if (isLocked) {
      isLocked = false;
      slouchCounter = 0;
      console.log(">>> ✅ NGỒI THẲNG TRỞ LẠI -> ĐÃ GỬI LỆNH MỞ KHÓA! <<<");
      chrome.runtime.sendMessage({ action: "TRIGGER_UNLOCK" });
    } else {
      slouchCounter = 0;
      console.log(`🟢 [TƯ THẾ CHUẨN] Khoảng cách: ${postureDistance.toFixed(2)} >= ${SLOUCH_THRESHOLD}`);
    }
  }
});

let mediaStream = null;
let loopIntervalId = null;

// 3. Khởi chạy Webcam với vòng lặp ngầm độc lập (không bị Chrome đóng băng khi chuyển tab)
async function startWebcamLoop() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 }
    });
    videoElement.srcObject = mediaStream;
    await videoElement.play();
    console.log("AI Posture Camera đã chạy ngầm thành công!");

    let isProcessing = false;

    // Sử dụng setInterval thay vì requestAnimationFrame vì requestAnimationFrame
    // sẽ bị Chrome tạm dừng (0 FPS) ngay khi người dùng chuyển sang tab khác!
    loopIntervalId = setInterval(async () => {
      if (videoElement.readyState >= 2 && !isProcessing) {
        isProcessing = true;
        try {
          await pose.send({ image: videoElement });
        } catch (err) {
          console.error("Lỗi xử lý frame MediaPipe:", err);
        } finally {
          isProcessing = false;
        }
      }
    }, 100); // 10 FPS (100ms/lần) - đủ mượt, không tốn pin/CPU
  } catch (err) {
    console.error("Không thể mở webcam:", err);
  }
}

// Khi offscreen document bị đóng (người dùng tắt tiện ích): Giải phóng ngay phần cứng camera
window.addEventListener("beforeunload", () => {
  if (loopIntervalId) clearInterval(loopIntervalId);
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
  }
  console.log("Đã giải phóng camera thành công.");
});

startWebcamLoop();