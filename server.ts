import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Canonical API Handlers (Single Source of Truth)
import chatHandler from './api/chat.js';
import readingHandler from './api/reading.js';
import registerHandler from './api/register.js';
import createPaymentHandler from './api/create-payment.js';
import mercadopagoWebhookHandler from './api/mercadopago-webhook.js';
import adminHandler from './api/admin.js';
import accountHandler from './api/account.js';
import healthHandler from './api/health.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// No-store cache control for dynamic API endpoints
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  next();
});

// Health Check
app.all('/api/health', (req, res) => healthHandler(req as any, res as any));

// Private & Core API Routes
app.all('/api/chat', (req, res) => chatHandler(req as any, res as any));
app.all('/api/reading', (req, res) => readingHandler(req as any, res as any));
app.all('/api/register', (req, res) => registerHandler(req as any, res as any));
app.all('/api/create-payment', (req, res) => createPaymentHandler(req as any, res as any));
app.all('/api/mercadopago-webhook', (req, res) => mercadopagoWebhookHandler(req as any, res as any));
app.all('/api/admin', (req, res) => adminHandler(req as any, res as any));
app.all('/api/account', (req, res) => accountHandler(req as any, res as any));

// Vite Middleware & SPA Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Reino Portal Server] Running on port ${PORT} (0.0.0.0)`);
  });
}

startServer();
