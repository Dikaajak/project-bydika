const admin = require('firebase-admin');

const serviceAccount = {
  projectId: "myproject-485415",
  clientEmail: "firebase-adminsdk-fbsvc@myproject-485415.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKgwggSlAgEAAoIBAQCXsdaPxb/MMUP1\neZ4x2yirzgj6bEFOAeO87+GTGmYq/m+nxzKP6uVmM8RgfcW6GoVg24/TleGOSXOs\nr50/Onj0rwpuMHaUGWG/Scwpaurbhm3wiGN1uCeqToKm0FkWnIyraDlz1MlFRJH7\noI1YdpfGAvV7hMw0b3hU40PBDgpxrpx/UEf3Rkz2mA5w1HCD7cPHvRd4LSmPCJcX\ndjPAjIFl1yJevj6qOzo53rYARZweneElDZFMj2gtHHjxddfR6mOnh2ivECUvyL8E\n4Y6RRiyfGKL9atIVKxZNvIVglKQU6I6svZVVzlZMQN20iOscqMEM/OMR6+oi7UKH\nOKcnrMT1AgMBAAECggEAA54dDfaSq5dvDRHCO8lZKEpp3O8FUc+7UzCTM4nTxFRR\n2znuP9Qhdf/WlTeVUOoVzUi7/I50GUdCXEqXEfgE4nD188ktKKMEdTdlmXQQXcpH\nuspffWIlDeL4XmshlueomH3ha4uewj7NdPylWcPNeCOy/fS3M5jte9roLSVlpH/X\nEreq6lLW0heXXwtgycfrc3atHYrIwSKn93LuprgUdDKjTzMXQS7Tgt+9Q9McojoZ\n8uBkMOgJSlTIcvFzZH1flztnZWI+JVpuOkHZHreP1rVOyyEP01GNcph6GVpnWM1J\n4JWUzDsK2v58f7BXjfNIGsmRwtWgODW9EW9liwAuEQKBgQDFXL9Y6PtwEgM3ih9n\nPl09z4QTsE/UsqACrFCjnipkg28JjI2UJ6UiBlCBSAbYcD9h7jv/KCTEGR44gYPR\n4ZVEQAp9YCz+R7wPnKQ5fWGKJln4GZ3auiAKCkzQop/iWaLdLRRVN6sQIRuMzBZM\n0TdA303BZ9Iv2Y6b0luN4vWzFwKBgQDEw6P46CLA1Gsa6e0EDxGcLAbG5pZIjonx\nw6UnTCEfomQ/IcW7aZxbn+nofBTuv04h4zpKQNBmzWsfrfap5V/xF9oXg0uTu3JZ\npBEZwcv5dPmxgEfq+dnfE1Y3CoeTplVfNQ87XaD/59XypJCH8uxAEaFeyr3O6G6a\nWYsE9VS/0wKBgQC8qL8Ex5lq9Nz8X11LfPL2ngKcK4L0SFfqljtzXEMb2APxddj0\nkb0pvC2Cl45roUkFXQ0fCIm0pmocC7oti9z649jjJmd8HqhnqA3YIsF1pNmF7z7V\nEeyEjHoHSh1Z6uNjV69DErbD8VH7ki+S+L8/lPYn9g2WzfmjfD8mb5j8uwKBgQCG\nTPLSpb9y1on0aM56Ar8GVZaalDDnfULyXZOQawoAyZqa7LZF4SPz9gZ1xJuVCcaO\nosXagLq+MF951AeUlxcRPDKD8f3X7A102eNCLWDH9+umF+T+oWLwPAaQswMu6E1F\nGrY20wVdJiSF5YUxBcHzSRVX2hIL8+HqQEv/KmSaOQKBgQC5n5D5NNLNLzzXMUvp\n8QRf1f9APDBJ4CqJui3/QqEg5VF3E+DFcYnVVRXgbQUTqMU5/mIzTcVm3Vyt5C/G\nIUDCps3AD2ArTa1Mh1M6skyPXcTQ/VVYXM1WVMHoWDsQfVFyE8zQ0Z+TTZHhn2pX\nceuM09pF1YR7U7XtET8TLf0Usg==\n-----END PRIVATE KEY-----\n"
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: serviceAccount.projectId,
            clientEmail: serviceAccount.clientEmail,
            privateKey: serviceAccount.privateKey.replace(/\\n/g, '\n')
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
