(() => {
    const OVERLAY_ID = "spine-guard-eos-blocker";
    const STYLES_ID = "spine-guard-eos-styles";

    // Nếu script được tiêm lại (khi reload extension), dọn dẹp listener cũ và overlay cũ
    if (window.__POSTURE_ENFORCER_MSG_LISTENER__) {
        try {
            chrome.runtime.onMessage.removeListener(window.__POSTURE_ENFORCER_MSG_LISTENER__);
        } catch (e) { }
    }
    const oldOverlay = document.getElementById(OVERLAY_ID);
    if (oldOverlay) oldOverlay.remove();

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
            @keyframes posture-pulse {
                0% { box-shadow: 0 0 20px rgba(255, 71, 87, 0.3); border-color: rgba(255, 71, 87, 0.6); }
                100% { box-shadow: 0 0 45px rgba(255, 71, 87, 0.7); border-color: #ff4757; }
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
            background-color: rgba(10, 12, 16, 0.92) !important;
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
        previewContainer.id = "posture-lock-preview-container";
        previewContainer.style.cssText = `
            position: relative !important;
            width: 100% !important;
            aspect-ratio: 4 / 3 !important;
            background: #090d12 !important;
            border: 1.5px solid rgba(255, 71, 87, 0.6) !important;
            border-radius: 16px !important;
            overflow: hidden !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-sizing: border-box !important;
            box-shadow: 0 0 25px rgba(255, 71, 87, 0.25) !important;
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

        // Embedded Warning Banner inside Preview
        const warningBanner = document.createElement("div");
        warningBanner.id = "posture-lock-banner";
        warningBanner.style.cssText = `
            position: absolute !important;
            bottom: 10px !important;
            left: 10px !important;
            right: 10px !important;
            background: rgba(26, 10, 14, 0.92) !important;
            backdrop-filter: blur(14px) !important;
            -webkit-backdrop-filter: blur(14px) !important;
            border: 1px solid rgba(255, 71, 87, 0.6) !important;
            border-radius: 12px !important;
            padding: 8px 12px !important;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6) !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            z-index: 10 !important;
            pointer-events: none !important;
            transition: all 0.25s ease !important;
        `;
        warningBanner.innerHTML = `
            <span style="font-size: 20px;">⚠️</span>
            <div style="display:flex; flex-direction:column; gap:2px; text-align:left;">
                <strong style="font-size:12px; font-weight:800; color:#ff7b72; letter-spacing:0.3px;">CẢNH BÁO SAI TƯ THẾ!</strong>
                <span style="font-size:11px; color:#c9d1d9;">Bạn đang cúi gục đầu hoặc gù lưng. Hãy nâng cằm lên!</span>
            </div>
        `;

        previewContainer.appendChild(placeholder);
        previewContainer.appendChild(previewImg);
        previewContainer.appendChild(pill);
        previewContainer.appendChild(warningBanner);

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

    const messageHandler = (request) => {
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
            const banner = document.getElementById("posture-lock-banner");
            const container = document.getElementById("posture-lock-preview-container");

            if (img) {
                img.src = request.dataUrl;
                img.style.display = "block";
                if (placeholder) placeholder.style.display = "none";
            }

            if (request.isLocked) {
                if (pill) {
                    pill.style.background = "rgba(40, 10, 15, 0.88)";
                    pill.style.color = "#ff4757";
                    pill.style.borderColor = "rgba(255, 71, 87, 0.5)";
                    pill.innerText = "⚠️ ĐANG GÙ LƯNG";
                }
                if (banner) {
                    banner.style.background = "rgba(26, 10, 14, 0.92)";
                    banner.style.borderColor = "rgba(255, 71, 87, 0.6)";
                    banner.innerHTML = `
                        <span style="font-size: 20px;">⚠️</span>
                        <div style="display:flex; flex-direction:column; gap:2px; text-align:left;">
                            <strong style="font-size:12px; font-weight:800; color:#ff7b72; letter-spacing:0.3px;">CẢNH BÁO SAI TƯ THẾ!</strong>
                            <span style="font-size:11px; color:#c9d1d9;">Bạn đang cúi gục đầu hoặc gù lưng. Hãy nâng cằm lên!</span>
                        </div>
                    `;
                }
                if (container) {
                    container.style.borderColor = "rgba(255, 71, 87, 0.6)";
                    container.style.boxShadow = "0 0 25px rgba(255, 71, 87, 0.35)";
                }
            } else {
                if (pill) {
                    pill.style.background = "rgba(10, 30, 20, 0.88)";
                    pill.style.color = "#2ed573";
                    pill.style.borderColor = "rgba(46, 213, 115, 0.5)";
                    pill.innerText = "🟢 TƯ THẾ CHUẨN";
                }
                if (banner) {
                    banner.style.background = "rgba(10, 30, 20, 0.92)";
                    banner.style.borderColor = "rgba(46, 213, 115, 0.6)";
                    banner.innerHTML = `
                        <span style="font-size: 20px;">🟢</span>
                        <div style="display:flex; flex-direction:column; gap:2px; text-align:left;">
                            <strong style="font-size:12px; font-weight:800; color:#2ed573; letter-spacing:0.3px;">TƯ THẾ ĐÃ CHUẨN!</strong>
                            <span style="font-size:11px; color:#c9d1d9;">Đang tự động mở khóa màn hình...</span>
                        </div>
                    `;
                }
                if (container) {
                    container.style.borderColor = "rgba(46, 213, 115, 0.6)";
                    container.style.boxShadow = "0 0 25px rgba(46, 213, 115, 0.35)";
                }
            }
        }
    };

    window.__POSTURE_ENFORCER_MSG_LISTENER__ = messageHandler;
    chrome.runtime.onMessage.addListener(messageHandler);

    // Tự động kiểm tra trạng thái khóa ngay khi vừa nạp trang
    chrome.runtime.sendMessage({ action: "GET_LOCK_STATE" }, (response) => {
        if (chrome.runtime.lastError) return;
        if (response && response.isLocked) {
            showLockOverlay();
        }
    });
})();