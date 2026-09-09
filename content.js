(() => {
    const OVERLAY_ID = "spine-guard-eos-blocker";
    console.log("🛡️ Posture Enforcer content script đã nạp thành công trên trang này!");

    function showLockOverlay() {
        if (document.getElementById(OVERLAY_ID)) return;

        const overlay = document.createElement("div");
        overlay.id = OVERLAY_ID;
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.backgroundColor = "rgba(10, 10, 15, 0.88)";
        overlay.style.backdropFilter = "blur(18px)";
        overlay.style.webkitBackdropFilter = "blur(18px)";
        overlay.style.zIndex = "2147483647";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.color = "white";
        overlay.style.fontFamily = "system-ui, -apple-system, sans-serif";
        overlay.style.userSelect = "none";
        overlay.style.pointerEvents = "all";
        overlay.style.transition = "opacity 0.25s ease-in-out";

        const icon = document.createElement("div");
        icon.innerHTML = "⚠️";
        icon.style.fontSize = "80px";
        icon.style.marginBottom = "20px";

        const title = document.createElement("h1");
        title.innerText = "CẢNH BÁO SAI TƯ THẾ!";
        title.style.fontSize = "42px";
        title.style.fontWeight = "700";
        title.style.color = "#ff4757";
        title.style.margin = "0 0 15px 0";
        title.style.textAlign = "center";

        const desc = document.createElement("p");
        desc.innerText = "Hãy ngồi thẳng lưng và nâng cằm dậy để tiếp tục làm việc.";
        desc.style.fontSize = "20px";
        desc.style.color = "#ced6e0";
        desc.style.margin = "0";
        desc.style.textAlign = "center";

        overlay.appendChild(icon);
        overlay.appendChild(title);
        overlay.appendChild(desc);
        document.body.appendChild(overlay);

        document.body.style.overflow = "hidden";
    }

    function removeLockOverlay() {
        const overlay = document.getElementById(OVERLAY_ID);
        if (overlay) {
            overlay.remove();
            document.body.style.overflow = "auto";
        }
    }

    chrome.runtime.onMessage.addListener((request) => {
        console.log("🛡️ Posture Enforcer nhận tín hiệu:", request.action);
        if (request.action === "TRIGGER_LOCK") {
            showLockOverlay();
        } else if (request.action === "TRIGGER_UNLOCK") {
            removeLockOverlay();
        }
    });

    // Tự động kiểm tra trạng thái khóa ngay khi vừa nạp trang
    chrome.runtime.sendMessage({ action: "GET_LOCK_STATE" }, (response) => {
        if (chrome.runtime.lastError) return;
        if (response && response.isLocked) {
            showLockOverlay();
        }
    });
})();