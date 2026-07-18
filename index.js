const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');

// 1. Tạo Web Server cho Render
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot đang chạy ổn định!'));
app.listen(port, () => console.log(`Web server đang chạy trên port ${port}`));

// 2. Cấu hình Bot Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 3. Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// 4. Sự kiện khi bot online
client.on('ready', () => {
  console.log(`Bot đã online với tên: ${client.user.tag}!`);
});

// 5. Sự kiện khi có tin nhắn mới
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!ai ')) {
    const prompt = message.content.replace('!ai ', '');
    
    try {
      await message.channel.sendTyping();
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text.length > 2000) {
         await message.reply(text.substring(0, 1997) + "...");
      } else {
         await message.reply(text);
      }
    } catch (error) {
      console.error("Lỗi AI:", error);
      await message.reply("Xin lỗi, tôi đang gặp lỗi kết nối với AI. Hãy kiểm tra lại API Key trên Render!");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
