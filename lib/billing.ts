import Stripe from "stripe";
import { PLANS, type Plan } from "./mock-data";

// Env-gated: real Stripe when STRIPE_SECRET_KEY is set, mock upgrade otherwise.
export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);
export const stripe = stripeEnabled ? new Stripe(process.env.STRIPE_SECRET_KEY!) : null;

const PRICE_ENV: Record<string, string> = {
  starter: "STRIPE_PRICE_STARTER",
  growth: "STRIPE_PRICE_GROWTH",
  pro: "STRIPE_PRICE_PRO",
};

export function priceIdFor(planId: string): string {
  return process.env[PRICE_ENV[planId]] || "";
}

export function planById(planId: string): Plan | undefined {
  return PLANS.find((p) => p.id === planId);
}
