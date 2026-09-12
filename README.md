# 🚀 WhatsApp Production Bot Starter Kit

ชุดติดตั้งและรันบอท WhatsApp Node.js สำหรับขึ้นเซิร์ฟเวอร์จริง (Pterodactyl, FalixNodes, OptikServers, Render, VPS หรือรันบนคอมพิวเตอร์ของคุณ)

## 📌 สารบัญไฟล์
- `index.js`: สคริปต์หลักบอท Baileys พร้อมระบบ Reconnect และ Express API
- `package.json`: แพ็กเกจที่จำเป็น (`@whiskeysockets/baileys`, `express`, `pino`)
- `.env`: คีย์ความปลอดภัยและพอร์ตการทำงาน
- `Dockerfile`: คอนเทนเนอร์สำหรับรันบน Docker / VPS
- `egg-pterodactyl.json`: สำหรับนำเข้าเป็น Egg บน Pterodactyl Panel

---

## 🛠️ วิธีการรันบนคอมพิวเตอร์ (Windows / Mac / Linux)
1. ติดตั้ง Node.js v20 ขึ้นไปจาก https://nodejs.org
2. แตกไฟล์ ZIP นี้ไว้ในโฟลเดอร์
3. เปิด Terminal หรือ CMD ในโฟลเดอร์นั้น แล้วรัน:
   ```bash
   npm install
   npm start
   ```
4. สแกน QR Code ที่ขึ้นใน Terminal ด้วยแอป WhatsApp บนโทรศัพท์ของคุณ
5. บอทจะพร้อมทำงานทันที! พิมพ์คำสั่ง `.ping` ในแชทเพื่อทดสอบ

---

## ☁️ วิธีการรันบน Pterodactyl Panel (FalixNodes, OptikServers หรือ VPS)
1. ไปที่เมนู **Files** บน Panel
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้นไป
3. ไปที่เมนู **Startup** ตรวจสอบคำสั่งเริ่มทำงาน:
   - Startup Command: `node index.js`
4. กดปุ่ม **Start Server** ที่หน้า Console
5. สแกน QR Code ผ่านหน้าจอดำ Console ของ Pterodactyl

---

## 📡 การส่งข้อความแจ้งเตือนผ่าน REST API
คุณสามารถยิง HTTP POST มาที่พอร์ต 10000 เพื่อสั่งให้บอทส่งข้อความ:
- **Endpoint:** `http://YOUR_SERVER_IP:10000/api/send-message`
- **Headers:** `Authorization: Bearer SEC_AUTH_KEY_99X`
- **Body (JSON):**
  ```json
  {
    "target": "66941876682@s.whatsapp.net",
    "message": "แจ้งเตือนจากระบบเซิร์ฟเวอร์"
  }
  ```
