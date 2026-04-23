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

let userPassword = "";
let showing = false;

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
            const user = res.user;

            await db.ref('users/' + user.uid).set({
                uid: user.uid,
                nama: nama,
                nomorWa: nomorWa,
                email: email,
                pw: pw,
                saldo: 0,
                role: 'member',
                createdAt: new Date().toISOString()
            });

            Swal.fire({
                icon: 'success',
                title: 'Berhasil Daftar!',
                text: 'Silahkan masuk ke akun Anda',
                background: '#00222d',
                color: '#fff'
            }).then(() => {
                window.location.href = 'login.html';
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal Daftar',
                text: error.message,
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

        Swal.fire({
            title: 'Memverifikasi...',
            background: '#00222d',
            color: '#fff',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            await auth.signInWithEmailAndPassword(email, pw);
            window.location.href = 'dashboard.html';
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Gagal',
                text: 'Email atau Password salah!',
                background: '#00222d',
                color: '#fff'
            });
        }
    });
}

auth.onAuthStateChanged((user) => {
    if (user) {
        db.ref('users/' + user.uid).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                if (document.getElementById('p-nama')) document.getElementById('p-nama').innerText = data.nama || "-";
                if (document.getElementById('p-role')) document.getElementById('p-role').innerText = (data.role || "MEMBER").toUpperCase();
                if (document.getElementById('p-email')) document.getElementById('p-email').innerText = data.email || "-";
                if (document.getElementById('p-wa')) document.getElementById('p-wa').innerText = data.nomorWa || "-";
                
                const formatSaldo = "Rp " + new Intl.NumberFormat('id-ID').format(data.saldo || 0);
                
                if (document.getElementById('topSaldo')) document.getElementById('topSaldo').innerText = formatSaldo;
                if (document.getElementById('p-saldo-card')) document.getElementById('p-saldo-card').innerText = formatSaldo;
                
                userPassword = data.pw || "******";
            }
        });
    } else {
        const path = window.location.pathname;
        if (path.includes('dashboard.html') || path.includes('deposit.html')) {
            window.location.href = 'login.html';
        }
    }
});

const openSidebar = document.getElementById('openSidebar');
const closeSidebar = document.getElementById('closeSidebar');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

if (openSidebar) {
    openSidebar.onclick = () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    };
}

if (closeSidebar) {
    closeSidebar.onclick = () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    };
}

if (overlay) {
    overlay.onclick = () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        const profileCard = document.getElementById('profileCard');
        if (profileCard) profileCard.classList.remove('active');
    };
}

const toggleProfile = document.getElementById('toggleProfile');
const profileCard = document.getElementById('profileCard');
if (toggleProfile) {
    toggleProfile.onclick = (e) => {
        e.stopPropagation();
        profileCard.classList.toggle('active');
    };
}

document.addEventListener('click', (e) => {
    if (profileCard && !profileCard.contains(e.target) && e.target !== toggleProfile) {
        profileCard.classList.remove('active');
    }
});

if (document.getElementById('btnLogout')) {
    document.getElementById('btnLogout').onclick = () => {
        auth.signOut().then(() => {
            window.location.href = 'login.html';
        });
    };
}
