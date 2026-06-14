    // สคริปต์สำหรับชุดเครื่องเล่น M3U8
    var video = document.getElementById("main-video");
    var mp4Source = document.getElementById("mp4");
    
    // 1. ดักลบ MP4 ออกทันทีเพื่อไม่ให้ขวางทาง
    if (mp4Source) {
        mp4Source.remove(); 
    }

    // 2. ดึงลิงก์ M3U8 ที่เหลืออยู่มาสั่งให้ Hls.js สตรีมเข้า Plyr
    var m3u8Source = document.getElementById("m3u");
    if (m3u8Source && video) {
        var m3u8Url = m3u8Source.src;
        
        if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(m3u8Url);
            hls.attachMedia(video);
            window.hls = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = m3u8Url;
        }
    }
