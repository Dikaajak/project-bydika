export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ error: 'Amount is required' });
    }

    const apiKey = "CPK-0507E449092804325F2E01ADC0C74BEF";
    const url = `https://api.claidexpayment.host/create-qr.php?api_key=${apiKey}&amount=${amount}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ success: false, error: "Gagal terhubung ke Claidex" });
    }
}
