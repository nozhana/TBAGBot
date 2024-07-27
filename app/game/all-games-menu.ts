import { Menu } from "@grammyjs/menu";
import MyContext from "../core/context";
import answerCallbackComingSoon from "../util/cb-coming-soon";

const allGamesMenu = new Menu<MyContext>("all-games-menu")
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
      if (Number(ctx.match || 1) < 1) return;
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

      if (Number(ctx.match || 1) >= pages) return;
      ctx.menu.update();
    }
  )
  .row()
  .text((ctx) => ctx.t("game_btn-import"), answerCallbackComingSoon);

export default allGamesMenu;
