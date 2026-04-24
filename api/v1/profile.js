const admin = require('firebase-admin');

const serviceAccount = {
  projectId: "myproject-485415",
  clientEmail: "firebase-adminsdk-fbsvc@myproject-485415.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvWt6h1Ag6iU8T\nplsIKWEA+0EmAY5vl0gh6ZaQS5nPB0+Dp+fCDRJoCNSNk6Bj8kHaARI+Cd0LTEN0\nPdpBRzo23U2owt+JiYs4fBiafBQrO9ULumgd6pZvW5F8Vy0jwRRDvhG0avPqsZ6P\nBxuH8NzqOIoPbhuW+bnvQsavRMqyFGEdQfiru4eDuJBzTw4TP0AslVmcsAvpGCMo\nJYxmpRylkj9P1hHUsgZzIJVPAtGwbjlZDcPv6EE5V62La72OgwYrAURrScB2TKq4\n1xxUnONkl/g3K7Pao1G5nw7cqEghhu76lz7qvkwx4ZOZr5odv1PwTpAeXkg8y0ol\n61sp6idFAgMBAAECggEADm5iixvpj3O0a9ARhtLs9kk3O9r972YaXBwetYJbRqP5\n4cJkOt6biK9NWtdu6DrMO5ZB+5QROnhMxti+SQgFHPXKidx7zBRjPkNMPQ6AFGzI\npD3zip6/QaveBccg4mPl+ItAZsI0j7iNbYTuuZnTfH0ps4piv+KOcEflFRCKw+vx\ngCXooWU2KDPsEpxzf8w4E5qiDHB3NMQw3WVHPuhpBWkfTJa1HXhdvbblUciP0N7u\n37IOykXayn54d4TiLS7Vs9IpXyOMHr6NdvIv0cP+45VI1N6GLAAcgDZ6om+iJuvv\nASUvddnmDFMoPbRxnkeTxsf94QxeH/COMUtLnDZqwwKBgQDhDB+QxHAeX0h3rNLK\nREuOZoz6NUuupnURkZxK5smtYjAKDu396Ah/NUt4Jvg5vjHh2nqhn1eZ1FmOvk0+\nLwMU+zg+H2FuV970KTjkNIijzWdXRH2i3jZ3wh/MUjhcn13ktWRK96aTsfCImedm\nVIe2O4kumJ1E9JgIARKkPxbQtwKBgQDHeRYHNCu/1yNbdiB2lWof2ivkg8ZxX88P\n5iCdEszLkQdf6gW7xj2VeiEyrE6U73iQCtXw6YM9+6H4QrImhCpkirXEweh/k3fK\nF705hxwSnTvDYE5gOheIqxqYShwqIqJEn8zBuvj37O8kKXJ3SzCKiYSht2PhEbni\noPFytdqT4wKBgQCg5TEAKGFcZZUC8s11jORT99+c11O3lwyltev+5QeVbViZKFlg\nqW7Bu9GsInhfmCpDphb8zFYuBdLNqiLBbY0PiBiK2Zan9CzTdVFWXnS+X5EdpDsK\noUJh1qkzRClFly7i4AjHTE2M1K/6icYVtCOe1uvaI4R1E0ZKmrHAOdbO+wKBgDPP\n+O/QFlkTScTVDyOeNd2mLuaBcAc86qzniqsiGf36Yt8AC5M1sANmoL7n0NWQylEn\n72BPV16/QNgagunMRLKu8P31nC2fIWtl9Sm/NYSEQOTD3DfUfw5p21OZVG2BZ4LJ\nu0bLCSZk7c0H0wq3hhlGFSRoXVI154G9alnwcKEfAoGBAMzTiU4nG+GypL6e66/D\nj9+7jesiAh1I0MEQ4vTEUvNHdR+2cFoRrRglyEvWjvar8RmGbXZY87YCuA+c0nWK\nH4SMpjLCquTSJU4mH+n+rZGNT4bPGR7lNQfAFjy+M277xT7uY7OR4MfhuNV4SyYf\0V1GLSUBb+dNLadg/p/RRT19\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n')
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://myproject-485415-default-rtdb.firebaseio.com"
    });
}

const db = admin.database();

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'x-api-key, Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    if (!apiKey) return res.status(401).json({ status: false, msg: 'API Key diperlukan' });

    try {
        const snapshot = await db.ref('users').orderByChild('api_key').equalTo(apiKey).once('value');
        const userData = snapshot.val();

        if (!userData) return res.status(404).json({ status: false, msg: 'API Key tidak valid' });

        const uid = Object.keys(userData)[0];
        const user = userData[uid];

        return res.status(200).json({
            status: true,
            data: {
                nama: user.nama,
                saldo: user.saldo,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({ status: false, msg: 'Internal Server Error' });
    }
};
