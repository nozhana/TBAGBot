import { InlineKeyboard } from "grammy";
import MyContext, { MyConversation } from "../core/context";
import importGameData from "../util/import-game-data";
import { readFile } from "fs/promises";

async function importGameConversation(
  conversation: MyConversation,
  ctx: MyContext
) {
  const { prisma } = ctx;
  await ctx.reply("Please send a JSON text or file to import as a game.");
  const { message } = await conversation.waitFor([":document", ":text"], {
    otherwise: (ctx) => ctx.reply("Please send a document or text!"),
  });
  if (!message) return;
  try {
    if (message.document) {
      await ctx.reply("📁 Document uploaded.");
      const file = await ctx.api.getFile(message.document.file_id);
      const path = await file.download();
      const buffer = await readFile(path, "utf8");
      await importGameData(prisma, message.from.id, path);
    } else if (message.text) {
      await importGameData(prisma, message.from.id, message.text);
    }

    await ctx.reply("🕹️ Game data imported.");
  } catch (error) {
    await ctx.reply(`❌ <b>ERROR - IMPORT GAME:</b>\n${error}`);
    console.log(`❌ <b>ERROR - IMPORT GAME:</b>\n${error}`);
  }
}

export default importGameConversation;
