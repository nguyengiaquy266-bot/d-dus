const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const http = require('http');

// 1. Khởi tạo Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 2. Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

client.on('ready', () => {
  console.log(`Bot đã online: ${client.user.tag}`);
});

// 3. Logic trả lời tin nhắn
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith('!ai ')) {
    const prompt = message.content.replace('!ai ', '');
    try {
      await message.channel.sendTyping();
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      await message.reply(text.length > 2000 ? text.substring(0, 2000) : text);
    } catch (error) {
      console.error("LỖI AI:", error);
      await message.reply("Lỗi kết nối AI. Kiểm tra Logs trên Render!");
    }
  }
});

// 4. Mở cổng ảo để Render không báo lỗi "No open ports"
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running');
}).listen(process.env.PORT || 3000);

// 5. Đăng nhập
client.login(process.env.DISCORD_TOKEN);
