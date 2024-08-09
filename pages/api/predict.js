// pages/api/predict.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const response = await fetch('http://localhost:8000/predict', {  // Adjust the URL if needed
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body),
        });
  
        const data = await response.json();
        res.status(response.status).json(data);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  