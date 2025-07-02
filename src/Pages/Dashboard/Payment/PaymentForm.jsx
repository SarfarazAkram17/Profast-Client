import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import loader from "../../../assets/animations/loading.json";
import Lottie from "lottie-react";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import useTrackingLogger from "../../../Hooks/useTrackingLogger";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { logTracking } = useTrackingLogger();
  const { user, userEmail, uid } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { data: parcelInfo, isPending } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}?uid=${uid}`);
      return res.data;
    },
  });

  if (isPending) {
    return (
      <Lottie
        className="h-[40vh] place-items-center"
        loop={true}
        animationData={loader}
      ></Lottie>
    );
  }

  const amount = parcelInfo.cost;
  const amountInCents = amount * 100;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      setLoading(false);
      return;
    }

    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setError("");
      setLoading(false);

      const res = await axiosSecure.post(`/create-payment-intent?uid=${uid}`, {
        amountInCents,
        parcelId,
      });
      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: userEmail,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
      } else {
        setError("");
        if (result.paymentIntent.status === "succeeded") {
          const transactionId = result.paymentIntent.id;
          const paymentData = {
            parcelId,
            email: userEmail,
            amount,
            transactionId: result.paymentIntent.id,
            paymentMethod: result.paymentIntent.payment_method_types,
          };

          const paymentRes = await axiosSecure.post(
            `/payments?uid=${uid}`,
            paymentData
          );
          if (paymentRes.data.insertedId) {
            await Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
              confirmButtonText: "Go to My Parcels",
            });
            setLoading(false);

            await logTracking({
              tracking_id: parcelInfo.tracking_id,
              status: "payment_done",
              details: `Paid by ${user.displayName}`,
              updated_by: userEmail,
            });

            navigate("/dashboard/myParcels");
          }
        }
      }
    }
  };
  return (
    <div>
      <form
        onSubmit={handlePay}
        className="rounded-xl space-y-4 bg-white p-6 shadow-md w-full max-w-md mx-auto"
      >
        <CardElement className="p-2 border rounded"></CardElement>
        <button
          type="submit"
          className="btn btn-primary text-black w-full mt-6"
          disabled={!stripe || loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            `Pay ৳${amount}`
          )}
        </button>
        {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
