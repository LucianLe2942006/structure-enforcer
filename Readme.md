# 🛡️ Posture Enforcer MVP

> **Tiện ích mở rộng Chrome rèn luyện tư thế làm việc bằng cơ chế "Kỷ luật thép" (Active Disruption).**  
> Dự án MVP phục vụ nghiên cứu & kiểm chứng giải pháp cho môn học **EXE101 - Experiential Entrepreneurship**.

---

## 📌 1. Tổng quan & Bài toán (Problem & Solution)

* **Vấn đề (Pain Point):** Sinh viên IT và nhân viên văn phòng thường vô thức gù lưng khi làm việc trước màn hình. Các ứng dụng thông báo thụ động (Passive Ping) trên thị trường thường bị người dùng phớt lờ hoặc tắt đi trong 1 giây.
* **Giải pháp (USP - Active Disruption):** Giám sát tư thế trực tiếp thông qua camera bằng AI. Khi phát hiện người dùng khom lưng/gục đầu quá lâu, hệ thống sẽ **phong tỏa toàn bộ giao diện trang web** (phong cách EOS/SEB). Cách duy nhất để màn hình mở khóa là người dùng **bắt buộc phải ngồi thẳng lưng dậy**.

---

## ✨ 2. Tính năng cốt lõi (Core Features)

* **AI Pose Tracking nội bộ:** Sử dụng mô hình Google MediaPipe Pose chạy hoàn toàn trên trình duyệt qua WebAssembly (WASM), không gửi dữ liệu hình ảnh ra bên ngoài (bảo vệ quyền riêng tư 100%).
* **Màn hình phong tỏa EOS-style:** Che mờ (blur), khóa tương tác chuột/bàn phím và hiển thị cảnh báo trực quan khi ngồi sai tư thế.
* **Tự động mở khóa:** Nhận diện người dùng điều chỉnh lại cột sống và mở khóa trang web ngay lập tức mà không làm mất dữ liệu hay gián đoạn phiên làm việc.
* **Trang Cài đặt & Quản lý Kỷ luật (Dashboard):** Giao diện Dark theme cao cấp, hiển thị trực quan trạng thái hệ thống và cho phép tinh chỉnh ngưỡng độ nhạy (Slouch Threshold).
* **Cơ chế Thử thách 12 Lần Nhây (StayFocusd Style):** Bật thì 1-click là bật được ngay, nhưng muốn TẮT thì phải vượt qua thử thách 12 lần cảnh báo, "chửi xéo" đau điếng về cột sống tôm luộc và chi phí mổ thoát vị đĩa đệm.
* **Kiến trúc Manifest V3 chuẩn:** Vận hành trơn tru luồng camera ngầm thông qua Chrome Offscreen Documents.

---

## 🛠️ 3. Công nghệ sử dụng (Tech Stack)

* **Nền tảng:** Google Chrome Extension (Manifest V3).
* **AI Engine:** [Google MediaPipe Pose](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker).
* **Frontend:** Vanilla JavaScript (ES6+), HTML5 Canvas, CSS3 (Backdrop Filter, Flexbox, Keyframe Animations).
* **Cơ chế chạy ngầm:** Chrome Service Worker (`background.js`) & Chrome Offscreen API (`offscreen.js`).

---

## 📂 4. Cấu trúc thư mục dự án

```text
posture-extension/
├── manifest.json                           # File cấu hình & phân quyền Extension (Manifest V3)
├── background.js                           # Service worker điều phối tin nhắn trung tâm
├── content.js                              # Kịch bản chèn lớp phủ phong tỏa vào trang web
├── settings.html                           # Trang Cài đặt Dashboard & Thử thách 12 lần tắt
├── settings.css                            # Phong cách Dark mode & animation rung lắc modal
├── settings.js                             # Logic 12 cấp độ roast và điều khiển trạng thái
├── offscreen.html                          # Trang chạy ngầm nhúng mô hình AI & Camera
├── offscreen.js                            # Logic đo đạc khoảng cách Mũi - Vai & gửi tín hiệu
│
├── camera_utils.js                         # Thư viện hỗ trợ trích xuất frame từ camera
├── pose.js                                 # Thư viện MediaPipe Pose JavaScript API
├── pose_solution_packed_assets_loader.js   # Module nạp asset của MediaPipe
├── pose_solution_packed_assets.data        # Dữ liệu mô hình nén
├── pose_solution_wasm_bin.js               # Loader cho WebAssembly (chuẩn)
├── pose_solution_wasm_bin.wasm             # Binary WebAssembly chạy thuật toán AI (chuẩn)
├── pose_solution_simd_wasm_bin.js          # Loader WebAssembly hỗ trợ SIMD (tối ưu tốc độ)
├── pose_solution_simd_wasm_bin.wasm        # Binary WebAssembly tối ưu SIMD
├── pose_landmark_full.tflite               # Mô hình AI Landmark Full (modelComplexity: 1)
├── pose_landmark_lite.tflite               # Mô hình AI Landmark Lite (modelComplexity: 0)
└── pose_web.binarypb                       # Đồ thị xử lý luồng nhận diện (Graph Pipeline)