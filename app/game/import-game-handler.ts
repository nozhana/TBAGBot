import MyContext, { MyConversation } from "../core/context";
import importGameData from "../util/import-game-data";
import allGamesMenu from "./all-games-menu";

async function importGameConversation(
  conversation: MyConversation,
  ctx: MyContext
) {
  const { prisma } = ctx;
  const { message } = await conversation.waitFor(":document", {
    otherwise: (ctx) => ctx.reply("Please send a document!"),
  });
  if (!message) return;
  await ctx.reply("📁 Document uploaded.");
  const file = await ctx.api.getFile(message.document.file_id);
  const path = await file.download();
  await importGameData(prisma, ctx.from!.id, path);

  await ctx.reply("🕹️ Game data imported.", { reply_markup: allGamesMenu });
}

export default importGameConversation;
