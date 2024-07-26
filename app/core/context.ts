import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { FileFlavor } from "@grammyjs/files";
import { I18nFlavor } from "@grammyjs/i18n";
import { ParseModeFlavor } from "@grammyjs/parse-mode";
import { PrismaClient } from "@prisma/client";
import { Context, NextFunction, SessionFlavor } from "grammy";

interface SessionData {}

interface MyContextFlavor {
  prisma: PrismaClient;
}

export const prismaMiddleware = (ctx: MyContextFlavor, next: NextFunction) => {
  ctx.prisma ??= new PrismaClient();
  return next();
};

type MyContext = FileFlavor<ParseModeFlavor<Context>> &
  I18nFlavor &
  SessionFlavor<SessionData> &
  ConversationFlavor &
  MyContextFlavor;

export type MyConversation = Conversation<MyContext>;

export default MyContext;
