module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    const quotes = [
        "coming soon, kaya janji manisnya yang cuma mampir sebentar terus hilang.",
        "next update, nungguin ini sama capeknya kaya nungguin dia yang gak pernah peka.",
        "lagi diperbaiki, hati ini juga lagi usaha buat sembuh meski lukanya dalam banget.",
        "sabar ya, aku udah biasa nunggu kok, apalagi cuma nunggu update-an ini.",
        "bentar lagi siap, gak kaya hubungan kita yang selesai sebelum sempat dimulai.",
        "masih diproses, sama kaya aku yang masih proses melupakan semua kenangan kita.",
        "tunggu aja, tapi jangan terlalu berharap, aku gak mau kamu ngerasain kecewa yang sama.",
        "error di sistem bisa diperbaiki, tapi kalau hati yang patah butuh waktu yang lama.",
        "halaman belum tersedia, sama kaya ruang di hatinya yang udah nggak ada buat aku.",
        "sedang dikerjakan, berusaha profesional padahal hati berantakan.",
        "belum waktunya rilis, mungkin semesta mau kita belajar ikhlas dulu.",
        "rehat sejenak, karena pura-pura bahagia itu ternyata melelahkan juga.",
        "lagi nyusun kode, sambil nyusun kepingan hati yang hancur gara-gara dia.",
        "coming soon, semoga update ini gak ninggalin luka kaya yang dia lakuin.",
        "offline sementara, lagi fokus nyari cara biar gak ingat dia lagi.",
        "sedang memuat data, mohon sabar, rindu ini juga lagi dimuat pelan-pelan.",
        "jangan ditekan terus, nanti error, sama kaya perasaan aku yang dipaksain.",
        "update segera tiba, tapi kalau dia yang kembali itu cuma mimpi di siang bolong.",
        "proses pemulihan sistem, doakan hatiku juga ikut pulih secepatnya.",
        "masih kosong, persis kaya perasaan aku pas tau dia udah punya yang baru."
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>coming soon</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #0d0d0d;
                color: #777;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                text-align: center;
                overflow: hidden;
            }
            .container {
                padding: 30px;
                border: 1px solid #1a1a1a;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 15px;
                backdrop-filter: blur(5px);
            }
            h1 {
                font-size: 1.2rem;
                letter-spacing: 7px;
                color: #fff;
                margin-bottom: 20px;
                font-weight: 200;
                text-transform: lowercase;
            }
            p {
                font-size: 0.85rem;
                line-height: 1.8;
                max-width: 320px;
                margin: 0 auto;
                font-style: italic;
                font-weight: 300;
            }
            .cursor {
                display: inline-block;
                width: 8px;
                height: 2px;
                background-color: #555;
                margin-left: 5px;
                animation: blink 1.2s infinite;
            }
            @keyframes blink {
                0%, 100% { opacity: 0; }
                50% { opacity: 1; }
            }
            .footer {
                position: absolute;
                bottom: 30px;
                font-size: 0.65rem;
                letter-spacing: 2px;
                opacity: 0.3;
                text-transform: lowercase;
            }
            .glow {
                position: absolute;
                width: 200px;
                height: 200px;
                background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%);
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: -1;
            }
            .btn-login {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                color: #fff;
                text-decoration: none;
                border: 1px solid #333;
                border-radius: 8px;
                font-size: 0.7rem;
                transition: 0.3s;
            }
            .btn-login:hover {
                background: #fff;
                color: #000;
            }
        </style>
    </head>
    <body>
        <div class="glow"></div>
        <div class="container">
            <h1>coming soon<span class="cursor"></span></h1>
            <p>"${randomQuote}"</p>
            <a href="login.html" class="btn-login">masuk ke dashboard</a>
        </div>
        <div class="footer">
            next update no kapital
        </div>
    </body>
    </html>
    `;

    return res.status(200).send(html);
};
