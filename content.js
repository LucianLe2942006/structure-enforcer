(() => {
    if (window.__POSTURE_ENFORCER_INJECTED__) return;
    window.__POSTURE_ENFORCER_INJECTED__ = true;

    const OVERLAY_ID = "spine-guard-eos-blocker";
    const STYLES_ID = "spine-guard-eos-styles";
    console.log("🛡️ Posture Enforcer content script đã nạp thành công trên trang này!");

    function injectStyles() {
        if (document.getElementById(STYLES_ID)) return;
        const style = document.createElement("style");
        style.id = STYLES_ID;
        style.textContent = `
            @keyframes posture-pop {
                0% { opacity: 0; transform: scale(0.9) translateY(20px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes posture-shake {
                10%, 90% { transform: translate3d(-1px, 0, 0); }
                20%, 80% { transform: translate3d(2px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
                40%, 60% { transform: translate3d(3px, 0, 0); }
            }
        `;
        document.head.appendChild(style);
    }

    function showLockOverlay() {
        if (document.getElementById(OVERLAY_ID)) return;
        injectStyles();

        const overlay = document.createElement("div");
        overlay.id = OVERLAY_ID;
        overlay.style.cssText = `
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background-color: rgba(10, 12, 16, 0.9) !important;
            backdrop-filter: blur(24px) !important;
            -webkit-backdrop-filter: blur(24px) !important;
            z-index: 2147483647 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
            user-select: none !important;
            pointer-events: all !important;
            transition: opacity 0.3s ease-in-out !important;
            padding: 20px !important;
            box-sizing: border-box !important;
        `;

        // Card Container
        const card = document.createElement("div");
        card.style.cssText = `
            background: #161b22 !important;
            border: 1.5px solid #ff4757 !important;
            border-radius: 24px !important;
            padding: 24px 28px !important;
            max-width: 480px !important;
            width: 100% !important;
            box-shadow: 0 24px 70px rgba(0, 0, 0, 0.85), 0 0 50px rgba(255, 71, 87, 0.35) !important;
            animation: posture-pop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            box-sizing: border-box !important;
        `;

        // Title Area
        const titleRow = document.createElement("div");
        titleRow.style.cssText = `
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            margin-bottom: 6px !important;
        `;

        const warningIcon = document.createElement("span");
        warningIcon.innerText = "⚠️";
        warningIcon.style.fontSize = "24px";

        const title = document.createElement("h2");
        title.innerText = "CẢNH BÁO SAI TƯ THẾ!";
        title.style.cssText = `
            font-size: 20px !important;
            font-weight: 800 !important;
            color: #ff7b72 !important;
            margin: 0 !important;
            letter-spacing: -0.3px !important;
            text-transform: uppercase !important;
        `;

        titleRow.appendChild(warningIcon);
        titleRow.appendChild(title);

        const subtitle = document.createElement("p");
        subtitle.innerText = "Hãy ngồi thẳng lưng và nâng cằm lên để tự động mở khóa";
        subtitle.style.cssText = `
            font-size: 13px !important;
            color: #8b949e !important;
            margin: 0 0 16px 0 !important;
            text-align: center !important;
        `;

        // Video Preview Container
        const previewContainer = document.createElement("div");
        previewContainer.style.cssText = `
            position: relative !important;
            width: 100% !important;
            aspect-ratio: 4 / 3 !important;
            background: #090d12 !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 16px !important;
            overflow: hidden !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-sizing: border-box !important;
        `;

        // Loading Placeholder
        const placeholder = document.createElement("div");
        placeholder.id = "posture-lock-placeholder";
        placeholder.style.cssText = `
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 8px !important;
            color: #8b949e !important;
            font-size: 13px !important;
        `;
        placeholder.innerHTML = `<span style="font-size:28px;">📷</span><span>Đang tải luồng camera AI...</span>`;

        // Image Preview Element
        const previewImg = document.createElement("img");
        previewImg.id = "posture-lock-preview-img";
        previewImg.style.cssText = `
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            display: none !important;
        `;

        // Floating Posture Status Pill
        const pill = document.createElement("div");
        pill.id = "posture-lock-pill";
        pill.innerText = "⚠️ ĐANG GÙ LƯNG";
        pill.style.cssText = `
            position: absolute !important;
            top: 12px !important;
            left: 12px !important;
            padding: 6px 14px !important;
            border-radius: 999px !important;
            font-size: 12px !important;
            font-weight: 700 !important;
            background: rgba(40, 10, 15, 0.88) !important;
            color: #ff4757 !important;
            border: 1px solid rgba(255, 71, 87, 0.5) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5) !important;
            z-index: 5 !important;
            transition: all 0.25s ease !important;
        `;

        previewContainer.appendChild(placeholder);
        previewContainer.appendChild(previewImg);
        previewContainer.appendChild(pill);

        // Footer Guidance
        const footerText = document.createElement("div");
        footerText.style.cssText = `
            margin-top: 16px !important;
            font-size: 12px !important;
            color: #c9d1d9 !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            background: rgba(255, 255, 255, 0.05) !important;
            padding: 8px 16px !important;
            border-radius: 999px !important;
        `;
        footerText.innerHTML = `<span style="color:#3fb950;">✨</span> <span>Màn hình sẽ <b>tự động mở khóa</b> khi đường vai & cằm của bạn thẳng!</span>`;

        card.appendChild(titleRow);
        card.appendChild(subtitle);
        card.appendChild(previewContainer);
        card.appendChild(footerText);
        overlay.appendChild(card);
        document.body.appendChild(overlay);

        document.body.style.overflow = "hidden";
    }

    function removeLockOverlay() {
        const overlay = document.getElementById(OVERLAY_ID);
        if (overlay) {
            overlay.style.opacity = "0";
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = "auto";
            }, 250);
        }
    }

    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === "TRIGGER_LOCK") {
            showLockOverlay();
        } else if (request.action === "TRIGGER_UNLOCK") {
            removeLockOverlay();
        } else if (request.action === "PREVIEW_FRAME" && request.dataUrl) {
            const overlay = document.getElementById(OVERLAY_ID);
            if (!overlay) return;

            const img = document.getElementById("posture-lock-preview-img");
            const placeholder = document.getElementById("posture-lock-placeholder");
            const pill = document.getElementById("posture-lock-pill");

            if (img) {
                img.src = request.dataUrl;
                img.style.display = "block";
                if (placeholder) placeholder.style.display = "none";
            }

            if (pill) {
                if (request.isLocked) {
                    pill.style.background = "rgba(40, 10, 15, 0.88)";
                    pill.style.color = "#ff4757";
                    pill.style.borderColor = "rgba(255, 71, 87, 0.5)";
                    pill.innerText = "⚠️ ĐANG GÙ LƯNG";
                } else {
                    pill.style.background = "rgba(10, 30, 20, 0.88)";
                    pill.style.color = "#2ed573";
                    pill.style.borderColor = "rgba(46, 213, 115, 0.5)";
                    pill.innerText = "🟢 TƯ THẾ CHUẨN";
                }
            }
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