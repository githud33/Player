// ==========================================
// แก้ไขเปลี่ยนแปลงเป็นตัวใหม่ V.1 ล่าสุดวันที่ 21 มิถุนายน 2569 
// ==========================================
// ==========================================
// 1. การตั้งค่าและตัวแปรเริ่มต้น (Global Configs)
// ==========================================
var levelsInternal = [];
var errorEvents = {};
var video_start_time = 0;
var errorElement = null;

// ==========================================
// 2. ฟังก์ชันเสริมการทำงาน (Helper Functions)
// ==========================================

// ข้ามวิดีโอไปยังจุดที่กำหนดไว้ตอนเริ่มเล่น
function setPlayerStartingPosition(player) {
    if (video_start_time > 0) {
        player.on('loadeddata', function (event) {
            var instance = event.detail.plyr;
            if (video_start_time <= instance.duration) {
                instance.off('loadeddata', event);
                instance.currentTime = video_start_time;
            }
        });
    }
}

// ฟังก์ชันสำหรับส่ง Log หรือ ข้อมูลกลับไปยังเซิร์ฟเวอร์
function loadUrl(url, onFinished) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
            onFinished(xmlhttp.responseText);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

// ตรวจสอบว่าเป็นอุปกรณ์พกพาหรือไม่
function IsMobile() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

// แปลงความละเอียดหน้าจอจาก Hls Level มาเป็นตัวเลขความสูงของวิดีโอ
function getLabel(hlsLevelInfo) {
    var height = hlsLevelInfo.height;
    var width = hlsLevelInfo.width;
    var isVertical = false;

    if (height > width) {
        var temp = width;
        width = height;
        height = temp;
        isVertical = true;
    }

    switch (height) {
        case 2160: case 1440: case 1080: case 720: case 480: case 360: case 240:
            return height;
    }

    switch (width) {
        case 3840: return 2160;
        case 2560: return 1440;
        case 1920: return 1080;
        case 1280: return 720;
        case 852:  case 854: case 856: return 480;
        case 640:  return 360;
        case 426:  case 428: return 240;
    }

    var url = hlsLevelInfo.url[0] || '';
    var splitted = url.split('/');
    var resolution = splitted[splitted.length - 2] || '';

    if (resolution.indexOf('p') > -1) {
        var match = resolution.match(/\d+p/g);
        if (match && match.length > 0) return +match[0].replace('p', '');
    }

    if (resolution.indexOf('x') > -1) {
        splitted = resolution.split('x');
        return isVertical ? +splitted[0] : +splitted[1];
    }

    return 0;
}

// รวมชุดข้อมูลวิดีโอเพื่อระบุ Codec บีบอัด
function getCodecString(level) {
    var audioCodec = level.audioCodec;
    var codecString = 'video/mp4; codecs="'.concat(level.videoCodec);
    if (audioCodec) {
        codecString += ", ".concat(level.audioCodec, '"');
    } else {
        codecString += '"';
    }
    return codecString;
}

// แสดงกล่องแจ้งข้อผิดพลาดบนหน้าจอ
function showError(message) {
    if (!errorElement) {
        errorElement = document.createElement("div");
        errorElement.className = "error-message";
        var container = document.getElementById("video-container");
        if (container) container.appendChild(errorElement);
    }
    errorElement.innerHTML = message;
}


// ==========================================
// 3. เริ่มต้นทำงานเมื่อหน้าเว็บโหลดเสร็จ
// ==========================================
document.addEventListener("DOMContentLoaded", async function() {
    var video = document.querySelector("video");
    if (!video) return; 

    var fragmentsLoaded = 0;
    var player = null;
    var isFairplay = false;
    var useFairplayInternalEngine = false;
    var useFairplayHlsJs = false;
    var urlPlaylistUrl = 'm3u8';
    var isHlsSupported = (!isFairplay || useFairplayHlsJs) && Hls.isSupported();
    
    var sourceElement = video.getElementsByTagName("source")[0];
    var source = sourceElement ? sourceElement.src : '';
    
    var isAdPaused = false;
    var isAirplayEnabled = true;
    var is4KVideo = true;

    // --- การตั้งค่าเริ่มต้นสำหรับ Plyr ---
    var defaultOptions = {
        storage: { enabled: true, key: '' },
        fullscreen: { enabled: true, fallback: true, iosNative: true },
        iconUrl: 'https://assets.mediadelivery.net/plyr/3.7.3.2/plyr.svg',
        captions: { active: false, language: '', update: true },
        controls: [
            "play-large", "play", "rewind", "fast-forward", "progress", "current-time", 
            "duration", "mute", "volume", "captions", "settings", "pip", "airplay", "fullscreen", "audioTrack"
        ],
        settings: ['captions', 'quality', 'speed', 'loop', 'audioTrack'],
        speed: {
            speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4] },
        },
        i18n: {
            restart: 'รีสตาร์ท',
            rewind: 'ย้อนกลับ {seektime}วินาที',
            play: 'เล่น',
            pause: 'หยุดชั่วคราว',
            fastForward: 'ไปข้างหน้า {seektime}วินาที',
            seek: 'ค้นหา',
            seekLabel: '{currentTime} จาก {duration}',
            played: 'เล่นแล้ว',
            buffered: 'บัฟเฟอร์',
            currentTime: 'เวลาปัจจุบัน',
            duration: 'ระยะเวลา',
            volume: 'ความดังเสียง',
            mute: 'ปิดเสียง',
            unmute: 'เปิดเสียง',
            enableCaptions: 'เปิดใช้งานคำบรรยาย',
            disableCaptions: 'ปิดใช้งานคำบรรยาย',
            download: 'ดาวน์โหลด',
            enterFullscreen: 'เข้าสู่โหมดเต็มหน้าจอ',
            exitFullscreen: 'ออกจากโหมดเต็มหน้าจอ',
            frameTitle: 'เครื่องเล่นสำหรับ {title}',
            captions: 'คำบรรยาย',
            settings: 'การตั้งค่า',
            pip: 'PIP',
            menuBack: 'กลับไปที่เมนูก่อนหน้า',
            speed: 'ความเร็ว',
            normal: 'ปกติ',
            quality: 'คุณภาพ',
            audioTrack: 'เลือกเสียงบรรยาย',
            loop: 'ลูป',
            start: 'เริ่มต้น',
            end: 'จบ',
            all: 'ทั้งหมด',
            reset: 'รีเซ็ต',
            disabled: 'ปิดใช้งาน',
            enabled: 'เปิดใช้งาน',
            advertisement: 'โฆษณา',
            qualityBadge: {
                2160: '4K', 1440: 'HD', 1080: 'HD', 720: 'HD', 576: 'SD', 480: 'SD',
            },
        },
    };

    // --- ฟังก์ชันผูกการทำงานเข้ากับ Plyr ตัวควบคุมหลัก ---
    function initPlayer() {
        player.elements.captions.dir = "auto";
        $('<div class="plyr__controls__item hide_mobile plyr__spacer"></div>').insertBefore(".plyr__progress__container");

        $("video").on('webkitbeginfullscreen webkitendfullscreen', function (event) {
            if (event.type === 'webkitbeginfullscreen') {
                document.documentElement.style.setProperty('--webkit-text-track-display', 'block');
            } else {
                document.documentElement.style.setProperty('--webkit-text-track-display', 'none');
            }
        });

        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && player.ads != null && player.ads.playing) {
                player.ads.manager.resume();
            }
        });

        // ติดตามสถิติผู้ใช้งาน
        player.on("play", function() { videoSessionTracker.OnPlay(); });
        player.on("playing", function () { videoSessionTracker.OnPlaying(); });
        player.on("pause", function () { videoSessionTracker.OnPause(); });

        setInterval(function () {
            if (typeof videoSessionTracker !== 'undefined' && player) {
                videoSessionTracker.OnProgress(player.currentTime);
            }
        }, 900);

        // จัดการหน้าตา Progress Bar บาร์เล่นวิดีโอ
        $(".plyr__progress__container input").css("top", "-5px");
        $(".plyr__progress__container progress").css("top", "4px");
        $(".plyr__progress__container progress").css("opacity", "0.01");
        $(".plyr__progress").prepend($('<div class="plyr__pb"></div>'));

        var pb = new PB(".plyr__pb", ".plyr__progress__container input", {
            keyColor: "#ff0000",
            chapters: [],
            moments: [],
            onScrubbingChange: function(seekTime, offset) {}
        });

        function subscribeAdManagerEvent() {
            if (player.ads != null && typeof google !== 'undefined' && google.ima) {
                Object.keys(google.ima.AdEvent.Type).forEach(function(e) {
                    player.ads.manager.addEventListener(google.ima.AdEvent.Type[e], function(evt) {
                        switch (evt.type) {
                            case 'pause': isAdPaused = true; break;
                            case 'complete':
                            case 'allAdsCompleted':
                            case 'userClose':
                            case 'start':
                            case 'resume':
                            case 'loaded': isAdPaused = false; break;
                            case 'click': if (isAdPaused) player.ads.manager.resume(); break;
                        }
                    });
                });
            }
        }

        player.on("loadedmetadata", function() {
            pb.SetDuration(player.duration);
            if (player.ads != null && player.ads.manager == null) {
                if (player.ads.loader != null) {
                    player.ads.loader.addEventListener("adsManagerLoaded", function() {
                        subscribeAdManagerEvent();
                    }, false);
                }
            } else {
                subscribeAdManagerEvent();
            }
        });

        setInterval(function() {
            if (player && pb) {
                pb.SetCurrentProgress(player.currentTime);
                pb.SetBufferProgress(player.duration * player.buffered);
            }
        }, 16);

        // --- ระบบสื่อสารผ่าน iframe (postMessage API) ---
        function getStatusObject() {
            return {
                volume: player.volume,
                muted: player.muted,
                hideControls: player.hideControls,
                speed: player.speed,
                quality: player.quality,
                currentTime: player.currentTime,
                playing: player.playing,
                paused: player.paused,
                stopped: player.stopped,
                ended: player.ended,
                buffered: player.buffered,
                duration: player.duration,
                hasAudio: player.hasAudio,
                loop: player.loop,
                language: player.language,
                ratio: player.ratio,
            };
        }

        function sendEvent(name) {
            window.parent.postMessage({
                channel: "bunnystream",
                event: name,
                status: getStatusObject(),
            }, '*');
        }

        function wireEvent(name) {
            player.on(name, function () { sendEvent(name); });
        }

        function wireUpEvents() {
            var events = ["progress", "ready", "play", "pause", "timeupdate", "seeking", "seeked", 
                          "ended", "ratechange", "enterfullscreen", "exitfullscreen", 
                          "captionsenabled", "captionsdisabled", "languagechange"];
            events.forEach(wireEvent);
        }

        window.onmessage = function(e) {
            var message = e.data;
            if (!message) return;
            switch(message.command) {
                case 'activate': wireUpEvents(); break;
                case 'pause': player.pause(); break;
                case 'play': player.play(); break;
                case 'togglePlay': player.togglePlay(message.parameter); break;
                case 'destroy': player.destroy(); break;
                case 'increaseVolume': player.increaseVolume(message.parameter || 0.1); break;
                case 'decreaseVolume': player.decreaseVolume(message.parameter || 0.1); break;
                case 'toggleCaptions': player.toggleCaptions(message.parameter); break;
                case 'toggleControls': player.toggleControls(message.parameter); break;
                case 'fullscreen.enter': player.fullscreen.enter(); break;
                case 'fullscreen.exit': player.fullscreen.exit(); break;
                case 'fullscreen.toggle': player.fullscreen.toggle(); break;
                case 'forward': player.forward(message.parameter); break;
                case 'rewind': player.rewind(message.parameter); break;
            }
        };

        if (typeof initPlyrPositionSaver === 'function') {
            initPlyrPositionSaver(player, "");
        }
        setPlayerStartingPosition(player);
    }

    // --- เริ่มต้นโหลดสตรีมมิ่งผ่าน Hls.js ---
    if (isHlsSupported) {
        var hlsConfig = {
            debug: false,
            abrEwmaDefaultEstimate: 5000000,
            minBufferLength: 20,
            autoStartLoad: true,
            xhrSetup: function (xhr, url) {},
        };

        if (is4KVideo) {
            hlsConfig.maxBufferSize = 100 * 1000 * 1000;
            hlsConfig.maxMaxBufferLength = 120;
        } else {
            hlsConfig.maxBufferLength = 120;
            hlsConfig.maxMaxBufferLength = 120;
        }

        var hls = new Hls(hlsConfig);

        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            if (data.audioTracks && data.audioTracks.length) {
                const languageOptions = Array.from(new Set(data.audioTracks.map(a => a.name)));
                var savedAudioName = localStorage.getItem('preferred_audio_name');
                var defaultSelected = languageOptions[0];

                if (savedAudioName && languageOptions.includes(savedAudioName)) {
                    defaultSelected = savedAudioName;
                }

                defaultOptions.audioTrack = {
                    options: languageOptions,
                    selected: defaultSelected,
                    onChange: (e) => {
                        let index = hls.audioTracks.findLastIndex(x => x.name == e);
                        if (index < 0) index = 0;
                        hls.audioTrack = index;
                        localStorage.setItem('preferred_audio_name', e);
                        if (typeof bunnyCast !== "undefined" && bunnyCast) {
                            bunnyCast.audioTrackChanged(index);
                        }
                    },
                    showUnrecognizedLabel: false,
                };
                
                function applyForceAudioTrack() {
                    var currentSaved = localStorage.getItem('preferred_audio_name');
                    if (currentSaved && hls) {
                        let targetIndex = hls.audioTracks.findLastIndex(x => x.name == currentSaved);
                        if (targetIndex >= 0 && hls.audioTrack !== targetIndex) {
                            hls.audioTrack = targetIndex;
                        }
                    }
                }

                hls.audioTrack = hls.audioTracks.findLastIndex(x => x.name == defaultSelected);
                
                video.addEventListener('loadedmetadata', function() {
                    setTimeout(applyForceAudioTrack, 20);
                });

                video.addEventListener('playing', function onPlayingForce() {
                    setTimeout(applyForceAudioTrack, 50);
                    video.removeEventListener('playing', onPlayingForce); 
                });
            }

            var availableQualities = hls.levels.map(function (l) { var label = getLabel(l); l.label = label; return label; });
            availableQualities.unshift(-1); 

            var mediaSourceSupported = typeof MediaSource !== 'undefined';
            var vp9Levels = hls.levels.filter(function(level) {
                return level.codecSet.includes('vp09') && mediaSourceSupported && MediaSource.isTypeSupported(getCodecString(level));
            });
            var hevcLevels = hls.levels.filter(function(level) {
                return level.codecSet.includes('hvc1') && mediaSourceSupported && MediaSource.isTypeSupported(getCodecString(level));
            });
            var av1Levels = hls.levels.filter(function(level) {
                return level.codecSet.includes('av01') && mediaSourceSupported && MediaSource.isTypeSupported(getCodecString(level));
            });

            levelsInternal = hls.levels;
            if (av1Levels.length > 0) { levelsInternal = av1Levels; } 
            else if (hevcLevels.length > 0) { levelsInternal = hevcLevels; } 
            else if (vp9Levels.length > 0) { levelsInternal = vp9Levels; }

            if (window.hls && window.hls.currentLevel == -1) {
                if (levelsInternal.length == 1) { window.hls.currentLevel = hls.levels.indexOf(levelsInternal[0]); }
                else if (levelsInternal.length == 2) { window.hls.currentLevel = hls.levels.indexOf(levelsInternal[1]); }
                else { window.hls.currentLevel = hls.levels.indexOf(levelsInternal[2]); }
            }

            defaultOptions.quality = {
                default: -1,
                options: availableQualities,
                forced: true,
                onChange: function (e) { updateQuality(e); },
            };
            defaultOptions.i18n["qualityLabel"] = { "-1": "Auto" };

            player = new Plyr(video, defaultOptions);
            initPlayer();
        });

        hls.loadSource(source);
        hls.attachMedia(video);

        hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
            var span = document.querySelector(".plyr__controls [data-plyr='quality'][value='-1'] span");
            if (span != null) {
                if (hls.autoLevelEnabled) {
                    var level = hls.levels[data.level];
                    var label = getLabel(level);
                    span.innerHTML = 'Auto (' + label + 'p)';
                } else {
                    span.innerHTML = 'Auto';
                }
            }
        });

        var retryCount = 0;
        video.addEventListener('error', function (evt) {
            if (evt && evt.type === 'error') {
                var mediaError = evt.currentTarget.error;
                if (!mediaError) return;
                if (mediaError.code == 3) {
                    if (retryCount > 5) return;
                    retryCount++;
                    var now = self.performance.now();
                    if (!self.recoverDecodingErrorDate || now - self.recoverDecodingErrorDate > 3000) {
                        self.recoverDecodingErrorDate = self.performance.now();
                        hls.recoverMediaError();
                    } else if (!self.recoverSwapAudioCodecDate || now - self.recoverSwapAudioCodecDate > 3000) {
                        self.recoverSwapAudioCodecDate = self.performance.now();
                        hls.swapAudioCodec();
                        hls.recoverMediaError();
                    } else {
                        hls.recoverMediaError();
                    }
                }
            }
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
            if (errorEvents[data.details] == undefined) { errorEvents[data.details] = 0; }
            errorEvents[data.details] += 1;
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR: hls.startLoad(); break;
                    case Hls.ErrorTypes.MEDIA_ERROR: hls.recoverMediaError(); break;
                }
            }
        });

        setInterval(function() {
            if (hls && hls.abrController && hls.abrController.bwEstimator) {
                var bandwidth = hls.abrController.bwEstimator.getEstimate();
                if (isNaN(bandwidth)) bandwidth = 0;
                if (!video.paused) {
                    var errorEventsString = "";
                    var keys = Object.keys(errorEvents);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var value = errorEvents[key];
                        if (errorEventsString != "") errorEventsString += ",";
                        errorEventsString += (key + "=" + value);
                    }
                    loadUrl("report_log.php?errors=" + errorEventsString + "&bandwidth=" + bandwidth + "&zoneTier=volume", function (data) { });
                    errorEvents = {};
                }
            }
        }, 15000);

        if (isAirplayEnabled) {
            var sourceElem = document.createElement('source');
            sourceElem.src = urlPlaylistUrl;
            video.appendChild(sourceElem);
            video.disableRemotePlayback = false;
        }
        window.hls = hls;
    } else {
        defaultOptions.quality = { default: 480, options: [240, 320, 480, 720] };
        player = new Plyr(video, defaultOptions);
        initPlayer();
    }

    function getRoutes(request){
        let routes = new Map();
        var p = new URL(request).pathname.split("/");
        for(var i=1; i<p.length-1; i+=2) {
            routes.set(p[i], p[i+1]);
        }
        return routes;
    }

    function updateQuality(newQuality) {
        if (newQuality === -1) {
            if (window.hls) window.hls.currentLevel = -1;
        } else {
            for (var level of levelsInternal) {
                if (level.label === newQuality) {
                    if (window.hls) window.hls.currentLevel = hls.levels.indexOf(level);
                    return;
                }
            }
        }
    }
});

// [👆จุดสิ้นสุดจบการแก้ไขโค้ดชุดใหม่]



/* ==========================================================
   ส่วนเสริม: ควบคุมคีย์บอร์ด (คอม) + ลากนิ้วเฉพาะจุด (มือถือ)
   ========================================================== */
   
(function() {
    // --- 1. ฟังก์ชันตัวช่วย: แปลงวินาทีเป็น 00:00 ---
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
    }

    // --- 2. ฟังก์ชันแสดงกล่องแจ้งเตือน (Toast) ---
    function showStatusToast(content, isVolume = true, direction = 0) {
        const v = document.getElementById('main-video');
        if (!v) return;

        const fsElem = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        let wrapper = fsElem || v?.closest('.plyr') || document.getElementById('video-container') || document.body;
        let toast = document.getElementById('custom-vol-toast');
        
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'custom-vol-toast';
            Object.assign(toast.style, {
                backgroundColor: 'rgba(220, 0, 0, 0.6)', color: '#ffffff',
                padding: '4px 12px', borderRadius: '6px', fontSize: '18px',
                zIndex: '2147483647', pointerEvents: 'none', display: 'none',
                fontWeight: '600', fontFamily: 'sans-serif', backdropFilter: 'blur(5px)',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)', border: '1px solid rgba(255, 255, 255, 0.3)'
            });
        }

        const isFS = !!fsElem;
        toast.style.position = isFS ? 'fixed' : 'absolute';
        toast.style.top = isFS ? '80px' : '20px';
        
        if (isVolume) {
            toast.style.left = 'auto';
            toast.style.right = '15px'; // เสียงอยู่ขวา
        } else {
            toast.style.right = 'auto';
            toast.style.left = '15px';  // กรอภาพอยู่ซ้าย
        }

        wrapper.appendChild(toast);
        // 📍 ใช้ไอคอน ▶▶ / ◀◀ ตามที่พี่ปรับมา
        let icon = isVolume ? '🔊 ' : (direction >= 0 ? '▶▶ ' : '◀◀ ');
        let text = isVolume ? Math.round(content * 100) + '%' : formatTime(content);
        toast.innerHTML = icon + text;
        toast.style.display = 'block';

        clearTimeout(window.volumeTimeout);
        window.volumeTimeout = setTimeout(() => { toast.style.display = 'none'; }, 1200);
    }

    // ==========================================
    // PART 1: คีย์บอร์ด (เพิ่มการเช็ค Focus เพื่อไม่กวน JW Player)
    // ==========================================
    document.addEventListener('keydown', function(e) {
        if (["input", "textarea"].includes(e.target.tagName.toLowerCase())) return;

        const v = document.getElementById('main-video');
        if (!v) return;

        // 📍 เช็คว่าเรากำลังใช้งานเครื่องเล่นหลักอยู่หรือไม่ (เมาส์ชี้อยู่ หรือ คลิกทำงานอยู่)
        // ถ้าเมาส์ไม่ได้ชี้ที่ตัวหลัก และในหน้ามี JW Player (#player) ให้ข้ามไปเลย
        const isHoveringMain = v.closest('.plyr')?.matches(':hover') || v.matches(':hover') || v.contains(document.activeElement);
        if (!isHoveringMain && document.querySelector('#player')) return;

        let handled = false;
        switch(e.keyCode) {
            case 38: v.volume = Math.min(1, v.volume + 0.05); showStatusToast(v.volume, true); handled = true; break;
            case 40: v.volume = Math.max(0, v.volume - 0.05); showStatusToast(v.volume, true); handled = true; break;
            case 37: v.currentTime -= 10; showStatusToast(v.currentTime, false, -1); handled = true; break;
            case 39: v.currentTime += 10; showStatusToast(v.currentTime, false, 1); handled = true; break;
        }
        if (handled) { e.preventDefault(); e.stopImmediatePropagation(); }
    }, true);

    // ==========================================
    // PART 2: มือถือ (คงไว้ตามที่พี่ปรับมาเป๊ะๆ)
    // ==========================================
    window.addEventListener('load', function() {
        const vContainer = document.querySelector('.plyr') || document.getElementById('video-container') || document.getElementById('main-video');
        const v = document.getElementById('main-video');
        if (!vContainer || !v) return;

        let startX = 0, startY = 0;

        vContainer.addEventListener('touchstart', function(e) {
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
        }, { passive: false });

        vContainer.addEventListener('touchmove', function(e) {
            const currentX = e.touches[0].pageX;
            const currentY = e.touches[0].pageY;
            const diffX = currentX - startX;
            const diffY = currentY - startY;
            const rect = vContainer.getBoundingClientRect();

            // 📍 [1. ตรวจสอบโซนปลอดภัย - เว้นแถบล่างไว้ 30%]
            // ถ้าจิ้มนิ้วลงในพื้นที่ต่ำกว่า 70% ของความสูงวิดีโอ (แถวๆ ปุ่ม Play) จะไม่ทำงาน
            const isSafeZone = (startY - rect.top) < (rect.height * 0.7);
            if (!isSafeZone) return;


            if (Math.abs(diffY) > Math.abs(diffX)) {
                // 📍 [2. ปรับเสียง - เฉพาะฝั่งขวา 70% ของความกว้าง]
                const isRightSide = (startX - rect.left) > (rect.width * 0.9);
                if (isRightSide && Math.abs(diffY) > 20) {
                    v.volume = Math.max(0, Math.min(1, v.volume - (diffY / 500)));
                    startY = currentY;
                    showStatusToast(v.volume, true);
                    if (e.cancelable) e.preventDefault();
                }
            } else {
                // 📍 [3. กรอภาพ - ทำได้ทั่วบริเวณในโซนปลอดภัย]
                if (Math.abs(diffX) > 40) {
                    v.currentTime += (diffX / 20);
                    showStatusToast(v.currentTime, false, diffX);
                    startX = currentX;
                    if (e.cancelable) e.preventDefault();
                }
            }
        }, { passive: false });
    });
})();

/*  ==========================================================
 💡 ทริคเล็กๆ ทิ้งท้าย:
ถ้าวันไหนรู้สึกว่า "ลากนิ้วแล้วเวลามันวิ่งเร็วไป" หรือ "ช้าไป" พี่สามารถปรับแก้ได้เองง่ายๆ ตรงบรรทัดนี้นะครับ:


v.currentTime += (diff / 15);


ถ้าเปลี่ยนจาก 15 เป็น 30 = จะต้องลากนิ้วยาวขึ้นเพื่อให้เวลาเดิน (หนืดขึ้น/ละเอียดขึ้น)


ถ้าเปลี่ยนจาก 15 เป็น 5 = ลากนิดเดียวเวลาจะวิ่งไปไกลเลย (ไวขึ้น)


💡 จุดที่พี่สามารถปรับแต่งเองได้:
ถ้าอยากให้กล่องเล็กลงอีก: ลดตัวเลข padding: '4px 12px' (เลข 4 คือ บน-ล่าง, 12 คือ ซ้าย-ขวา)


ถ้าอยากให้ตัวหนังสือเล็กลงอีก: ลดตัวเลข fontSize: '18px'


การแยกส่วน: ผมแบ่ง PART 1 และ PART 2 ไว้ให้แล้ว พี่สามารถก๊อปปี้เฉพาะส่วนไปแก้ไขได้ง่ายขึ้นครับ


💡 จุดที่พี่สามารถปรับเปลี่ยนเองได้:
ไปที่บรรทัดที่มีเขียนว่า (rect.width * 0.7) ครับ:


ถ้าใช้ 0.7: พื้นที่ลากเสียงจะอยู่ที่ 30% สุดท้ายของจอฝั่งขวา


ถ้าใช้ 0.8: พื้นที่ลากเสียงจะเล็กลงไปอีก เหลือแค่ 20% สุดท้ายของจอฝั่งขวา (ชิดขอบมาก)


ถ้าใช้ 0.5: คือการแบ่งครึ่งหน้าจอพอดี (แบบเดิม)


ผมตั้งไว้ให้ที่ 0.7 ก่อนนะครับ พี่ลองลากดูว่านิ้วสัมผัสของพี่มันอยู่ชิดขอบพอดีกับความถนัดหรือยัง ถ้าอยากให้บีบพื้นที่เข้าหาขอบอีก ก็แค่แก้เป็น 0.8 หรือ 0.85 ได้เลยครับ! 😊✌️

💡 สิ่งที่ผมเพิ่มเข้าไปให้พี่:
isSafeZone: ผมสร้างตัวแปรนี้ขึ้นมาเพื่อเช็คว่า นิ้วที่พี่จิ้มลงไปครั้งแรกเนี่ย มันอยู่สูงกว่าแถบเมนูข้างล่างหรือเปล่า

rect.height * 0.8: ผมตั้งไว้ว่า พื้นที่ล่างสุด 20% ของวิดีโอจะห้ามลากกรอภาพ (เพื่อให้พี่กดปุ่ม Play/Pause หรือลากแถบเวลาจริงได้ถนัด) พี่จะสามารถลากนิ้วได้เฉพาะพื้นที่ 80% ด้านบนของตัวเล่นวิดีโอครับ

วิธีปรับแต่งเพิ่มเติม:

ถ้าพี่รู้สึกว่ายังโดนเมนูอยู่ ให้เปลี่ยน 0.8 เป็น 0.7 (พื้นที่ลากจะเล็กลงแต่ปลอดภัยขึ้น)

ถ้าอยากให้ลากได้เกือบถึงข้างล่าง ให้เปลี่ยนเป็น 0.9 ครับ

ถ้าอยากให้เว้นแถบล่างมากขึ้น: เปลี่ยนเลข 0.8 เป็น 0.7 หรือ 0.6 ในส่วนของ isSafeZone

ถ้าอยากให้พื้นที่ลากเสียงกว้างขึ้น: เปลี่ยนเลข 0.7 เป็น 0.5 ในส่วนของ isRightSide

   ==========================================================  */



