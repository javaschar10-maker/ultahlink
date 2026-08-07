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

    // Real blow detection via microphone. Music pauses while the mic is on
    // and resumes after the blow. Returns a cleanup function (or null if
    // unsupported) — click on the cake stays as fallback.
    // ponytail: naive RMS threshold (0.35); tune per device if loud music leaks in.
    function startBlowDetection(onBlow) {
        let cleanup = null;
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return cleanup;

        if (window.UltahLink && window.UltahLink.music) window.UltahLink.music.pause();

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                // Context created without a user gesture starts suspended → analyser
                // reads silence → blow never detected. Resume right after creation.
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
                    if (rms > 0.03 && Date.now() - lastBlow > 600) {
                        lastBlow = Date.now();
                        onBlow();
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
                // Mic denied — click fallback
                if (window.UltahLink && window.UltahLink.music) window.UltahLink.music.resume();
            });

        return cleanup;
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
        <p class="cake-hint">${section.hint || "Klik kue, tiup lilinnya… lalu buat wish!"}</p>
        <p class="cake-wish">${section.wish || "Semoga wish kamu terkabul! 🎂✨"}</p>
        <button type="button" class="next-btn cake-next">${section.nextText || "Lanjut →"}</button>
      `;
            container.appendChild(div);
            return div;
        },

        animate(tl, el) {
            let done = false;
            let cleanup = null;
            const nextBtn = el.querySelector(".cake-next");

            const blow = () => {
                if (done) return;
                done = true;
                if (cleanup) { cleanup(); cleanup = null; }
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

            tl.from(el.querySelector(".cake-area"), {
                duration: 0.8, scale: 0.6, opacity: 0, ease: "back.out(1.6)",
            })
                .from(el.querySelector(".cake-hint"), {
                    duration: 0.5, opacity: 0, y: 12,
                })
                .addPause("+=0.5", () => {
                    done = false;
                    if (cleanup) { cleanup(); cleanup = null; }
                    cleanup = startBlowDetection(blow);
                });

            // Fallback & guarantee: click always blows the candles
            el.querySelector(".cake-area").addEventListener("click", blow);

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
