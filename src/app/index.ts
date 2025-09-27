import { appendFileSync } from "fs";

function log(message: string) {
  const timestamp = new Date().toISOString();
  appendFileSync("bot.log", `[${timestamp}] ${message}\n`);
}

// BOT 起動時にログ
log("BOT プロセス起動");

// bot/index.ts
import { Client, GatewayIntentBits } from "discord.js";

// 環境変数から BOT TOKEN を取得
const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
  throw new Error("環境変数 DISCORD_BOT_TOKEN が設定されていません");
}

// Client の初期化
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,            // サーバーの情報
    GatewayIntentBits.GuildMessages,     // メッセージ
    GatewayIntentBits.MessageContent     // メッセージ本文
  ]
});

// BOT が起動したとき
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user?.tag}!`);
});

// メッセージを受け取ったとき
client.on("messageCreate", (message) => {
  console.log(`💬 [${message.channelId}] ${message.author.tag}: ${message.content}`);
});

// Discord にログイン
client.login(token);
