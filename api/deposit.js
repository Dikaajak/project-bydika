export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = req.body;
    const action = body.action;

    if (action === 'create') {
        const amount = body.amount;
        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        const apiKey = "CPK-0507E449092804325F2E01ADC0C74BEF";
        const url = `https://api.claidexpayment.host/create-qr.php?api_key=${apiKey}&amount=${amount}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ success: false, error: "Gagal terhubung" });
        }
    }

    if (action === 'status') {
        const ref = body.ref;
        if (!ref) {
            return res.status(400).json({ error: 'Reference is required' });
        }

        const statusUrl = `https://claidexpayment.host/check-status.php?ref=${ref}`;

        try {
            const response = await fetch(statusUrl);
            const data = await response.json();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: "Gagal cek status" });
        }
    }

    return res.status(400).json({ error: 'Invalid action' });
}
