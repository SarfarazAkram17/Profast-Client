import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import SslPayment from "./SslPayment";

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const Payment = () => {
  return (
    <div className="max-w-md mx-auto">
      {/* stripe */}
      <Elements stripe={stripePromise}>
        <PaymentForm></PaymentForm>
      </Elements>
      {/* sslcommerz */}

      <SslPayment></SslPayment>
    </div>
  );
};

export default Payment;
