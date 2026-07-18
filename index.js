const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Khởi tạo Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Khởi tạo Gemini AI (Dùng API Key từ Render)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
client.on('ready', () => {
  console.log(`Bot đã online: ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!ai ')) {
    const prompt = message.content.replace('!ai ', '');
    
    try {
      await message.channel.sendTyping();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Chia nhỏ tin nhắn nếu dài quá 2000 ký tự
      if (text.length > 2000) {
        await message.reply(text.substring(0, 2000));
      } else {
        await message.reply(text);
      }
    } catch (error) {
      console.error("LỖI CHI TIẾT:", error);
      await message.reply("Tôi đang gặp lỗi kết nối với Gemini API. Hãy kiểm tra Logs trên Render!");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
