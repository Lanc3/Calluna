// Logout API endpoint for Vercel
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // For serverless, just return success
    // In a full implementation, we'd clear JWT cookies or invalidate tokens
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout API error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
}