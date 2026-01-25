import type { Request, Response } from "express";
import { bot } from "../src/bot";

export default async function handler(req: Request, res: Response) {
  await bot.handleUpdate(req.body);
  res.status(200).send("ok");
}
