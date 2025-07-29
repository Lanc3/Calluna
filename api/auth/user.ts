import type { VercelRequest, VercelResponse } from '@vercel/node';
// import { verifyJwt } from '../../lib/jwt'; // implement JWT verification if needed

export default async function handler(req: VercelRequest, res: VercelResponse) {
 res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ message: 'Database not configured' });
    }

    // For serverless, session management needs to be implemented differently
    // For now, return unauthorized - proper session management in serverless needs cookie parsing
    res.status(401).json({ message: 'Unauthorized' });
  } catch (error) {
    console.error('Auth user API error:', error);
    res.status(500).json({ message: 'Failed to get user' });
  };
}