import { NextResponse } from "next/server";
import { z } from "zod";

import {
  callAutomation,
  detectIntent,
  generalAutomation,
  gmailAutomation,
  paymentAutomation,
  salesAutomation,
  supportAutomation
} from "@/lib/ai";

export const dynamic = "force-dynamic";

const payloadSchema = z.object({
  message: z.string().min(1, "Message is required."),
  channel: z.enum(["chat", "email", "call"]).default("chat"),
  customerName: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = payloadSchema.parse(json);

    const intent = await detectIntent(payload.message);
    let reply: string;

    switch (intent) {
      case "BUY":
        reply = await salesAutomation(payload.message);
        break;
      case "SELL":
        reply = await salesAutomation("Handle seller inquiry");
        break;
      case "SUPPORT":
        reply = await supportAutomation(payload.message);
        break;
      case "PAYMENT":
        reply = paymentAutomation();
        break;
      case "CALL":
        reply = callAutomation(payload.customerName ?? "Customer");
        break;
      default:
        if (payload.channel === "email") {
          reply = await gmailAutomation(payload.message);
        } else {
          reply = await generalAutomation(payload.message);
        }
    }

    return NextResponse.json({
      intent,
      reply,
      time: new Date().toISOString()
    });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof z.ZodError
        ? "Invalid payload. Please check your request body."
        : "Unable to generate response. Verify your OpenAI credentials.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
