import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Components/Loading/Loading";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useParams } from "react-router";

const SslPayment = () => {
  const axiosSecure = useAxiosSecure();
  const { parcelId } = useParams();
  const { user, uid, userEmail } = useAuth();

  const { data: parcelInfo, isPending } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}?uid=${uid}`);
      return res.data;
    },
  });
  if (isPending) {
    return <Loading></Loading>;
  }

  const handlePay = async (e) => {
    e.preventDefault();

    const paymentData = {
      parcelId,
      name: user.displayName,
      email: userEmail,
      amount: parseInt(parcelInfo.cost),
      transactionId: "",
      paymentMethod: "SSLCommerz",
      status: "pending",
    };
    const res = await axiosSecure.post(
      `/create-ssl-payment?uid=${uid}`,
      paymentData
    );

    if (res?.data?.gatewayUrl) {
      window.location.replace(res.data.gatewayUrl);
    }
  };
  return (
    <div className="mt-16">
      <h3 className="text-lg font-bold text-green-600">
        Total Payment: ৳{parcelInfo.cost}
      </h3>
      <form onSubmit={handlePay}>
        <label className="label font-semibold mt-4">Email</label>
        <input
          type="email"
          name="email"
          defaultValue={userEmail}
          readOnly
          className="input placeholder:text-[13px] placeholder:font-bold w-full"
          placeholder="Enter your email"
        />
        <button
          type="submit"
          className="btn btn-primary text-black w-full mt-8"
        >
          Pay ৳{parcelInfo.cost}
        </button>
      </form>
    </div>
  );
};

export default SslPayment;
