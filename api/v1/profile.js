const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
        }),
        databaseURL: "https://myproject-485415-default-rtdb.firebaseio.com"
    });
}

const db = admin.database();

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'x-api-key, Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { api_key } = req.query;

    if (!api_key) {
        return res.status(401).json({ status: false, msg: 'API Key diperlukan' });
    }

    try {
        const snapshot = await db.ref('users')
            .orderByChild('api_key')
            .equalTo(api_key)
            .once('value');

        if (!snapshot.exists()) {
            return res.status(404).json({ status: false, msg: 'User tidak ditemukan' });
        }

        const userData = snapshot.val();
        const userKey = Object.keys(userData)[0];
        const user = userData[userKey];

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
