import { Menu } from "@grammyjs/menu";
import MyContext from "../core/context";
import answerCallbackComingSoon from "../util/cb-coming-soon";

const allGamesMenu = new Menu<MyContext>("all-games-menu")
  .dynamic(async (ctx, range) => {
    const { prisma } = ctx;
    const page = Number(ctx.match || 1);
    const games = await prisma.game.findMany({
      skip: (page - 1) * 10,
      take: 10,
      where: { authorId: ctx.from!.id },
    });

    for (const game of games) {
      range
        .text({ text: game.title, payload: game.id }, answerCallbackComingSoon)
        .row();
    }

    const gameCount = await prisma.game.count({
      where: { authorId: ctx.from!.id },
    });
    const pages = Math.ceil(gameCount / 10);

    if (page > 1)
      range.text({
        text: ctx.t("btn-page", { page: page - 1 }),
        payload: String(page - 1),
      });
    if (page < pages)
      range.text({
        text: ctx.t("btn-page", { page: page + 1 }),
        payload: String(page + 1),
      });
    range.row();
  })
  .text((ctx) => ctx.t("game_btn-import"), answerCallbackComingSoon);

export default allGamesMenu;
