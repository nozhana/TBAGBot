import { Bot, session } from "grammy";
import MyContext, { prismaMiddleware } from "./app/core/context";
import i18n from "./app/core/i18n";
import { FileAdapter } from "@grammyjs/storage-file";
import { hydrateReply, parseMode } from "@grammyjs/parse-mode";
import allGamesHandler from "./app/game/all-games-handler";
import { hydrateFiles } from "@grammyjs/files";
import { conversations, createConversation } from "@grammyjs/conversations";
import importGameConversation from "./app/game/import-game-conversation";
import allGamesMenu from "./app/game/all-games-menu";

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

// MIDDLEWARES

bot.use(
  session({
    initial: () => ({}),
    storage: new FileAdapter({ dirName: "sessions" }),
  })
);

bot.use(conversations());

bot.use(createConversation(importGameConversation));

bot.use(prismaMiddleware);

bot.use(i18n);

bot.use(hydrateReply);

bot.api.config.use(parseMode("HTML"));

bot.api.config.use(hydrateFiles(bot.token));

// ROUTING

bot.use(allGamesMenu);

bot.command(["start", "games"], allGamesHandler);

// ERROR HANDLING

bot.catch((err) => console.log(`❌ ERROR:\n${err}`));

// RUN

bot.start({
  drop_pending_updates: true,
  limit: 25,
  onStart(botInfo) {
    console.log(
      `✅ STARTED BOT:\n${botInfo.id}\n${botInfo.username}\n${botInfo.first_name}`
    );
  },
});
