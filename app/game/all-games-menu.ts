import { Menu } from "@grammyjs/menu";
import MyContext from "../core/context";
import gameMenu from "./game-menu";

const allGamesMenu = new Menu<MyContext>("all-games-menu")
  .dynamic(async (ctx, range) => {
    const { prisma } = ctx;
    const page = Number(ctx.match || 1);
    const games = await prisma.game.findMany({
      skip: (page - 1) * 5,
      take: 5,
      where: { authorId: ctx.from!.id },
    });

    for (const game of games) {
      range
        .submenu({ text: game.title, payload: game.id }, "game-menu", (ctx) =>
          ctx.editMessageText(ctx.t("game_html-main"))
        )
        .row();
    }

    const gameCount = await prisma.game.count({
      where: { authorId: ctx.from!.id },
    });
    const pages = Math.ceil(gameCount / 5);

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
  .text(
    (ctx) => ctx.t("game_btn-import"),
    async (ctx) => {
      ctx.menu.close();
      await ctx.conversation.enter("import-game");
    }
  );

allGamesMenu.register(gameMenu);

export default allGamesMenu;
