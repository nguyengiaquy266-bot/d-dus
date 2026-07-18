    const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

// Mở cổng cho Render (không được xóa)
http.createServer((req, res) => {
  res.write("Bot is running!");
  res.end();
}).listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    console.log('Bot đã đăng nhập thành công!');

    // Tự động vào kênh Voice khi khởi động
    // NHỚ THAY 'ID_KENH_VOICE_CUA_BAN' BẰNG ID THẬT CỦA KÊNH VOICE
    const channel = client.channels.cache.get('1526997801718779954');
    if (channel) {
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        console.log('Đã tự động vào kênh Voice!');
    }
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    // Lệnh !thằng đú
    if (message.content === '!con bot') {
        message.reply('tao nghe!');
    }

    // Lệnh !join
    if (message.content === '!join') {
        if (message.member.voice.channel) {
            joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
            message.reply('Đã kết nối vào kênh Voice!');
        } else {
            message.reply('Bạn cần vào một kênh Voice trước đã!');
        }
    }
});

client.login(process.env.TOKEN);  
