import { I18n } from "@grammyjs/i18n";
import MyContext from "./context";

const i18n = new I18n<MyContext>({
  defaultLocale: "en",
  directory: "locales",
  useSession: true,
  globalTranslationContext: (ctx) => {
    return {
      userId: ctx.from?.id || 0,
      firstName: ctx.from?.first_name || "",
    };
  },
});

export default i18n;
