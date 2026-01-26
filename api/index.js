import { webhookCallback } from "grammy";
import { bot } from "./_lib/bot";

export default webhookCallback(bot, "http");
