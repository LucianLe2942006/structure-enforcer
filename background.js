async function hasOffscreenDocument() {
  const offscreenUrl = chrome.runtime.getURL('offscreen.html');
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [offscreenUrl]
  });
  return existingContexts.length > 0;
}

async function startPostureTracking() {
  if (await hasOffscreenDocument()) return;

  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['USER_MEDIA'],
    justification: 'MediaPipe tracking'
  });

  // Cập nhật Badge trên toolbar: ON (Màu xanh lá)
  chrome.action.setBadgeText({ text: "ON" });
  chrome.action.setBadgeBackgroundColor({ color: "#2ed573" });
  chrome.action.setTitle({ title: "Posture Enforcer: Đang BẬT (Bấm để tắt camera)" });
  console.log("🟢 Posture Tracking: ĐÃ BẬT");
}

async function stopPostureTracking() {
  try {
    if (await hasOffscreenDocument()) {
      await chrome.offscreen.closeDocument();
    }
  } catch (err) {
    console.warn("Lỗi đóng offscreen document:", err);
  }

  // Tự động gỡ bỏ khóa màn hình nếu đang bị khóa
  isSystemLocked = false;
  broadcastLockState(false);

  // Cập nhật Badge trên toolbar: OFF (Màu xám)
  chrome.action.setBadgeText({ text: "OFF" });
  chrome.action.setBadgeBackgroundColor({ color: "#747d8c" });
  chrome.action.setTitle({ title: "Posture Enforcer: Đã TẮT (Bấm để bật camera)" });
  console.log("🔴 Posture Tracking: ĐÃ TẮT");
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

// Khi vừa cài đặt hoặc nạp lại tiện ích: Mặc định bật và đặt badge ON
chrome.runtime.onInstalled.addListener(async () => {
  await startPostureTracking();
});

// Khi mở trình duyệt: Đồng bộ lại trạng thái hiển thị
chrome.runtime.onStartup.addListener(async () => {
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
  } else if (message.action === "GET_LOCK_STATE") {
    sendResponse({ isLocked: isSystemLocked });
  } else if (message.action === "GET_STATUS") {
    hasOffscreenDocument().then((isRunning) => {
      chrome.storage.local.get(['slouchThreshold'], (stored) => {
        sendResponse({
          isRunning,
          isLocked: isSystemLocked,
          threshold: stored.slouchThreshold || 0.22
        });
      });
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