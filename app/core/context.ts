import { I18nFlavor } from "@grammyjs/i18n";
import { ParseModeFlavor } from "@grammyjs/parse-mode";
import { Context, SessionFlavor } from "grammy";

interface SessionData {}

type MyContext = ParseModeFlavor<Context> &
  I18nFlavor &
  SessionFlavor<SessionData>;

export default MyContext;
