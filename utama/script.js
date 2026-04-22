const firebaseConfig = {
    apiKey: "AIzaSyC_5LQ6U3DtMf4STbDjLymazm8I_zySbSw",
    authDomain: "myproject-485415.firebaseapp.com",
    projectId: "myproject-485415",
    storageBucket: "myproject-485415.firebasestorage.app",
    messagingSenderId: "450623193142",
    appId: "1:450623193142:web:d7a9caf66e1dff8d495897"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.database();

const regisForm = document.getElementById('regisForm');
if (regisForm) {
    regisForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nama = document.getElementById('nama').value;
        const nomorWa = document.getElementById('nomorWa').value;
        const email = document.getElementById('email').value;
        const pw = document.getElementById('pw').value;

        Swal.fire({
            title: 'Mendaftarkan...',
            text: 'Sedang menyimpan data ke database',
            background: '#00222d',
            color: '#fff',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            const res = await auth.createUserWithEmailAndPassword(email, pw);
            await db.ref('users/' + res.user.uid).set({
                nama: nama,
                nomorWa: nomorWa,
                email: email,
                pw: pw,
                saldo: 0,
                role: 'member',
                createdAt: new Date().toISOString()
            });

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Akun kamu sudah aktif di Rooxpedia.',
                icon: 'success',
                background: '#00222d',
                color: '#fff'
            });

            window.location.href = 'login.html';
        } catch (err) {
            Swal.fire({
                title: 'Registrasi Gagal',
                text: err.message,
                icon: 'error',
                background: '#00222d',
                color: '#fff'
            });
        }
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pw = document.getElementById('pw').value;

        try {
            await auth.signInWithEmailAndPassword(email, pw);
            window.location.href = 'dashboard.html';
        } catch (err) {
            alert(err.message);
        }
    });
}

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const profileCard = document.getElementById('profileCard');

if (document.getElementById('openSidebar')) {
    document.getElementById('openSidebar').onclick = () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    };
}

if (document.getElementById('closeSidebar')) {
    document.getElementById('closeSidebar').onclick = () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    };
}

if (document.getElementById('toggleProfile')) {
    document.getElementById('toggleProfile').onclick = (e) => {
        e.stopPropagation();
        profileCard.classList.toggle('active');
    };
}

if (overlay) {
    overlay.onclick = () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        profileCard.classList.remove('active');
    };
}

let userPassword = "";
let showing = false;

auth.onAuthStateChanged((user) => {
    if (user) {
        if (document.getElementById('p-nama')) {
            db.ref('users/' + user.uid).on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    document.getElementById('p-nama').innerText = data.nama || "-";
                    document.getElementById('p-role').innerText = (data.role || "MEMBER").toUpperCase();
                    document.getElementById('p-email').innerText = data.email || "-";
                    document.getElementById('p-wa').innerText = data.nomorWa || "-";
                    userPassword = data.pw || "******";
                }
            });
        }
    } else {
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'login.html';
        }
    }
});

const eyeIcon = document.getElementById('togglePw');
if (eyeIcon) {
    eyeIcon.onclick = () => {
        showing = !showing;
        const pwDisplay = document.getElementById('p-pw');
        if (showing) {
            pwDisplay.innerText = userPassword;
            eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            pwDisplay.innerText = "••••••••";
            eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    };
}

if (document.getElementById('btnLogout')) {
    document.getElementById('btnLogout').onclick = () => {
        auth.signOut().then(() => {
            window.location.href = 'login.html';
        });
    };
}
