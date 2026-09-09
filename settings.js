// Danh sách 12 cấp độ cảnh báo "nhây nhây" (StayFocusd Style)
const ROASTS = [
  {
    step: 1,
    emoji: "🦐",
    title: "ỦA? MỚI ĐÓ MÀ ĐÃ ĐÒI TẮT RỒI À?",
    message: "Cột sống của bạn là dây thun hay gì mà thích uốn éo thế? Ngồi làm việc có một chút đã muốn tắt đi để tiếp tục làm con tôm luộc rồi à?"
  },
  {
    step: 2,
    emoji: "💸",
    title: "BẠN ĐÃ CHUẨN BỊ 100 TRIỆU CHƯA?",
    message: "Chi phí phẫu thuật thoát vị đĩa đệm và nẹp titan cột sống hiện tại dao động từ 40 đến 100 triệu đấy! Tắt đi rồi chuẩn bị sẵn tiền viện phí nhé!"
  },
  {
    step: 3,
    emoji: "💔",
    title: "NGƯỜI YÊU CÓ THỂ CHƯA CÓ...",
    message: "...nhưng bệnh thoái hóa đốt sống cổ chắc chắn sẽ gắn bó chung thủy với bạn suốt phần đời còn lại nếu bạn cứ tiếp tục bấm tắt!"
  },
  {
    step: 4,
    emoji: "📐",
    title: "DÁNG NGỒI HÌNH DẤU CHẤM HỎI",
    message: "Nhìn lại dáng ngồi của bạn lúc này đi! Thẳng thớm đàng hoàng được mấy phút đâu mà giờ cái lưng cong vút như chiếc cầu vồng ngược rồi kìa!"
  },
  {
    step: 5,
    emoji: "👨‍👩‍👦",
    title: "BỐ MẸ CÒNG LƯNG NUÔI ĂN HỌC...",
    message: "...chứ không phải để bạn còng lưng gục mặt dí sát mũi vào màn hình máy tính! Ngồi thẳng lưng lên báo hiếu mau!"
  },
  {
    step: 6,
    emoji: "📱",
    title: "ĐỊNH TẮT ĐỂ LÀM GÌ ĐÂY?",
    message: "Để gục đầu xuống bàn bấm điện thoại hay để nằm trườn dài ra ghế lướt mạng xã hội cho sướng đúng không? AI nhìn thấu tâm can bạn rồi nhé!"
  },
  {
    step: 7,
    emoji: "🆘",
    title: "TIẾNG KÊU CỨU TỪ ĐỐT SỐNG L4-L5",
    message: "Các đĩa đệm vùng thắt lưng của bạn đang gào thét trong tuyệt vọng: 'Làm ơn đừng tắt AI, chúng tôi sắp bị đè bẹp dí rồi!'."
  },
  {
    step: 8,
    emoji: "🦥",
    title: "KIÊN TRÌ LƯỜI BIẾNG ĐẾN ĐÁNG NỂ!",
    message: "Bạn đã bấm tới lần thứ 8 rồi đấy! Ước gì bạn dành sự kiên trì bền bỉ phi thường này vào việc rèn luyện sức khỏe thì cơ thể đã khỏe mạnh biết bao!"
  },
  {
    step: 9,
    emoji: "👴",
    title: "TỰ HÌNH DUNG NĂM BẠN 30 TUỔI",
    message: "Bạn có muốn mới 30 tuổi mà đi đứng khom lưng, đứng lên ngồi xuống khớp xương kêu răng rắc như cụ ông 80 tuổi không? Nếu muốn thì cứ việc bấm tiếp!"
  },
  {
    step: 10,
    emoji: "⚖️",
    title: "LƯƠNG TÂM VÀ LÒNG TỰ TRỌNG",
    message: "Chỉ còn đúng 2 lần bấm nữa thôi. Hãy tự hỏi bản thân: Bạn thực sự muốn đầu hàng trước một thói quen xấu dễ dàng và yếu đuối thế sao?"
  },
  {
    step: 11,
    emoji: "🥺",
    title: "LẦN NÀY LÀ NĂN NỈ THẬT ĐẤY...!",
    message: "Hít một hơi thật sâu, ưỡn ngực ra, kéo hai vai ra sau, thu cằm lại... Ngồi thẳng dậy đi mà, vì tương lai của chính bản thân bạn đấy!"
  },
  {
    step: 12,
    emoji: "☠️",
    title: "BẤT LỰC! BẠN ĐÃ THẮNG AI RỒI!",
    message: "Thôi được rồi, AI xin quỳ lạy độ lì lợm của bạn! Cột sống là của bạn, muốn nó thẳng hay muốn nó thành chữ Z ngoằn ngoèo thì tùy bạn. Bấm nút dưới để TẮT HOÀN TOÀN!"
  }
];

let currentStep = 0;
let isAppRunning = true;

// DOM Elements
const badgeIndicator = document.getElementById('badgeIndicator');
const badgeText = document.getElementById('badgeText');
const statusVisual = document.getElementById('statusVisual');
const statusIcon = document.getElementById('statusIcon');
const statusHeading = document.getElementById('statusHeading');
const statusDesc = document.getElementById('statusDesc');
const btnMainToggle = document.getElementById('btnMainToggle');
const btnMainToggleText = document.getElementById('btnMainToggleText');

// Camera Alert Elements
const cameraAlertBox = document.getElementById('cameraAlertBox');
const cameraAlertTitle = document.getElementById('cameraAlertTitle');
const cameraAlertDesc = document.getElementById('cameraAlertDesc');
const btnGrantPermission = document.getElementById('btnGrantPermission');

// Camera Preview Elements
const previewImg = document.getElementById('previewImg');
const previewPosturePill = document.getElementById('previewPosturePill');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const btnTogglePreview = document.getElementById('btnTogglePreview');
const btnTogglePreviewText = document.getElementById('btnTogglePreviewText');
const previewBtnIcon = document.getElementById('previewBtnIcon');
const previewStatusBadge = document.getElementById('previewStatusBadge');

const thresholdSlider = document.getElementById('thresholdSlider');
const thresholdValue = document.getElementById('thresholdValue');

// Modal Elements
const challengeModal = document.getElementById('challengeModal');
const modalCard = document.getElementById('modalCard');
const progressFill = document.getElementById('progressFill');
const stepCounterText = document.getElementById('stepCounterText');
const stepPercentText = document.getElementById('stepPercentText');
const roastEmoji = document.getElementById('roastEmoji');
const roastTitle = document.getElementById('roastTitle');
const roastMessage = document.getElementById('roastMessage');
const btnCancelStop = document.getElementById('btnCancelStop');
const btnNextRoast = document.getElementById('btnNextRoast');
const btnNextRoastText = document.getElementById('btnNextRoastText');

function showCameraAlert(title, desc, isError = false) {
  if (cameraAlertTitle) cameraAlertTitle.innerText = title;
  if (cameraAlertDesc) cameraAlertDesc.innerText = desc;
  if (cameraAlertBox) {
    if (isError) {
      cameraAlertBox.classList.add('alert-error');
    } else {
      cameraAlertBox.classList.remove('alert-error');
    }
    cameraAlertBox.classList.remove('hidden');
  }
}

function hideCameraAlert() {
  if (cameraAlertBox) cameraAlertBox.classList.add('hidden');
}

// Hàm kích hoạt xin quyền Camera trực tiếp từ Chrome tab
async function ensureCameraPermission() {
  try {
    // Kiểm tra nhanh xem trình duyệt đã cấp quyền trước đó chưa
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const perm = await navigator.permissions.query({ name: 'camera' });
        if (perm.state === 'granted') {
          hideCameraAlert();
          return true;
        }
      } catch (permErr) {
        // Permissions query có thể không hỗ trợ, tiếp tục gọi getUserMedia
      }
    }

    // Nếu chưa có quyền, gọi getUserMedia trên tab giao diện để trình duyệt bung popup xin quyền
    const testStream = await navigator.mediaDevices.getUserMedia({
      video: true
    });
    // Ngay lập tức đóng stream tạm này để nhường webcam cho worker ngầm
    testStream.getTracks().forEach((t) => t.stop());
    hideCameraAlert();
    return true;
  } catch (err) {
    console.error("Lỗi khi yêu cầu quyền Camera:", err);
    showCameraAlert(
      "Chưa thể truy cập Camera",
      `Chi tiết: ${err.name} - ${err.message}. Nếu Chrome đã chặn, vui lòng bấm vào biểu tượng Camera/Ổ khóa ở thanh địa chỉ để cấp quyền "Cho phép" và thử lại.`,
      true
    );
    return false;
  }
}

// Bấm nút Cấp quyền trong khung cảnh báo
if (btnGrantPermission) {
  btnGrantPermission.addEventListener('click', async () => {
    btnGrantPermission.innerText = "Đang xin quyền...";
    const ok = await ensureCameraPermission();
    btnGrantPermission.innerHTML = "<span>🎥</span> <span>Cấp quyền & Kích hoạt Camera ngay</span>";
    if (ok) {
      chrome.runtime.sendMessage({ action: "START_TRACKING" }, () => {
        setTimeout(refreshStatus, 400);
      });
    }
  });
}

// 1. Kiểm tra trạng thái hiện tại từ background.js
async function refreshStatus() {
  chrome.runtime.sendMessage({ action: "GET_STATUS" }, (response) => {
    if (chrome.runtime.lastError || !response) return;
    updateUIState(response.isRunning, response.cameraStatus, response.cameraError);
    if (response.threshold) {
      thresholdSlider.value = response.threshold;
      thresholdValue.innerText = Number(response.threshold).toFixed(2);
    }
  });
}

function updateUIState(running, cameraStatus = "OFF", cameraError = null) {
  isAppRunning = running;
  if (!running || cameraStatus === "OFF") {
    badgeIndicator.className = "badge badge-inactive";
    badgeText.innerText = "ĐÃ TẮT";
    statusVisual.className = "status-visual off";
    statusIcon.innerText = "💤";
    statusHeading.innerText = "Hệ thống đang nghỉ";
    statusDesc.innerText = "Webcam đã được giải phóng hoàn toàn. Bấm nút dưới để bật lại chế độ bảo vệ.";
    btnMainToggle.className = "btn btn-success";
    btnMainToggleText.innerText = "Bật bảo vệ tư thế (1-Click)";
    hideCameraAlert();
    return;
  }

  if (cameraStatus === "CONNECTING") {
    badgeIndicator.className = "badge badge-warning";
    badgeText.innerText = "ĐANG KẾT NỐI...";
    statusVisual.className = "status-visual";
    statusIcon.innerText = "⏳";
    statusHeading.innerText = "Đang kết nối Camera AI";
    statusDesc.innerText = "Đang khởi động phần cứng webcam và nạp mô hình MediaPipe...";
    btnMainToggle.className = "btn btn-danger";
    btnMainToggleText.innerText = "Tắt giám sát";
    hideCameraAlert();
    return;
  }

  // Lỗi kết nối Camera
  if (cameraStatus === "ERROR") {
    badgeIndicator.className = "badge badge-error";
    badgeText.innerText = "LỖI CAMERA";
    statusVisual.className = "status-visual off";
    statusIcon.innerText = "⚠️";
    statusHeading.innerText = "Chưa thể kết nối Camera";
    statusDesc.innerText = cameraError || "Không thể khởi động phần cứng webcam. Vui lòng cấp quyền Camera.";
    btnMainToggle.className = "btn btn-danger";
    btnMainToggleText.innerText = "Tắt giám sát";
    showCameraAlert(
      "Cần cấp quyền truy cập Camera",
      cameraError || "Webcam bị ứng dụng khác chiếm giữ hoặc chưa được cấp quyền.",
      true
    );
    return;
  }

  // ACTIVE - Đèn webcam đang sáng & AI đang quét
  badgeIndicator.className = "badge badge-active";
  badgeText.innerText = "ĐANG GIÁM SÁT";
  statusVisual.className = "status-visual";
  statusIcon.innerText = "👁️";
  statusHeading.innerText = "AI Camera đang hoạt động";
  statusDesc.innerText = "Mô hình MediaPipe Pose đang quét liên tục ngầm (đèn webcam đang sáng) để bảo vệ cột sống.";
  btnMainToggle.className = "btn btn-danger";
  btnMainToggleText.innerText = "Yêu cầu tắt bảo vệ (Thách thức)";
  hideCameraAlert();
}

// Lắng nghe cập nhật trạng thái Camera và Frame xem trước từ offscreen
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "CAMERA_STATUS_UPDATE") {
    refreshStatus();
  } else if (msg.action === "PREVIEW_FRAME" && msg.dataUrl && isPreviewActive) {
    if (previewImg) {
      previewImg.src = msg.dataUrl;
    }
    if (previewPosturePill) {
      previewPosturePill.classList.remove('hidden');
      if (msg.isLocked) {
        previewPosturePill.className = "preview-posture-pill pill-bad";
        previewPosturePill.innerText = "⚠️ SAI TƯ THẾ (GÙ LƯNG)";
      } else {
        previewPosturePill.className = "preview-posture-pill pill-good";
        previewPosturePill.innerText = "🟢 TƯ THẾ CHUẨN";
      }
    }
  }
});

// 2. Nút Bật / Tắt chính trên Dashboard
btnMainToggle.addEventListener('click', async () => {
  if (isAppRunning) {
    // Muốn TẮT: Kích hoạt màn hình thử thách 12 bước!
    startChallenge();
  } else {
    // Muốn BẬT: Đảm bảo có quyền Camera trước
    btnMainToggleText.innerText = "Đang kết nối camera...";
    const hasPermission = await ensureCameraPermission();
    if (!hasPermission) {
      btnMainToggleText.innerText = "Bật bảo vệ tư thế (1-Click)";
      return;
    }

    chrome.runtime.sendMessage({ action: "START_TRACKING" }, () => {
      setTimeout(refreshStatus, 400);
    });
  }
});

// 3. Tính năng Xem trước Camera trực tiếp (Nhận stream từ AI Worker ngầm)
let isPreviewActive = false;

function togglePreview() {
  if (isPreviewActive) {
    stopPreview();
  } else {
    startPreview();
  }
}

function startPreview() {
  isPreviewActive = true;
  chrome.runtime.sendMessage({ action: "START_PREVIEW_STREAM" }).catch(() => { });

  previewPlaceholder.classList.add('hidden');
  if (previewImg) previewImg.classList.remove('hidden');
  previewStatusBadge.classList.remove('hidden');
  previewBtnIcon.innerText = "🛑";
  btnTogglePreviewText.innerText = "Dừng xem trước";
  btnTogglePreview.style.borderColor = "rgba(248, 81, 73, 0.5)";
  btnTogglePreview.style.color = "#ff7b72";
}

function stopPreview() {
  isPreviewActive = false;
  chrome.runtime.sendMessage({ action: "STOP_PREVIEW_STREAM" }).catch(() => { });

  if (previewImg) {
    previewImg.src = "";
    previewImg.classList.add('hidden');
  }
  if (previewPosturePill) {
    previewPosturePill.classList.add('hidden');
  }
  if (previewPlaceholder) {
    previewPlaceholder.classList.remove('hidden');
  }
  if (previewStatusBadge) {
    previewStatusBadge.classList.add('hidden');
  }
  previewBtnIcon.innerText = "👁️";
  btnTogglePreviewText.innerText = "Bật xem trước camera";
  btnTogglePreview.style.borderColor = "";
  btnTogglePreview.style.color = "";
}

btnTogglePreview.addEventListener('click', togglePreview);

// Dừng luồng preview nếu người dùng đóng hoặc reload tab settings
window.addEventListener('beforeunload', () => {
  if (isPreviewActive) stopPreview();
});

// Tự động tạm dừng gửi frame xem trước khi người dùng chuyển sang tab khác
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && isPreviewActive) {
    stopPreview();
  }
});

// 3. Logic thử thách 12 bước (StayFocusd Style)
function startChallenge() {
  currentStep = 0;
  challengeModal.classList.remove('hidden');
  renderRoastStep(currentStep);
}

function renderRoastStep(index) {
  const roast = ROASTS[index];
  const stepNum = index + 1;
  const percent = Math.round((stepNum / ROASTS.length) * 100);

  // Cập nhật thanh tiến trình
  progressFill.style.width = `${percent}%`;
  stepCounterText.innerText = `CẢNH BÁO: ${stepNum} / ${ROASTS.length}`;
  stepPercentText.innerText = `${percent}%`;

  // Cập nhật nội dung roast
  roastEmoji.innerText = roast.emoji;
  roastTitle.innerText = roast.title;
  roastMessage.innerText = roast.message;

  // Cập nhật nút bấm
  if (stepNum === ROASTS.length) {
    btnNextRoast.style.background = "#f85149";
    btnNextRoast.style.color = "#ffffff";
    btnNextRoastText.innerText = "🛑 TÔI CHẤP NHẬN CÒNG LƯNG, TẮT HẲN ĐI!";
  } else {
    btnNextRoast.style.background = "transparent";
    btnNextRoast.style.color = "#8b949e";
    btnNextRoastText.innerText = `Tôi vẫn kiên quyết muốn tắt (${stepNum}/${ROASTS.length})`;
  }

  // Hiệu ứng rung lắc thẻ modal
  modalCard.classList.remove('shake');
  void modalCard.offsetWidth; // Trigger reflow
  modalCard.classList.add('shake');
}

// Bấm nút "Tôi đổi ý rồi! Tôi sẽ ngồi thẳng lưng" (Hủy tắt)
btnCancelStop.addEventListener('click', () => {
  challengeModal.classList.add('hidden');
  currentStep = 0;
});

// Bấm nút "Vẫn muốn tắt" -> Chuyển sang bước kế tiếp
btnNextRoast.addEventListener('click', () => {
  currentStep++;
  if (currentStep < ROASTS.length) {
    renderRoastStep(currentStep);
  } else {
    // ĐÃ VƯỢT QUA CẢ 12 LẦN! THỰC SỰ CHO TẮT!
    challengeModal.classList.add('hidden');
    currentStep = 0;
    chrome.runtime.sendMessage({ action: "STOP_TRACKING" }, () => {
      updateUIState(false);
    });
  }
});

// 4. Thanh trượt chỉnh độ nhạy Slouch Threshold
thresholdSlider.addEventListener('input', (e) => {
  const val = parseFloat(e.target.value);
  thresholdValue.innerText = val.toFixed(2);
  chrome.runtime.sendMessage({ action: "SET_THRESHOLD", threshold: val });
  chrome.storage.local.set({ slouchThreshold: val });
});

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
  refreshStatus();
  chrome.storage.local.get(['slouchThreshold'], (res) => {
    if (res.slouchThreshold) {
      thresholdSlider.value = res.slouchThreshold;
      thresholdValue.innerText = Number(res.slouchThreshold).toFixed(2);
    }
  });
});
