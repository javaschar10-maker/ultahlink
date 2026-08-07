/**
 * ✨ EDIT THIS FILE to customize the birthday greeting! ✨
 *
 * This is the ONLY file you need to modify.
 * No need to touch HTML, CSS, or any other JavaScript files.
 *
 * AVAILABLE SECTION TYPES:
 *   "greeting"      → Opening greeting with recipient's name
 *   "announcement"  → Birthday announcement text
 *   "chatbox"       → Chat message with typing animation
 *   "ideas"         → Sequential text reveals, one by one
 *   "quote"         → Styled quote card with optional author
 *   "countdown"     → Animated 3-2-1 countdown
 *   "stars"         → Twinkling stars background
 *   "fireworks"     → Colorful firework sparks burst
 *   "balloons"      → Floating balloon animation
 *   "profile"       → Profile photo with birthday wish
 *   "cake"          → Interactive cake — click to blow the candles!
 *   "confetti"      → Confetti burst animation
 *   "closing"       → Closing message with replay button
 *
 * HOW TO USE:
 *   ADD a friend     → Copy the last profile object, fill in the data
 *   REMOVE a section → Delete its object from the sections array
 *   DUPLICATE        → Copy-paste any section object
 *   REORDER          → Move the section object up/down in the array
 *   EDIT TEXT        → Change the string values
 */

const CONFIG = {
  // ── Theme Colors ──────────────────────────────────────────────
  // A toggle button lets the viewer switch between dark & light mode.
  colors: {
    primary: "#00B4D8",             // Bright Cyan (Main accent)
    accent: "#90E0EF",              // Soft Cyan (Secondary accent)
    dark: {
      background: "#03045E",        // Deep Navy
      text: "#CAF0F8",              // Lightest Cyan
    },
    light: {
      background: "#CAF0F8",        // Lightest Cyan
      text: "#03045E",              // Deep Navy
    },
  },

  // ── Default Color Mode ────────────────────────────────────────
  // Options: "dark" or "light"
  defaultMode: "dark",

  // ── Default Music ─────────────────────────────────────────────
  // Used for every profile that doesn't set its own "music".
  music: "./music/hbd.mpeg",

  // ── Profiles ──────────────────────────────────────────────────
  // One entry per friend. Login page and greeting page both read
  // this list — single source of truth, no duplicated data.
  profiles: [
    {
      username: "TEST",             // ← typed on the login page (UPPERCASE)
      birthdate: "01-01",           // ← format DD-MM
      name: "MY TEMAN",        // ← name shown in the greeting
      photo: "./img/irene.jpg",     // ← photo in the img/ folder
      // music: "./music/song-mine.mpeg",  // optional: own song per friend

      // ── This friend's greeting sections (order = display order) ──
      sections: [
        {
          type: "greeting",
          title: "Hei,",
          subtitle: "Aku nggak salah buka website kan? Ini emang khusus buat kamu 😎",
        },
        {
          type: "countdown",
          from: 3,                  // Countdown from this number
          goText: "🎂",             // Text shown after countdown ends
        },
        {
          type: "announcement",
          text: "HARI INI HARI LAHIR KAMU!! 🎉",
        },
        {
          type: "chatbox",
          message:
            "Selamat ulang tahun!! 🥳 Semoga panjang umur, sehat selalu, rezeki lancar jaya, makin keren, dan stok bahagianya nggak pernah habis. Jangan lupa tersenyum hari ini, ya!",
          buttonText: "Send 🚀",
        },
        {
          type: "ideas",
          lines: [
            "Sebenarnya, aku cuma mau bilang: Happy Birthday.",
            "Tapi kayaknya terlalu biasa.",
            "Jadi aku bikinin sesuatu yang lebih <strong>spesial</strong>.",
            "Sebuah website.",
            "Khusus buat kamu <span>:)</span>",
          ],
          bigLetters: "HBD",
        },
        {
          type: "quote",
          text: "Semakin banyak kamu memuji dan merayakan hidupmu, semakin banyak hal yang ada di dalam hidup untuk dirayakan.",
          author: "— Oprah Winfrey",
        },
        {
          type: "stars",
          count: 40,
        },
        {
          type: "balloons",
          count: 25,
        },
        {
          type: "cake",
          candles: 5,
          hint: "Tiup lilinnya — pakai suaramu atau klik kue! 🎤",
          wish: "Semoga wish kamu terkabul! 🎂✨",
          nextText: "Lanjut, lihat fotonya ✨",
        },
        {
          type: "profile",
          wishTitle: "Happy Birthday!",
          wishText: "Semoga tahun ini makin sukses, makin bahagia, dan semua doa kamu cepet nyampe. ✨",
          nextText: "Lanjut 🎉",
        },
        {
          type: "fireworks",
          count: 24,
        },
        {
          type: "confetti",
          count: 9,
        },
        {
          type: "closing",
          text: "Oke, sekarang tutup websitenya… lalu bilang ke aku: suka apa nggak? 😏 Ditunggu testimoninya ya! \n\nWith love, Javas.",
          replayText: "Atau klik di sini kalau mau nonton lagi.",
        },
      ],
    },

    {
      username: "RAFKA",               // ← typed on the login page (UPPERCASE)
      birthdate: "23-03",              // ← format DD-MM
      name: "Rafka", // ← name shown in the greeting
      photo: "./img/RAFKA SMANDA.jpg",    // ← ganti foto Rafka di img/ folder
      music: "./music/Hindia.mpeg",    // ← lagu khusus Rafka (MP3, bukan MPEG)

      // ── Rafka's greeting sections (order = display order) ──
      sections: [
        {
          type: "greeting",
          title: "Halo,",
          subtitle: "Website ini muncul karena kamu spesial… ya iyalah, ini ultahmu! 😎(testing doang, teks pake chatgpt)",
        },
        {
          type: "countdown",
          from: 3,
          goText: "🎂",
        },
        {
          type: "announcement",
          text: "HARI INI HARI LAHIR KAMU!! 🎉(testing doang)",
        },
        {
          type: "chatbox",
          message:
            "Selamat ulang tahun, Rafka! 🥳 Semoga tahun ini makin gacor — rezeki lancar, level bahagia naik terus, dan semua target tercapai. Jangan lupa jadiin hari ini paling seru!(dari chatgpt)",
          buttonText: "Send 🚀",
        },
        {
          type: "ideas",
          lines: [
            "Sebenarnya, aku cuma mau bilang: Happy Birthday.",
            "Tapi kayaknya terlalu biasa.",
            "Jadi aku bikinin sesuatu yang lebih <strong>spesial</strong>.",
            "Sebuah website.",
            "Khusus buat kamu <span>:)</span>",
          ],
          bigLetters: "HBD",
        },
        {
          type: "quote",
          text: "Satu-satunya hal yang saya tahu adalah bahwa saya tidak tahu apa-apa",
          author: "socrates",
        },
        {
          type: "stars",
          count: 40,
        },
        {
          type: "balloons",
          count: 25,
        },
        {
          type: "cake",
          candles: 5,
          hint: "Tiup lilinnya — pakai suaramu atau klik kue! 🎤",
          wish: "Semoga wish kamu terkabul! 🎂✨",
          nextText: "Lanjut, lihat fotonya ✨",
        },
        {
          type: "profile",
          wishTitle: "Happy Birthday!",
          wishText: "Semoga semua target tahun ini tercapai dan makin jaya! 🚀 (prank)",
          nextText: "Lanjut 🎉",
        },
        {
          type: "fireworks",
          count: 24,
        },
        {
          type: "confetti",
          count: 9,
        },
        {
          type: "closing",
          text: "Oke, sekarang tutup websitenya… lalu bilang ke aku: suka apa nggak? 😏",
          replayText: "Atau klik di sini kalau mau nonton lagi.",
        },
      ],
    },

    {
      username: "KEYZHA",               // ← typed on the login page (UPPERCASE)
      birthdate: "07-08",              // ← format DD-MM
      name: "KEYZHA BINTANG", // ← name shown in the greeting
      photo: "./img/RAFKA SMANDA.jpg",    // ← ganti foto Rafka di img/ folder
      music: "./music/Hindia.mpeg",    // ← lagu khusus Rafka (MP3, bukan MPEG)



      // ── Rafka's greeting sections (order = display order) ──
      sections: [
        {
          type: "greeting",
          title: "Halo,",
          subtitle: "Website ini muncul karena kamu spesial… ya iyalah, ini ultahmu! 😎(testing doang, teks pake chatgpt)",
        },
        {
          type: "countdown",
          from: 3,
          goText: "🎂",
        },

        {
          type: "cake",
          candles: 5,
          hint: "Tiup lilinnya — pakai suaramu atau klik kue! 🎤",
          wish: "Semoga wish kamu terkabul! 🎂✨",
          nextText: "Lanjut, lihat fotonya ✨",
        },


        {
          type: "announcement",
          text: "HARI INI HARI LAHIR KAMU!! 🎉(testing doang)",
        },
        {
          type: "chatbox",
          message:
            "Selamat ulang tahun, Rafka! 🥳 Semoga tahun ini makin gacor — rezeki lancar, level bahagia naik terus, dan semua target tercapai. Jangan lupa jadiin hari ini paling seru!(dari chatgpt)",
          buttonText: "Send 🚀",
        },
        {
          type: "ideas",
          lines: [
            "Sebenarnya, aku cuma mau bilang: Happy Birthday.",
            "Tapi kayaknya terlalu biasa.",
            "Jadi aku bikinin sesuatu yang lebih <strong>spesial</strong>.",
            "Sebuah website.",
            "Khusus buat kamu <span>:)</span>",
          ],
          bigLetters: "HBD",
        },
        {
          type: "quote",
          text: "Satu-satunya hal yang saya tahu adalah bahwa saya tidak tahu apa-apa",
          author: "socrates",
        },
        {
          type: "stars",
          count: 40,
        },
        {
          type: "balloons",
          count: 25,
        },

        {
          type: "profile",
          wishTitle: "Happy Birthday!",
          wishText: "Semoga semua target tahun ini tercapai dan makin jaya! 🚀 (prank)",
          nextText: "Lanjut 🎉",
        },
        {
          type: "fireworks",
          count: 24,
        },
        {
          type: "confetti",
          count: 9,
        },
        {
          type: "closing",
          text: "Oke, sekarang tutup websitenya… lalu bilang ke aku: suka apa nggak? 😏",
          replayText: "Atau klik di sini kalau mau nonton lagi.",
        },
      ],
    },
    // ── TEMPLATE: next friend (copy-paste, fill the data) ────────
    // {
    //   username: "BUDI",            // UPPERCASE, same as login
    //   birthdate: "17-08",          // DD-MM
    //   name: "Budi",
    //   photo: "./img/budi.jpg",
    //   sections: [
    //     { type: "greeting", title: "Hey,", subtitle: "Kali ini giliran kamu 🎈" },
    //     { type: "countdown", from: 3, goText: "🎉" },
    //     { type: "announcement", text: "SELAMAT ULANG TAHUN!!" },
    //     { type: "chatbox", message: "Semoga hari-harimu menyenangkan!", buttonText: "Send" },
    //     { type: "profile", wishTitle: "Happy Birthday!", wishText: "Cheers! 🥂" },
    //     { type: "cake", candles: 3, hint: "Tiup lilinnya!", wish: "Wish granted! ✨" },
    //     { type: "closing", text: "Sekian, terima kasih sudah menonton 😄", replayText: "Mau nonton lagi? Klik di sini." },
    //   ],
    // },


  ],
};
