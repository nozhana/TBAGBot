import { Menu } from "@grammyjs/menu";
import MyContext from "../core/context";
import answerCallbackComingSoon from "../util/cb-coming-soon";
import { InlineKeyboard } from "grammy";

const allGamesMenu = new Menu<MyContext>("all-games-menu", {
  autoAnswer: false,
})
  .dynamic(async (ctx, range) => {
    const { prisma } = ctx;
    const games = await prisma.game.findMany({
      skip: ((Number(ctx.match) || 1) - 1) * 10,
      take: 10,
      where: { authorId: ctx.from!.id },
    });

    for (const game of games) {
      range
        .text({ text: game.title, payload: game.id }, answerCallbackComingSoon)
        .row();
    }
  })
  .text(
    {
      text: (ctx) =>
        "⬅️ " + ctx.t("btn-page", { page: String(Number(ctx.match || 1) - 1) }),
      payload: (ctx) => String((Number(ctx.match) || 1) - 1),
    },
    async (ctx) => {
      if (Number(ctx.match || 1) < 1)
        return ctx.answerCallbackQuery({
          text: ctx.t("cb-no-pages"),
          show_alert: true,
        });
      await ctx.answerCallbackQuery(
        ctx.t("game_cb-all-page", { page: ctx.match })
      );
      ctx.menu.update();
    }
  )
  .text(
    {
      text: (ctx) =>
        ctx.t("btn-page", { page: String(Number(ctx.match || 1) + 1) }) + " ➡️",
      payload: (ctx) => String((Number(ctx.match) || 1) + 1),
    },
    async (ctx) => {
      const { prisma } = ctx;
      const gameCount = await prisma.game.count({
        where: { authorId: ctx.from.id },
      });
      const pages = Math.ceil(gameCount / 10);

      if (Number(ctx.match || 1) >= pages)
        return ctx.answerCallbackQuery({
          text: ctx.t("cb-no-pages"),
          show_alert: true,
        });
      await ctx.answerCallbackQuery(
        ctx.t("game_cb-all-page", { page: ctx.match })
      );
      ctx.menu.update();
    }
  )
  .row()
  .text((ctx) => ctx.t("game_btn-import"), answerCallbackComingSoon);

export default allGamesMenu;
