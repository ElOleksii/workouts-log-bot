import { webhookCallback } from "grammy";
import { bot } from "./_lib/bot.js";

export default webhookCallback(bot, "http");
