import Stripe from "stripe";

let _stripe: Stripe | null = null;

// Lazily instantiated so the build never crashes when STRIPE_SECRET_KEY isn't
// configured yet (e.g. before the Stripe Identity feature is set up). The
// error only surfaces when someone actually triggers a Stripe-backed action.
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY n'est pas configurée.");
    }
    _stripe = new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
  }
  return _stripe;
}
