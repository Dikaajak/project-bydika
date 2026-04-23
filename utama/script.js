const firebaseConfig = {
    apiKey: "AIzaSyC_5LQ6U3DtMf4STbDjLymazm8I_zySbSw",
    authDomain: "myproject-485415.firebaseapp.com",
    databaseURL: "https://myproject-485415-default-rtdb.firebaseio.com",
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

auth.onAuthStateChanged((user) => {
    if (user) {
        db.ref('users/' + user.uid).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                if (document.getElementById('p-nama')) document.getElementById('p-nama').innerText = data.nama || "-";
                if (document.getElementById('p-role')) document.getElementById('p-role').innerText = (data.role || "MEMBER").toUpperCase();
                
                const saldoVal = data.saldo || 0;
                const saldoFormatted = "Rp " + new Intl.NumberFormat('id-ID').format(saldoVal);
                
                if (document.getElementById('topSaldo')) document.getElementById('topSaldo').innerText = saldoFormatted;
                if (document.getElementById('p-saldo-card')) document.getElementById('p-saldo-card').innerText = saldoFormatted;

                const pesananCount = data.pesananSukses || 0;
                const pesananRp = data.totalBelanja || 0;
                if (document.getElementById('p-pesanan')) {
                    document.getElementById('p-pesanan').innerText = `${pesananCount} / Rp ${new Intl.NumberFormat('id-ID').format(pesananRp)}`;
                }

                const depositRp = data.totalDeposit || 0;
                const depositCount = data.jumlahDeposit || 0;
                if (document.getElementById('p-deposit')) {
                    document.getElementById('p-deposit').innerText = `Rp ${new Intl.NumberFormat('id-ID').format(depositRp)} / ${depositCount}`;
                }

                if (document.getElementById('p-rank')) {
                    document.getElementById('p-rank').innerText = `#1 (${saldoFormatted})`;
                }
            }
        });
    } else {
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'login.html';
        }
    }
});

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const openSidebar = document.getElementById('openSidebar');
const closeSidebar = document.getElementById('closeSidebar');
const toggleProfile = document.getElementById('toggleProfile');
const profileCard = document.getElementById('profileCard');

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
        if (profileCard) profileCard.classList.remove('active');
    };
}

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
