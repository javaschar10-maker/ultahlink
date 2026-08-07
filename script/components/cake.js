(function () {
    window.Components = window.Components || {};

    // Blow sound: white noise + lowpass filter (Web Audio, no audio file needed)
    function playBlow() {
        try {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            const ctx = new Ctx();
            const dur = 1.1;
            const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < data.length; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
            }
            const src = ctx.createBufferSource();
            src.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.value = 700;
            const gain = ctx.createGain();
            gain.gain.value = 0.35;
            src.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            src.start();
        } catch (e) {
            // Audio blocked — candles still go out.
        }
    }

    function cakeSVG(count) {
        const candles = Array.from({ length: count }, (_, i) => {
            const x = 160 - (count - 1) * 14 + i * 28;
            return `
        <g class="candle">
          <rect x="${x - 4}" y="84" width="8" height="42" rx="2" fill="#ff8fa3" />
          <rect x="${x - 2.5}" y="84" width="2.5" height="42" fill="#ffc2d1" opacity="0.8" />
          <rect x="${x - 1.5}" y="72" width="3" height="14" rx="1.5" fill="#f2e9e4" />
          <g class="flame">
            <ellipse cx="${x}" cy="60" rx="5" ry="9" fill="#ffb703" />
            <ellipse cx="${x}" cy="63" rx="2.6" ry="5" fill="#fb8500" />
            <circle class="glow" cx="${x}" cy="60" r="14" fill="#ffd93d" opacity="0.2" />
          </g>
        </g>`;
        }).join("");

        return `
      <svg viewBox="0 0 320 260" role="img" aria-label="Birthday cake with candles">
        <ellipse cx="160" cy="238" rx="112" ry="16" fill="var(--accent)" opacity="0.3" />
        <rect x="70" y="180" width="180" height="58" rx="14" fill="#f4a261" />
        <path d="M70 180 q10 34 20 0 q10 34 20 0 q10 34 20 0 q10 34 20 0 q10 34 20 0 q10 34 20 0 q10 34 20 0 q10 34 20 0 q10 34 20 0" fill="#fff" opacity="0.85" />
        <rect x="90" y="126" width="140" height="58" rx="12" fill="#ffd166" />
        <path d="M90 126 q10 28 20 0 q10 28 20 0 q10 28 20 0 q10 28 20 0 q10 28 20 0 q10 28 20 0 q10 28 20 0" fill="#fff" opacity="0.85" />
        ${candles}
      </svg>`;
    }

    window.Components.cake = {
        render(container, section) {
            const div = document.createElement("div");
            div.className = "section section-cake";
            div.innerHTML = `
        <button type="button" class="cake-area" aria-label="Blow the candles">${cakeSVG(section.candles || 5)}</button>
        <p class="cake-hint">${section.hint || "Klik kue untuk mengaktifkan tiupan 🎤"}</p>
        <p class="cake-wish">${section.wish || "Semoga wish kamu terkabul! 🎂✨"}</p>
        <button type="button" class="next-btn cake-next">${section.nextText || "Lanjut →"}</button>
      `;
            container.appendChild(div);
            return div;
        },

        animate(tl, el) {
            // idle → listening → blown. Mic MUST start inside a user gesture
            // (click) or the AudioContext stays suspended and the analyser
            // reads silence — blow would never be detected.
            let state = "idle";
            let cleanup = null;
            const hint = el.querySelector(".cake-hint");
            const originalHint = hint.textContent;
            const nextBtn = el.querySelector(".cake-next");

            const stopMic = () => {
                if (cleanup) { cleanup(); cleanup = null; }
            };

            const blow = () => {
                if (state === "blown") return;
                state = "blown";
                stopMic();
                // If autoplay never kicked in (no gesture before the cake),
                // start the music now — this runs inside a click/gesture context.
                const music = window.UltahLink && window.UltahLink.music;
                if (music && !music.started) music.start();
                playBlow();
                gsap.to(el.querySelectorAll(".flame"), {
                    scale: 0.05, opacity: 0, duration: 0.35,
                    stagger: 0.07, ease: "power2.in",
                });
                gsap.to(el.querySelectorAll(".flame .glow"), { opacity: 0, duration: 0.25 });
                gsap.to(el.querySelector(".cake-wish"), {
                    opacity: 1, y: 0, duration: 0.6, delay: 0.7,
                });
                gsap.to(nextBtn, { opacity: 1, pointerEvents: "auto", duration: 0.4, delay: 0.9 });
            };

            const startListening = () => {
                state = "listening";
                if (window.UltahLink && window.UltahLink.music) window.UltahLink.music.pause();
                hint.textContent = "Tiup sekarang! 🌬️";

                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then((stream) => {
                        // AudioContext created inside the click handler → allowed to run
                        const ctx = new (window.AudioContext || window.webkitAudioContext)();
                        ctx.resume().catch(() => { });
                        const src = ctx.createMediaStreamSource(stream);
                        const analyser = ctx.createAnalyser();
                        analyser.fftSize = 512;
                        src.connect(analyser);

                        const data = new Uint8Array(analyser.frequencyBinCount);
                        let lastBlow = 0;
                        let raf = 0;
                        const check = () => {
                            analyser.getByteTimeDomainData(data);
                            let sum = 0;
                            for (let i = 0; i < data.length; i++) {
                                const v = (data[i] - 128) / 128;
                                sum += v * v;
                            }
                            const rms = Math.sqrt(sum / data.length);
                            // ponytail: naive RMS threshold — tune per device if music leaks in
                            if (rms > 0.35 && Date.now() - lastBlow > 600) {
                                lastBlow = Date.now();
                                blow();
                                return;
                            }
                            raf = requestAnimationFrame(check);
                        };
                        check();

                        cleanup = () => {
                            cancelAnimationFrame(raf);
                            stream.getTracks().forEach((t) => t.stop());
                            ctx.close();
                            if (window.UltahLink && window.UltahLink.music) window.UltahLink.music.resume();
                        };
                    })
                    .catch(() => {
                        // Mic denied or unavailable — click fallback
                        if (window.UltahLink && window.UltahLink.music) window.UltahLink.music.resume();
                        blow();
                    });
            };

            el.querySelector(".cake-area").addEventListener("click", () => {
                if (state === "idle") startListening();
                else blow();
            });

            tl.from(el.querySelector(".cake-area"), {
                duration: 0.8, scale: 0.6, opacity: 0, ease: "back.out(1.6)",
            })
                .from(hint, {
                    duration: 0.5, opacity: 0, y: 12,
                })
                .addPause("+=0.5", () => {
                    state = "idle";
                    stopMic();
                    hint.textContent = originalHint;
                });

            nextBtn.addEventListener("click", () => {
                gsap.to(nextBtn, { opacity: 0, pointerEvents: "none", duration: 0.3 });
                tl.resume();
            });
        },

        // Scheduled by the engine after the pause marker — fades the cake out
        // so the next section (profile) doesn't overlap it.
        exit(tl, el) {
            tl.to(el, { duration: 0.5, opacity: 0 });
        },
    };
})();
