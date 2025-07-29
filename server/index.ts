// Development server for local testing
// In production, Vercel handles the serverless functions
import { createServer } from 'vite';

async function startDevServer() {
  const server = await createServer({
    server: { 
      port: 5000,
      open: true
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify('development')
    }
  });

  await server.listen();
  console.log('🚀 Vite dev server running on http://localhost:5000');
  console.log('📁 API functions are simulated locally for development');
}

startDevServer().catch(console.error);