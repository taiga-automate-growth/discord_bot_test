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
client.on("messageCreate", async (message) => {
  const gasUrl = process.env.GAS_URL || "";
  // 添付ファイルを扱いやすい形に変換
  const attachments = Array.from(message.attachments.values()).map(att => ({
    id: att.id,
    url: att.url,
    proxyURL: att.proxyURL,
    contentType: att.contentType,
    name: att.name,
    size: att.size,
    width: att.width,
    height: att.height,
  }));

  // 転送用のシリアライズ可能なオブジェクト
  const payload = {
    id: message.id,
    channelId: message.channelId,
    guildId: message.guildId,
    authorId: message.author.id,
    authorTag: message.author.tag,
    content: message.content,
    createdTimestamp: message.createdTimestamp,
    attachments, // ←これでGAS側にURL付きで届く
  };

  await fetch(gasUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
});

// Discord にログイン
client.login(token);
