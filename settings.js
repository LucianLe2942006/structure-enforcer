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

// 1. Kiểm tra trạng thái hiện tại từ background.js
async function refreshStatus() {
  chrome.runtime.sendMessage({ action: "GET_STATUS" }, (response) => {
    if (chrome.runtime.lastError || !response) return;
    updateUIState(response.isRunning);
    if (response.threshold) {
      thresholdSlider.value = response.threshold;
      thresholdValue.innerText = Number(response.threshold).toFixed(2);
    }
  });
}

function updateUIState(running) {
  isAppRunning = running;
  if (running) {
    badgeIndicator.className = "badge badge-active";
    badgeText.innerText = "ĐANG GIÁM SÁT";
    statusVisual.className = "status-visual";
    statusIcon.innerText = "👁️";
    statusHeading.innerText = "AI Camera đang hoạt động";
    statusDesc.innerText = "Mô hình MediaPipe Pose đang quét liên tục ngầm để bảo vệ cột sống của bạn.";
    btnMainToggle.className = "btn btn-danger";
    btnMainToggleText.innerText = "Yêu cầu tắt bảo vệ (Thách thức)";
  } else {
    badgeIndicator.className = "badge badge-inactive";
    badgeText.innerText = "ĐÃ TẮT";
    statusVisual.className = "status-visual off";
    statusIcon.innerText = "💤";
    statusHeading.innerText = "Hệ thống đang nghỉ";
    statusDesc.innerText = "Webcam đã được giải phóng hoàn toàn. Bấm nút dưới để bật lại chế độ bảo vệ.";
    btnMainToggle.className = "btn btn-success";
    btnMainToggleText.innerText = "Bật bảo vệ tư thế (1-Click)";
  }
}

// 2. Nút Bật / Tắt chính trên Dashboard
btnMainToggle.addEventListener('click', () => {
  if (isAppRunning) {
    // Muốn TẮT: Kích hoạt màn hình thử thách 12 bước!
    startChallenge();
  } else {
    // Muốn BẬT: 1 click là bật ngay lập tức
    chrome.runtime.sendMessage({ action: "START_TRACKING" }, () => {
      updateUIState(true);
    });
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
