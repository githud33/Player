var video = document.getElementById("main-video");

// วิ่งไปหาแท็กที่มี id="m3" หรือ id="mk" หรือ id="tx" ทั้งหมดมาลูปเพื่อลบออก
document.querySelectorAll("#mp, #mk, #ru, #tx").forEach(function(mediaSource) {
    mediaSource.remove();
});

// สั่งโหลดวิดีโอใหม่และเล่นทันที (ยุบรวมเหลือชุดเดียวพอครับ)
if (video) {
    video.load();
   // video.play(); // สั่งให้เล่นวิดีโอตัวที่เหลืออยู่ (id="mp") ทันที ***ถ้าเปิดแท็กตัวนี้ เริ่มเล่นทันทีโดยที่คนดูไม่ต้องกดปุ่ม Play สามารถเพิ่มคำสั่ง .play()
}
