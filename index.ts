import { Bot, session } from "grammy";
import MyContext from "./app/core/context";
import i18n from "./app/core/i18n";
import { FileAdapter } from "@grammyjs/storage-file";
import { hydrateReply, parseMode } from "@grammyjs/parse-mode";

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

// MIDDLEWARES

bot.use(session({ storage: new FileAdapter({ dirName: "sessions" }) }));

bot.use(i18n);

bot.use(hydrateReply);

bot.api.config.use(parseMode("HTML"));

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
