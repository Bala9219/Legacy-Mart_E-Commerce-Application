import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPaymentIntent, markPaymentSuccess } from "../services/paymentService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const cardStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      "::placeholder": { color: "#a0aec0" }
    },
    invalid: { color: "#e53e3e" }
  }
};

function CheckoutForm({ orderId, amount }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if(!stripe || !elements) return;

    try {
      setLoading(true);
      setError("");

      const { clientSecret, paymentIntentId } =
        await createPaymentIntent(orderId);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {}
        }
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
        setLoading(false);
        return;
      }

      const paymentIntent = result.paymentIntent;

      if (paymentIntent.status === "requires_action") {
        setError("Authentication required — please complete verification.");
        setLoading(false);
        return;
      }

      if (paymentIntent.status !== "succeeded") {
        setError("Payment was not completed. Try another card.");
        setLoading(false);
        return;
      }


      await markPaymentSuccess(paymentIntentId);

      alert("Payment Successful 🎉");
      window.location.href = `/orders/${orderId}`;
    } catch (err) {
      setError("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-box">
      <h3 className="checkout-title">Complete Payment</h3>

      <p className="amount-label">
        Amount Payable
        <span>₹ {amount.toFixed(2)}</span>
      </p>

      <label className="field-label">Card Details</label>

      <div className="card-input-box">
        <CardElement options={cardStyle} />
      </div>

      {error && <p className="error-text">{error}</p>}

      <button
        className="pay-btn"
        onClick={handlePayment}
        disabled={loading || !stripe}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

export default function CheckoutPayment({ orderId, amount }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm orderId={orderId} amount={amount} />
    </Elements>
  );
}
