// 📺 เลือกแท็กวิดีโอหลัก
var video = document.getElementById("main-video");
var mediaSource = document.getElementById("mp");  // ปิดตัวเล่นเปลี่ยนมาจับตัว id="_"แทน
// 🚀 ถ้าเจอซอร์ส ID "mp" ไม่ว่าเป็นไฟล์ไหน...สั่งลบสถานเดียว!
if (mediaSource) {
    mediaSource.remove(); 
}
// 🔄 บังคับโหลดซอร์สใหม่ ที่เหลืออยู่ทันที
if (video) {
    video.load(); 
}
