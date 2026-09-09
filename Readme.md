# 🛡️ Posture Enforcer MVP

> **Tiện ích mở rộng Chrome rèn luyện tư thế làm việc bằng cơ chế "Kỷ luật thép" (Active Disruption).**  
> Dự án MVP phục vụ nghiên cứu & kiểm chứng giải pháp cho môn học **EXE101 - Experiential Entrepreneurship**.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-success.svg)]()
[![MediaPipe Pose](https://img.shields.io/badge/AI%20Engine-MediaPipe%20Pose%20(WASM)-orange.svg)]()
[![Client-side Privacy](https://img.shields.io/badge/Privacy-100%25%20On--Device-brightgreen.svg)]()

---

## 📌 1. Tổng quan & Bài toán (Problem & Solution)

* **Vấn đề (Pain Point):** Sinh viên ngành IT, thiết kế và nhân viên văn phòng thường vô thức gù lưng, khom cổ và gục mặt sát màn hình khi tập trung làm việc. Các ứng dụng nhắc nhở thụ động (Passive Ping, Popup nhỏ) trên thị trường thường dễ dàng bị phớt lờ, gạt bỏ hoặc tắt đi trong vòng 1 giây mà không tạo ra thay đổi hành vi thực sự.
* **Giải pháp (USP - Active Disruption):** Giám sát tư thế trực tiếp qua webcam ngầm bằng trí tuệ nhân tạo (AI). Khi phát hiện người dùng khom lưng hoặc gục đầu quá 1 giây, hệ thống sẽ **phong tỏa toàn bộ giao diện trang web** (phong cách EOS/SEB). 
* **Điểm đột phá:** Cảnh báo sai tư thế được **lồng trực tiếp vào khung xem trước video AI thời gian thực** kèm bộ khung xương (Landmark Skeleton). Cách duy nhất để màn hình mở khóa là người dùng **bắt buộc phải nhìn vào camera và ngồi thẳng lưng dậy**.

---

## ✨ 2. Tính năng cốt lõi (Core Features)

### 📹 1. Cảnh báo sai tư thế lồng trực tiếp Video Preview AI (Live Preview Lock Screen)
* **Khóa màn hình chủ động (Active Blocker):** Khi ngồi sai tư thế liên tục ~1 giây, trang web hiện tại lập tức bị phủ mờ (blur), khóa toàn bộ chuột & bàn phím.
* **Lồng trực tiếp Video Preview AI vào cảnh báo:** Khung video gương soi chiếu thời gian thực được nhúng ngay giữa modal, vẽ trực quan bộ khung xương AI (đường nối hai vai và điểm định vị mũi).
* **Banner cảnh báo tích hợp trong video:**
  - `⚠️ CẢNH BÁO SAI TƯ THẾ!`: Banner kính mờ (frosted glass) trượt lên ngay cạnh dưới video, nhắc nhở nâng cằm và thẳng lưng.
  - Nhãn trạng thái nổi thời gian thực: `⚠️ ĐANG GÙ LƯNG` (đỏ) ↔ `🟢 TƯ THẾ CHUẨN` (xanh lá).
* **Mở khóa mượt mà (Graceful Unlock):** Ngay khi bạn ngồi thẳng lưng dậy, đường xương vai và banner lập tức chuyển sang màu xanh lá xác nhận trong 0.8 giây trước khi nhẹ nhàng mở khóa và hoàn trả lại trang web nguyên vẹn.
* **Không bị lật ngược chữ (No Flipped Text):** Video và khung xương được lật gương tự nhiên (`scale(-1, 1)`), trong khi toàn bộ chữ và nhãn cảnh báo được hiển thị bằng HTML DOM vector thuần, đảm bảo chữ luôn đọc xuôi, sắc nét và rõ ràng 100%.

### 🎛️ 2. Trang Cài đặt Dashboard & Kiểm tra Camera thông minh
* **Giao diện Dark Glassmorphism** hiện đại, hiển thị trực quan trạng thái kết nối phần cứng webcam (`ĐANG GIÁM SÁT`, `ĐANG KẾT NỐI...`, `LỖI CAMERA`, `ĐÃ TẮT`).
* **Live Camera Preview với Cảnh báo gù lưng tích hợp:**
  - Bật xem trước để kiểm tra góc camera, đường xương vai và điểm mũi.
  - Khi gù lưng: Khung preview phát hiệu ứng viền đỏ xung nhịp (`.slouching`) và trượt banner cảnh báo nhắc nhở trực tiếp bên trong video.
  - **Tự động kích hoạt Preview:** Nếu bạn đang ở trang Cài đặt mà bị gù lưng, hệ thống sẽ tự động bật luồng camera preview kèm cảnh báo để bạn theo dõi và điều chỉnh ngay lập tức.
* **Kiến trúc Zero-Conflict (Độc quyền xử lý Webcam Windows):** Worker ngầm nắm giữ phần cứng camera 24/7 và stream trực tiếp frame sang trang Cài đặt và Màn hình khóa, loại bỏ hoàn toàn lỗi xung đột thiết bị (`NotReadableError` / `DOMException`).
* **Thanh trượt tinh chỉnh độ nhạy (Slouch Threshold):** Cho phép điều chỉnh ngưỡng khoảng cách Mũi - Vai (mặc định: `0.22`) để tương thích với nhiều góc đặt laptop/webcam xa hay gần.

### 🧠 3. AI Pose Tracking Offline 100% (Bảo vệ quyền riêng tư tuyệt đối)
* Sử dụng mô hình **Google MediaPipe Pose** chạy hoàn toàn trên trình duyệt thông qua WebAssembly (WASM SIMD).
* **Tuyệt đối không gửi hình ảnh/video ra internet:** Tất cả quá trình xử lý diễn ra trực tiếp trên bộ nhớ RAM của thiết bị (On-device AI).
* Hoạt động trơn tru 24/7 trong nền bằng kiến trúc **Chrome Offscreen Document**, không bao giờ bị Chrome đóng băng khi chuyển tab.

### 🦐 4. Cơ chế Thử thách 12 Lần Kỷ luật (StayFocusd Style)
* Bật bảo vệ: **1-Click là kích hoạt ngay**.
* **Muốn TẮT bảo vệ? Bắt buộc vượt qua 12 cấp độ thử thách "nhây nhây"**:
  - Từng bước cảnh báo châm biếm sâu cay về dáng ngồi con tôm luộc, chi phí 100 triệu mổ thoát vị đĩa đệm, đốt sống L4-L5 kêu cứu...
  - Animation rung lắc răn đe và thanh tiến trình đòi hỏi bạn phải nhấn xác nhận kiên trì đủ 12 lần mới thực sự cho phép tắt hệ sinh thái giám sát.

### ⚡ 5. Tiêm Script thông minh & Khôi phục nóng (Hot Re-injection)
* Tự động tiêm content script vào mọi tab web đang mở ngay khi cài đặt hoặc nạp lại tiện ích thông qua `chrome.scripting`.
* Tự động phát hiện và tiêm script bù nếu tab web mới mở chưa kịp nạp content script khi có sự kiện khóa màn hình.
* Người dùng **không cần phải F5 tải lại các tab thủ công** sau khi cập nhật tiện ích.

---

## 🛠️ 3. Công nghệ sử dụng (Tech Stack)

| Thành phần | Công nghệ / Thư viện |
| :--- | :--- |
| **Nền tảng** | Google Chrome Extension (Manifest V3) |
| **AI Model** | Google MediaPipe Pose (WebAssembly + SIMD + WebGL Context) |
| **Frontend UI** | HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3 (Glassmorphism, Micro-animations) |
| **Tiến trình ngầm** | Chrome Service Worker (`background.js`) & Chrome Offscreen API (`offscreen.js`) |
| **Bảo mật & Phân quyền** | CSP `script-src 'self' 'wasm-unsafe-eval'`, Permissions: `offscreen`, `tabs`, `storage`, `scripting` |

---

## 🚀 4. Hướng dẫn cài đặt & Trải nghiệm (Installation)

### Bước 1: Tải mã nguồn về máy
```bash
git clone https://github.com/LucianLe2942006/structure-enforcer.git
cd structure-enforcer
```

### Bước 2: Cài đặt vào trình duyệt Google Chrome
1. Mở trình duyệt Google Chrome và truy cập đường dẫn: `chrome://extensions`
2. Bật công tắc **Chế độ dành cho nhà phát triển (Developer mode)** ở góc trên bên phải.
3. Bấm nút **Tải tiện ích đã giải nén (Load unpacked)** ở góc trên bên trái.
4. Chọn thư mục dự án `posture-extension` vừa clone về.

### Bước 3: Cấp quyền Camera & Khởi chạy
1. Bấm vào biểu tượng mảnh ghép Extension trên thanh công cụ Chrome, chọn ghim **Posture Enforcer MVP**.
2. Nhấp chuột vào biểu tượng tiện ích trên thanh Toolbar để mở trang **Cài đặt & Kỷ luật**.
3. Nếu xuất hiện thông báo vàng, bấm **"Cấp quyền & Kích hoạt Camera ngay"** và chọn **Cho phép (Allow)** trên cửa sổ thông báo của Chrome.
4. Khi thấy Badge hiển thị **"ON" (màu xanh lá)** và đèn LED phần cứng webcam sáng lên: Hệ thống đã chính thức kích hoạt chế độ bảo vệ cột sống!

### Bước 4: Kiểm chứng cơ chế cảnh báo lồng Video Preview
1. **Kiểm tra trên trang Cài đặt:**
   - Bấm "Bật xem trước camera". Thử cúi gục đầu xuống bàn: Khung preview sẽ nhấp nháy viền đỏ và trượt lên banner **"⚠️ CẢNH BÁO SAI TƯ THẾ!"**.
   - Ngồi thẳng lưng và nâng cằm lên: Banner tự động ẩn và nhãn chuyển sang **"🟢 TƯ THẾ CHUẨN"**.
2. **Kiểm tra trên tab web bất kỳ (ví dụ: YouTube, Facebook, Google...):**
   - Chuyển sang tab web và thử cúi đầu khom lưng khoảng 1 giây.
   - Toàn bộ trang web bị phong tỏa mờ, chính giữa là khung **Video Preview AI trực tiếp** hiển thị đường xương vai và điểm mũi của bạn.
   - Ngồi thẳng lưng dậy: Đường xương vai đổi sang màu xanh lá và màn hình **tự động mở khóa** ngay lập tức!

---

## 📂 5. Cấu trúc thư mục dự án

```text
posture-extension/
├── manifest.json                           # Cấu hình tiện ích Manifest V3 & phân quyền
├── background.js                           # Service Worker điều phối tin nhắn & chuyển tiếp frame
├── content.js                              # Lớp phủ phong tỏa trang web kèm Video Preview lồng ghép
├── settings.html                           # Giao diện Dashboard, Xem trước camera & Thử thách 12 bước
├── settings.css                            # Phong cách Dark Glassmorphism, animation rung lắc & viền cảnh báo
├── settings.js                             # Logic điều khiển Dashboard, tự động kích hoạt preview khi gù lưng
├── offscreen.html                          # Trang chạy ngầm giữ webcam & nạp MediaPipe Pose
├── offscreen.js                            # Xử lý tính toán Mũi - Vai, lật gương và stream frame AI
├── LICENSE                                 # Giấy phép mã nguồn mở Apache License 2.0
├── Readme.md                               # Tài liệu hướng dẫn dự án
│
├── camera_utils.js                         # Module hỗ trợ trích xuất video frame
├── pose.js                                 # Thư viện MediaPipe Pose JavaScript API
├── pose_solution_packed_assets_loader.js   # Module nạp asset đóng gói
├── pose_solution_packed_assets.data        # Dữ liệu mô hình MediaPipe nén
├── pose_solution_wasm_bin.js               # Loader WebAssembly tiêu chuẩn
├── pose_solution_wasm_bin.wasm             # File nhị phân WebAssembly AI
├── pose_solution_simd_wasm_bin.js          # Loader WebAssembly hỗ trợ SIMD (tăng tốc CPU)
├── pose_solution_simd_wasm_bin.wasm        # File nhị phân WebAssembly tối ưu SIMD
├── pose_landmark_full.tflite               # Tệp mô hình TensorFlow Lite Landmark (Full)
├── pose_landmark_lite.tflite               # Tệp mô hình TensorFlow Lite Landmark (Lite)
└── pose_web.binarypb                       # Đồ thị xử lý luồng nhận diện MediaPipe Graph
```

---

## 📄 6. Giấy phép (License)

Dự án được phân phối theo giấy phép mã nguồn mở **Apache License 2.0**. Xem chi tiết tại tệp [LICENSE](LICENSE).