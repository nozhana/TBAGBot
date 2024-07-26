import MyContext from "../core/context";
import allGamesMenu from "./all-games-menu";

async function allGamesHandler(ctx: MyContext) {
  return ctx.reply(ctx.t("game_html-all"), { reply_markup: allGamesMenu });
}

export default allGamesHandler;
