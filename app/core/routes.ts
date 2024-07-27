import { Router } from "@grammyjs/router";
import MyContext from "./context";
import { Middleware } from "grammy";

export type RouterKey =
  | "idle"
  | "allGames"
  | "gameDetails"
  | "gamePlay"
  | "importGame";

export const router = new Router<MyContext>((ctx) => ctx.session.routerKey);

export const route = (k: RouterKey, ...middleware: Middleware<MyContext>[]) =>
  router.route(k, ...middleware);
