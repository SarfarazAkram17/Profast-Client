import React from "react";
import useAuth from "../../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Components/Loading/Loading";

const PaymentHistory = () => {
  const { userEmail, uid } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${userEmail}&uid=${uid}`);
      return res.data;
    },
  });

  if (isPending) {
    return (
      <Loading></Loading>
    );
  }

  const formatDate = (iso) => {
    return new Date(iso).toLocaleString();
  };

  return (
    <div className="px-4">
      {payments.length === 0 ? (
        <div className="text-center">
          <h1 className="text-3xl text-gray-600 font-extrabold">
            No Payments yet.
          </h1>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl text-gray-600 font-extrabold mb-6 text-center">
            Your completed payments
          </h1>
          <div className="overflow-x-auto rounded-box border-2 border-base-content/5 bg-base-200">
            <table className="table text-center">
              {/* head */}
              <thead>
                <tr>
                  <th>#</th>
                  <th>Parcel ID</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Transaction</th>
                  <th>Paid At</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={payment._id}>
                    <td>{index + 1}</td>
                    <td
                      className="truncate max-w-[150px] overflow-hidden whitespace-nowrap"
                      title={payment.parcelId}
                    >
                      {payment.parcelId}
                    </td>
                    <td>৳{payment.amount}</td>
                    <td className="capitalize">{payment.paymentMethod}</td>
                    <td
                      className="truncate max-w-[150px] overflow-hidden whitespace-nowrap"
                      title={payment.transactionId}
                    >
                      {payment.transactionId}
                    </td>
                    <td>{formatDate(payment.paid_at_string)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
