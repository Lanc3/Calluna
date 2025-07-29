// Vercel serverless function handler
export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const path = req.url;
  
  try {
    // Import and create the Express app
    const express = (await import('express')).default;
    const { registerRoutes } = await import('../server/routes.js');
    
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    
    // Set up routes
    registerRoutes(app);
    
    // Handle the request through Express
    app(req, res);
    
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message,
      path: path
    });
  }
}