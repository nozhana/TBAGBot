import MyContext from "../core/context";

const answerCallbackComingSoon = async (ctx: MyContext) => {
  await ctx.answerCallbackQuery({
    text: ctx.t("cb-coming-soon"),
    show_alert: true,
    cache_time: 60 * 60,
  });
};

export default answerCallbackComingSoon;
