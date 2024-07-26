import { Menu } from "@grammyjs/menu";
import MyContext from "../core/context";
import answerCallbackComingSoon from "../util/cb-coming-soon";

const gameMenu = new Menu<MyContext>("game-menu")
  .text((ctx) => ctx.t("game_btn-play"), answerCallbackComingSoon)
  .row()
  .text((ctx) => ctx.t("game_btn-edit"), answerCallbackComingSoon)
  .text((ctx) => ctx.t("game_btn-share"), answerCallbackComingSoon)
  .row()
  .back(
    (ctx) => ctx.t("btn-back"),
    (ctx) => ctx.editMessageText(ctx.t("game_html-all"))
  );

export default gameMenu;
