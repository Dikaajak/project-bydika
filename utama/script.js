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

function generateApiKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'DK-';
    for (let i = 0; i < 24; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

auth.onAuthStateChanged((user) => {
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('login.html');
    const isRegisPage = currentPath.includes('regis.html');

    if (user) {
        if (isLoginPage || isRegisPage) {
            window.location.replace('dashboard.html');
            return;
        }

        db.ref('users/' + user.uid).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                if (!data.api_key) {
                    const newKey = generateApiKey();
                    db.ref('users/' + user.uid).update({ api_key: newKey });
                }

                if (document.getElementById('p-nama')) document.getElementById('p-nama').innerText = data.nama || "-";
                if (document.getElementById('p-role')) document.getElementById('p-role').innerText = (data.role || "MEMBER").toUpperCase();
                if (document.getElementById('p-api-key')) document.getElementById('p-api-key').innerText = data.api_key || "-";
                
                const saldoVal = data.saldo || 0;
                const saldoFormatted = "rp " + new Intl.NumberFormat('id-ID').format(saldoVal);
                if (document.getElementById('topSaldo')) document.getElementById('topSaldo').innerText = saldoFormatted;
                if (document.getElementById('p-saldo-card')) document.getElementById('p-saldo-card').innerText = saldoFormatted;
            }
        });

        db.ref('orders/' + user.uid).on('value', (snapshot) => {
            let berhasil = 0, pending = 0, gagal = 0, batal = 0, totalSpent = 0;

            snapshot.forEach((child) => {
                const order = child.val();
                const st = (order.status || "").toUpperCase();

                if (st === "SUKSES" || st === "SUCCESS" || st === "BERHASIL") {
                    berhasil++;
                    totalSpent += order.harga || 0;
                } else if (st === "PENDING") {
                    pending++;
                } else if (st === "GAGAL" || st === "FAILED") {
                    gagal++;
                } else if (st === "BATAL" || st === "CANCELED") {
                    batal++;
                }
            });

            if (document.getElementById('p-pesanan')) {
                document.getElementById('p-pesanan').innerText = `${berhasil} / rp ${new Intl.NumberFormat('id-ID').format(totalSpent)}`;
            }
            if (document.getElementById('p-order-pending')) document.getElementById('p-order-pending').innerText = pending;
            if (document.getElementById('p-order-failed')) document.getElementById('p-order-failed').innerText = gagal;
            if (document.getElementById('p-order-canceled')) document.getElementById('p-order-canceled').innerText = batal;
        });

        db.ref('deposits/' + user.uid).on('value', (snapshot) => {
            let totalDepo = 0, countDepo = 0;
            snapshot.forEach((child) => {
                const depo = child.val();
                const st = (depo.status || "").toUpperCase();
                if (st === "SUKSES" || st === "SUCCESS") {
                    totalDepo += (depo.nominal || depo.amount || 0);
                    countDepo++;
                }
            });
            if (document.getElementById('p-deposit')) {
                document.getElementById('p-deposit').innerText = `rp ${new Intl.NumberFormat('id-ID').format(totalDepo)} / ${countDepo}`;
            }
        });

        db.ref('users').orderByChild('total_deposit').limitToLast(1).on('value', (snap) => {
            snap.forEach((child) => {
                if (document.getElementById('p-rank')) {
                    const val = child.val().total_deposit || 0;
                    document.getElementById('p-rank').innerText = `#1 (rp ${new Intl.NumberFormat('id-ID').format(val)})`;
                }
            });
        });

    } else {
        if (!isLoginPage && !isRegisPage) {
            window.location.replace('login.html');
        }
    }
});

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('pw').value;

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                window.location.replace('dashboard.html');
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Gagal',
                    text: 'Email atau password salah!',
                    confirmButtonColor: '#00acc1'
                });
            });
    };
}

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
            window.location.replace('login.html');
        });
    };
}

function copyApiKey() {
    const keyElement = document.getElementById('p-api-key');
    if (!keyElement) return;
    const keyText = keyElement.innerText;
    if (keyText === "-" || !keyText) return;
    navigator.clipboard.writeText(keyText);
    alert("API Key berhasil disalin!");
}
