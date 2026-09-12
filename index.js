// ========================================================
// Production WhatsApp Baileys & Express Server
// Bot Name: SC-Fire-Baileys-Bot
// ========================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pino = require('pino');
const { 
  makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason, 
  fetchLatestBaileysVersion 
} = require('@whiskeysockets/baileys');

const app = express();
const PORT = process.env.PORT || 10000;
const SECRET_KEY = process.env.SECRET_KEY || "SEC_AUTH_KEY_99X";

app.use(cors());
app.use(express.json());

let waSock = null;
let connectionStatus = 'DISCONNECTED';
let pairingCode = null;

async function startWhatsAppBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`[WHATSAPP] Using Baileys version ${version.join('.')} (Latest: ${isLatest})`);

  waSock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: 'silent' }),
    browser: ['Ubuntu', 'Chrome', '20.0.04']
  });

  waSock.ev.on('creds.update', saveCreds);

  waSock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (connection === 'open') {
      connectionStatus = 'CONNECTED';
      console.log('✅ [WHATSAPP] Successfully connected to WhatsApp!');
    } else if (connection === 'connecting') {
      connectionStatus = 'CONNECTING';
      console.log('🔄 [WHATSAPP] Connecting to servers...');
    } else if (connection === 'close') {
      connectionStatus = 'DISCONNECTED';
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(`⚠️ [WHATSAPP] Connection closed (Code: ${statusCode}). Reconnecting: ${shouldReconnect}`);
      if (shouldReconnect) {
        setTimeout(startWhatsAppBot, 3000);
      }
    }
  });

  // Handle incoming messages & commands
  waSock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

    console.log(`📩 [INCOMING] From ${from}: ${text}`);

    // Basic Command Router
    if (text === '.ping') {
      await waSock.sendMessage(from, { text: '🏓 Pong! Server is active and operational.' }, { quoted: msg });
    } else if (text === '.status') {
      await waSock.sendMessage(from, { 
        text: `🟢 *BOT STATUS*\n• Name: SC-Fire-Baileys-Bot\n• Server Port: ${PORT}\n• Uptime: ${process.uptime().toFixed(1)}s` 
      }, { quoted: msg });
    }
  });
}

// REST API: Server Health
app.get('/api/status', (req, res) => {
  res.json({
    status: "ONLINE",
    botName: "SC-Fire-Baileys-Bot",
    connection: connectionStatus,
    hasUser: !!waSock?.user,
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// REST API: Send Legitimate Notification
app.post('/api/send-message', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader ? authHeader.replace('Bearer ', '') : req.body.secretKey;

  if (token !== SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid Secret Key" });
  }

  const { target, message } = req.body;
  if (!target || !message) {
    return res.status(400).json({ error: "Missing required fields: target and message" });
  }

  const targetJid = target.includes('@') ? target : `${target.replace(/\D/g, '')}@s.whatsapp.net`;

  try {
    if (!waSock) {
      return res.status(503).json({ error: "WhatsApp socket is not initialized" });
    }
    const result = await waSock.sendMessage(targetJid, { text: message });
    res.json({ success: true, target: targetJid, messageId: result?.key?.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [SERVER] REST API listening on port ${PORT}`);
  startWhatsAppBot();
});
