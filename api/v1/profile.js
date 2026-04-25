const admin = require('firebase-admin');

if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: serviceAccount.project_id,
                clientEmail: serviceAccount.client_email,
                privateKey: serviceAccount.private_key.replace(/\\n/g, '\n')
            }),
            databaseURL: "https://myproject-485415-default-rtdb.firebaseio.com"
        });
    } catch (error) {
        console.error('Firebase init error:', error);
    }
}

const db = admin.database();

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'x-api-key, Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { api_key } = req.query;
    if (!api_key) return res.status(401).json({ status: false, msg: 'API Key diperlukan' });

    try {
        const snapshot = await db.ref('users').orderByChild('api_key').equalTo(api_key).once('value');
        if (!snapshot.exists()) return res.status(404).json({ status: false, msg: 'User tidak ditemukan' });

        const userData = snapshot.val();
        const user = Object.values(userData)[0];

        return res.status(200).json({
            status: true,
            data: {
                nama: user.nama,
                saldo: user.saldo,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({ status: false, msg: error.message });
    }
};
