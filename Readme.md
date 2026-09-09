# 🛡️ Posture Enforcer MVP

> **Tiện ích mở rộng Chrome rèn luyện tư thế làm việc bằng cơ chế "Kỷ luật thép" (Active Disruption).**  
> Dự án MVP phục vụ nghiên cứu & kiểm chứng giải pháp cho môn học **EXE101 - Experiential Entrepreneurship**.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-success.svg)]()
[![MediaPipe Pose](https://img.shields.io/badge/AI%20Engine-MediaPipe%20Pose%20(WASM)-orange.svg)]()

---

## 📌 1. Tổng quan & Bài toán (Problem & Solution)

* **Vấn đề (Pain Point):** Sinh viên IT và nhân viên văn phòng thường vô thức gù lưng, khom cổ và gục mặt sát màn hình khi tập trung làm việc. Các ứng dụng thông báo thụ động (Passive Ping) trên thị trường thường dễ dàng bị phớt lờ, gạt bỏ hoặc tắt đi trong vòng 1 giây mà không tạo ra thay đổi hành vi thực sự.
* **Giải pháp (USP - Active Disruption):** Giám sát tư thế trực tiếp qua webcam ngầm bằng trí tuệ nhân tạo (AI). Khi phát hiện người dùng khom lưng hoặc gục đầu quá lâu, hệ thống sẽ **phong tỏa toàn bộ giao diện trang web** (phong cách EOS/SEB). 
* **Điểm đột phá:** Màn hình khóa tích hợp **khung xem trước camera AI thời gian thực** kèm bộ khung xương (Landmark Skeleton). Cách duy nhất để màn hình mở khóa là người dùng **bắt buộc phải nhìn vào camera và ngồi thẳng lưng dậy**.

---

## ✨ 2. Tính năng cốt lõi (Core Features)

### 📹 1. Màn hình phong tỏa tích hợp Camera AI trực tiếp (Live Lock Screen)
* Khi ngồi sai tư thế liên tục ~1 giây, trang web hiện tại lập tức bị phủ mờ (blur), khóa toàn bộ chuột & bàn phím.
* **Lồng khung xem trước camera AI ngay trên màn hình cảnh báo**: Hiển thị luồng video gương soi chiếu cùng bộ khung xương AI (đường nối hai vai và điểm định vị mũi).
* **Huy hiệu trạng thái thời gian thực**:
  - `⚠️ ĐANG GÙ LƯNG` (Viền đỏ cảnh báo khi góc cổ & vai hạ thấp).
  - `🟢 TƯ THẾ CHUẨN` (Viền xanh lá phát sáng khi người dùng ưỡn ngực, thẳng lưng).
* **Tự động mở khóa tức thì**: Màn hình tự động biến mất ngay khi bạn điều chỉnh lại cột sống chuẩn, không làm mất bất kỳ dữ liệu biểu mẫu hay ngắt quãng công việc.

### 🧠 2. AI Pose Tracking Offline 100% (Bảo vệ quyền riêng tư tuyệt đối)
* Sử dụng mô hình **Google MediaPipe Pose** chạy hoàn toàn trên trình duyệt thông qua WebAssembly (WASM SIMD).
* **Không gửi bất kỳ hình ảnh hay video nào ra máy chủ bên ngoài**: Tất cả quá trình xử lý diễn ra trực tiếp trên thiết bị (Client-side / On-device AI).
* Hoạt động trơn tru 24/7 trong nền bằng kiến trúc **Chrome Offscreen Document**, không bao giờ bị Chrome đóng băng khi chuyển tab.

### 🎛️ 3. Trang Cài đặt Dashboard & Kiểm tra Camera
* Giao diện **Dark Glassmorphism** hiện đại, hiển thị trực quan trạng thái kết nối phần cứng webcam (`ĐANG GIÁM SÁT`, `ĐANG KẾT NỐI...`, `LỖI CAMERA`, `ĐÃ TẮT`).
* **Tính năng Live Preview**: Cho phép xem trước góc máy, kiểm tra đường xương vai và điểm mũi AI trước khi làm việc.
* **Kiến trúc Zero-Conflict**: Worker ngầm nắm giữ camera và stream trực tiếp frame sang trang cài đặt, giải quyết triệt để lỗi xung đột phần cứng webcam (`NotReadableError` / `DOMException`) thường gặp trên hệ điều hành Windows.
* **Thanh trượt tinh chỉnh độ nhạy (Slouch Threshold)**: Cho phép điều chỉnh ngưỡng khoảng cách Mũi - Vai (mặc định: `0.22`) để tương thích với nhiều góc đặt laptop/webcam xa hay gần.

### 🦐 4. Cơ chế Thử thách 12 Lần Kỷ luật (StayFocusd Style)
* Bật bảo vệ: **1-Click là kích hoạt ngay**.
* **Muốn TẮT bảo vệ? Bắt buộc vượt qua 12 cấp độ thử thách "nhây nhây"**:
  - Từng bước cảnh báo "chửi xéo" cay độc về dáng ngồi con tôm luộc, chi phí 100 triệu mổ thoát vị đĩa đệm, đốt sống L4-L5 kêu cứu...
  - Animation rung lắc răn đe và thanh tiến trình đòi hỏi bạn phải nhấn xác nhận kiên trì đủ 12 lần mới thực sự cho phép tắt hệ sinh thái giám sát.

### ⚡ 5. Tự động tiêm Script (Auto Script Injection)
* Tự động tiêm content script vào mọi tab web đang mở ngay khi cài đặt hoặc reload tiện ích thông qua `chrome.scripting`.
* Người dùng **không cần phải F5 tải lại các tab thủ công** để tính năng bảo vệ có hiệu lực.

---

## 🛠️ 3. Công nghệ sử dụng (Tech Stack)

| Thành phần | Công nghệ / Thư viện |
| :--- | :--- |
| **Nền tảng** | Google Chrome Extension (Manifest V3) |
| **AI Model** | Google MediaPipe Pose (WebAssembly + SIMD + WebGL Context) |
| **Frontend UI** | HTML5, Vanilla JavaScript (ES6+), CSS3 (Glassmorphism, Animations) |
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

### Bước 4: Kiểm chứng cơ chế khóa
1. Mở bất kỳ trang web nào (ví dụ: YouTube, Facebook, Google, Báo điện tử...).
2. Thử ngồi khom lưng, cúi đầu xuống thấp khoảng 1 giây.
3. Màn hình sẽ lập tức bị phong tỏa mờ, hiển thị giao diện camera AI đang bắt lỗi gù lưng.
4. Hãy ngồi thẳng lưng, ưỡn ngực và nâng cằm lên: Màn hình sẽ **tự động mở khóa** ngay lập tức!

---

## 📂 5. Cấu trúc thư mục dự án

```text
posture-extension/
├── manifest.json                           # Cấu hình tiện ích Manifest V3 & phân quyền
├── background.js                           # Service Worker điều phối tin nhắn trung tâm
├── content.js                              # Lớp phủ phong tỏa trang web kèm camera preview
├── settings.html                           # Giao diện Dashboard & Thử thách 12 bước
├── settings.css                            # Phong cách Dark mode & hiệu ứng rung lắc modal
├── settings.js                             # Logic điều khiển Dashboard & truyền luồng frame
├── offscreen.html                          # Trang chạy ngầm giữ webcam & nạp MediaPipe Pose
├── offscreen.js                            # Xử lý tính toán Mũi - Vai và stream hình ảnh AI
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