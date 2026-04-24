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
    if (user) {
        db.ref('users/' + user.uid).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                if (!data.api_key) {
                    const newKey = generateApiKey();
                    db.ref('users/' + user.uid).update({
                        api_key: newKey
                    });
                }

                if (document.getElementById('p-nama')) document.getElementById('p-nama').innerText = data.nama || "-";
                if (document.getElementById('p-role')) document.getElementById('p-role').innerText = (data.role || "MEMBER").toUpperCase();
                if (document.getElementById('p-api-key')) document.getElementById('p-api-key').innerText = data.api_key || "-";
                
                const saldoVal = data.saldo || 0;
                const saldoFormatted = "Rp " + new Intl.NumberFormat('id-ID').format(saldoVal);
                if (document.getElementById('topSaldo')) document.getElementById('topSaldo').innerText = saldoFormatted;
                if (document.getElementById('p-saldo-card')) document.getElementById('p-saldo-card').innerText = saldoFormatted;

                if (document.getElementById('p-pesanan')) {
                    db.ref('orders/' + user.uid).once('value', (orderSnap) => {
                        let count = 0;
                        let totalSpent = 0;
                        orderSnap.forEach((child) => {
                            if (child.val().status === 'SUKSES') {
                                count++;
                                totalSpent += child.val().harga || 0;
                            }
                        });
                        document.getElementById('p-pesanan').innerText = `${count} / Rp ${new Intl.NumberFormat('id-ID').format(totalSpent)}`;
                    });
                }

                if (document.getElementById('p-deposit')) {
                    db.ref('deposits/' + user.uid).once('value', (depoSnap) => {
                        let totalDepo = 0;
                        let countDepo = 0;
                        depoSnap.forEach((child) => {
                            if (child.val().status === 'SUKSES') {
                                totalDepo += child.val().nominal || 0;
                                countDepo++;
                            }
                        });
                        document.getElementById('p-deposit').innerText = `Rp ${new Intl.NumberFormat('id-ID').format(totalDepo)} / ${countDepo}`;
                    });
                }
            }
        });

        db.ref('users').orderByChild('total_deposit').limitToLast(1).on('value', (snap) => {
            snap.forEach((child) => {
                if (document.getElementById('p-rank')) {
                    const val = child.val().total_deposit || 0;
                    document.getElementById('p-rank').innerText = `#1 (Rp ${new Intl.NumberFormat('id-ID').format(val)})`;
                }
            });
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

function copyApiKey() {
    const keyText = document.getElementById('p-api-key').innerText;
    if (keyText === "-" || !keyText) return;
    navigator.clipboard.writeText(keyText);
    alert("API Key berhasil disalin!");
}
