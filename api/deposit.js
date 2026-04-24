export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = req.body;
    const action = body.action;
    const apiKey = "CASHI-B4DCKNJASIU";

    if (action === 'create') {
        const amount = body.amount;
        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        try {
            const response = await fetch('https://cashi.id/api/create-order', {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: parseInt(amount),
                    order_id: "DIKA-" + Date.now(),
                    QRIS_CUSTOM: true
                })
            });
            const data = await response.json();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ success: false, error: "Gagal terhubung ke Cashi" });
        }
    }

    if (action === 'status') {
        const orderId = body.orderId;
        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        try {
            const response = await fetch(`https://cashi.id/api/check-status/${orderId}`, {
                method: 'GET',
                headers: {
                    'x-api-key': apiKey
                }
            });
            const data = await response.json();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: "Gagal cek status" });
        }
    }

    return res.status(400).json({ error: 'Invalid action' });
}
