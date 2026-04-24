const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: "myproject-485415",
            clientEmail: "firebase-adminsdk-xxxxx@myproject-485415.iam.gserviceaccount.com",
            privateKey: "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n')
        }),
        databaseURL: "https://myproject-485415-default-rtdb.firebaseio.com"
    });
}

const db = admin.database();

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ status: false, msg: 'Metode tidak diizinkan' });
    }

    const apiKey = req.headers['x-api-key'] || req.query.api_key;

    if (!apiKey) {
        return res.status(401).json({ status: false, msg: 'API Key diperlukan' });
    }

    try {
        const usersRef = db.ref('users');
        const snapshot = await usersRef.orderByChild('api_key').equalTo(apiKey).once('value');
        const userData = snapshot.val();

        if (!userData) {
            return res.status(404).json({ status: false, msg: 'API Key tidak valid' });
        }

        const uid = Object.keys(userData)[0];
        const user = userData[uid];

        res.status(200).json({
            status: true,
            data: {
                nama: user.nama,
                saldo: user.saldo,
                role: user.role,
                nomorWa: user.nomorWa
            }
        });
    } catch (error) {
        res.status(500).json({ status: false, msg: 'Server Error' });
    }
}
