let cameraStatus = "OFF"; // "ACTIVE" | "ERROR" | "OFF"
let cameraErrorMsg = null;

async function hasOffscreenDocument() {
  const offscreenUrl = chrome.runtime.getURL('offscreen.html');
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [offscreenUrl]
  });
  return existingContexts.length > 0;
}

async function startPostureTracking() {
  try {
    cameraStatus = "CONNECTING";
    chrome.action.setBadgeText({ text: "..." });
    chrome.action.setBadgeBackgroundColor({ color: "#e67e22" });
    chrome.action.setTitle({ title: "Posture Enforcer: Đang kết nối camera..." });

    const exists = await hasOffscreenDocument();
    if (!exists) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['USER_MEDIA'],
        justification: 'MediaPipe tracking'
      });
    } else {
      // Nếu offscreen đã có sẵn, gửi lệnh đảm bảo camera đang chạy
      chrome.runtime.sendMessage({ action: "RESTART_CAMERA" }).catch(() => { });
    }

    console.log("🟡 Posture Tracking: Đang yêu cầu kết nối camera...");
    ensureContentScriptsInjected();
  } catch (err) {
    console.error("Lỗi khi tạo offscreen document:", err);
    cameraStatus = "ERROR";
    cameraErrorMsg = err.message || "Lỗi tạo tài liệu chạy ngầm";
    chrome.action.setBadgeText({ text: "ERR" });
    chrome.action.setBadgeBackgroundColor({ color: "#eb4d4b" });
    chrome.action.setTitle({ title: `Posture Enforcer: ${cameraErrorMsg}` });
  }
}

async function stopPostureTracking() {
  try {
    if (await hasOffscreenDocument()) {
      await chrome.offscreen.closeDocument();
    }
  } catch (err) {
    console.warn("Lỗi đóng offscreen document:", err);
  }

  cameraStatus = "OFF";
  cameraErrorMsg = null;

  // Tự động gỡ bỏ khóa màn hình nếu đang bị khóa
  isSystemLocked = false;
  broadcastLockState(false);

  // Cập nhật Badge trên toolbar: OFF (Màu xám)
  chrome.action.setBadgeText({ text: "OFF" });
  chrome.action.setBadgeBackgroundColor({ color: "#747d8c" });
  chrome.action.setTitle({ title: "Posture Enforcer: Đã TẮT (Bấm để bật camera)" });
  console.log("🔴 Posture Tracking: ĐÃ TẮT");
}

// Tự động tiêm content script vào tất cả các tab web đang mở để không cần F5 thủ công
function ensureContentScriptsInjected() {
  chrome.tabs.query({ url: ["http://*/*", "https://*/*"] }, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }).catch(() => { });
      }
    }
  });
}

// Bấm vào Icon trên Toolbar: Mở trang Cài đặt & Thử thách Kỷ luật
chrome.action.onClicked.addListener(async () => {
  const settingsUrl = chrome.runtime.getURL('settings.html');
  const tabs = await chrome.tabs.query({ url: settingsUrl });
  if (tabs.length > 0 && tabs[0].id) {
    chrome.tabs.update(tabs[0].id, { active: true });
  } else {
    chrome.tabs.create({ url: settingsUrl });
  }
});

// Khi vừa cài đặt hoặc nạp lại tiện ích: Mặc định bật, đặt badge ON và inject content scripts
chrome.runtime.onInstalled.addListener(async () => {
  await startPostureTracking();
  ensureContentScriptsInjected();
});

// Khi mở trình duyệt: Đồng bộ lại trạng thái hiển thị
chrome.runtime.onStartup.addListener(async () => {
  ensureContentScriptsInjected();
  const isRunning = await hasOffscreenDocument();
  if (isRunning) {
    chrome.action.setBadgeText({ text: "ON" });
    chrome.action.setBadgeBackgroundColor({ color: "#2ed573" });
  } else {
    chrome.action.setBadgeText({ text: "OFF" });
    chrome.action.setBadgeBackgroundColor({ color: "#747d8c" });
  }
});

let isSystemLocked = false;

function broadcastLockState(isLocked) {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          action: isLocked ? "TRIGGER_LOCK" : "TRIGGER_UNLOCK"
        }).catch(() => { });
      }
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "TRIGGER_LOCK") {
    isSystemLocked = true;
    broadcastLockState(true);
  } else if (message.action === "TRIGGER_UNLOCK") {
    isSystemLocked = false;
    broadcastLockState(false);
  } else if (message.action === "CAMERA_STATUS_UPDATE") {
    cameraStatus = message.status;
    cameraErrorMsg = message.error;
    if (cameraStatus === "ACTIVE") {
      chrome.action.setBadgeText({ text: "ON" });
      chrome.action.setBadgeBackgroundColor({ color: "#2ed573" });
      chrome.action.setTitle({ title: "Posture Enforcer: Đang BẬT (Bảo vệ cột sống)" });
    } else if (cameraStatus === "ERROR") {
      chrome.action.setBadgeText({ text: "ERR" });
      chrome.action.setBadgeBackgroundColor({ color: "#eb4d4b" });
      chrome.action.setTitle({ title: `Posture Enforcer Lỗi Camera: ${cameraErrorMsg}` });
    }
  } else if (message.action === "GET_LOCK_STATE") {
    sendResponse({ isLocked: isSystemLocked });
  } else if (message.action === "GET_STATUS") {
    hasOffscreenDocument().then((isRunning) => {
      chrome.storage.local.get(['slouchThreshold'], (stored) => {
        sendResponse({
          isRunning,
          isLocked: isSystemLocked,
          cameraStatus: isRunning ? cameraStatus : "OFF",
          cameraError: cameraErrorMsg,
          threshold: stored ? stored.slouchThreshold || 0.22 : 0.22
        });
      });
    });
    return true; // async response
  } else if (message.action === "GET_INITIAL_THRESHOLD") {
    chrome.storage.local.get(['slouchThreshold'], (stored) => {
      sendResponse({ threshold: stored ? stored.slouchThreshold || 0.22 : 0.22 });
    });
    return true; // async response
  } else if (message.action === "START_TRACKING") {
    startPostureTracking().then(() => sendResponse({ success: true }));
    return true;
  } else if (message.action === "STOP_TRACKING") {
    stopPostureTracking().then(() => sendResponse({ success: true }));
    return true;
  } else if (message.action === "SET_THRESHOLD") {
    // Chuyển tiếp ngưỡng tới offscreen document
    chrome.runtime.sendMessage({
      action: "UPDATE_OFFSCREEN_THRESHOLD",
      threshold: message.threshold
    }).catch(() => { });
  } else if (message.action === "PREVIEW_FRAME") {
    // Nếu hệ thống đang bị khóa, chuyển tiếp frame tới tab đang hoạt động để hiển thị camera trực tiếp
    if (isSystemLocked) {
      chrome.tabs.query({ active: true }, (tabs) => {
        if (tabs) {
          for (const tab of tabs) {
            if (tab.id) {
              chrome.tabs.sendMessage(tab.id, message).catch(() => { });
            }
          }
        }
      });
    }
  }
});

// Khi người dùng chuyển sang tab khác: Nếu đang bị khóa thì lập tức khóa tab đó!
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (isSystemLocked && activeInfo.tabId) {
    chrome.tabs.sendMessage(activeInfo.tabId, { action: "TRIGGER_LOCK" }).catch(() => { });
  }
});

// Khi một tab tải xong trang web: Nếu đang bị khóa thì lập tức khóa tab đó!
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (isSystemLocked && changeInfo.status === "complete") {
    chrome.tabs.sendMessage(tabId, { action: "TRIGGER_LOCK" }).catch(() => { });
  }
});