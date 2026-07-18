const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');

// 1. Tạo Web Server ảo để Render không tắt bot
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot Discord AI đang chạy!'));
app.listen(port, () => console.log(`Web server đang chạy trên port ${port}`));

// 2. Khởi tạo Bot Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 3. Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 4. Sự kiện bot online
client.on('ready', () => {
  console.log(`Bot đã online với tên: ${client.user.tag}!`);
});

// 5. Sự kiện bot đọc tin nhắn
client.on('messageCreate', async (message) => {
  // Bỏ qua tin nhắn của bot khác
  if (message.author.bot) return;

  // Nếu tin nhắn bắt đầu bằng "!ai " (ví dụ: !ai thời tiết hôm nay)
  if (message.content.startsWith('!ai ')) {
    const prompt = message.content.replace('!ai ', '');
    
    try {
      // Gửi biểu tượng đang gõ chữ cho user biết bot đang xử lý
      await message.channel.sendTyping();
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Discord giới hạn 2000 ký tự mỗi tin nhắn
      if (text.length > 2000) {
         await message.reply(text.substring(0, 1997) + "...");
      } else {
         await message.reply(text);
      }
    } catch (error) {
      console.error(error);
      await message.reply("Xin lỗi, tôi đang gặp lỗi khi kết nối với AI.");
    }
  }
});

// 6. Đăng nhập bot bằng Token
client.login(process.env.DISCORD_TOKEN);
