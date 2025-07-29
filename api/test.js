// Simple test endpoint to verify Vercel function works
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  res.status(200).json({
    message: "Vercel function is working!",
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      SESSION_SECRET: process.env.SESSION_SECRET ? 'Set' : 'Not set',
      NODE_ENV: process.env.NODE_ENV
    }
  });
}