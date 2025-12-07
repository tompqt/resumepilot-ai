import { config } from "./config";

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    credits: 3,
    priceId: null,
  },
  pro: {
    name: "Pro",
    price: 9.50,
    credits: 50,
    priceId: config.stripe.proPriceId,
  },
  enterprise: {
    name: "Enterprise",
    price: 49,
    credits: 999999,
    priceId: config.stripe.enterprisePriceId,
  },
};
