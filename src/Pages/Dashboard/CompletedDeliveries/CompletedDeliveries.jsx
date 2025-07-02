import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import loader from "../../../assets/animations/loading.json";
import { useState } from "react";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { userEmail, uid } = useAuth();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completedDeliveries", userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rider/completed-parcels?email=${userEmail}&uid=${uid}`
      );
      return res.data;
    },
  });

  const calculateEarning = (parcel) => {
    if (parcel.senderDistrict === parcel.recieverDistrict) {
      return 30;
    } else {
      return 20;
    }
  };

  const [loadingParcelId, setLoadingParcelId] = useState(null);

  const { mutateAsync: cashout } = useMutation({
    mutationFn: async (parcelId) => {
      const res = await axiosSecure.patch(
        `/parcels/${parcelId}/cashout?email=${userEmail}&uid=${uid}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["completedDeliveries"]).then(() => {
        Swal.fire("Success", "Cashout completed.", "success");
      });
      setLoadingParcelId(null);
    },
    onError: (error) => {
      Swal.fire(error.message, "Failed to cash out. Try again.", "error");
      setLoadingParcelId(null);
    },
  });

  const handleCashout = (parcelId) => {
    Swal.fire({
      title: "Confirm Cashout",
      text: "You are about to cash out this delivery.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cash Out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoadingParcelId(parcelId);
        cashout(parcelId);
      }
    });
  };

  return (
    <div className="p-6">
      {isLoading ? (
        <Lottie
          className="h-[40vh] place-items-center"
          loop={true}
          animationData={loader}
        ></Lottie>
      ) : parcels.length === 0 ? (
        <h1 className="text-3xl text-gray-600 font-extrabold mb-6 text-center">
          No deliveries yet.
        </h1>
      ) : (
        <>
          <h1 className="text-3xl text-gray-600 font-extrabold mb-6 text-center">
            Completed Deliveries
          </h1>
          <div className="overflow-x-auto rounded-box border-2 border-base-content/5 bg-base-200">
            <table className="table table-sm text-center">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Title</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Picked At</th>
                  <th>Delivered At</th>
                  <th>Your Earning (৳)</th>
                  <th>Cashout</th>
                </tr>
              </thead>
              <tbody>
                {parcels.map((parcel) => (
                  <tr key={parcel._id}>
                    <td>{parcel.tracking_id}</td>
                    <td>{parcel.title}</td>
                    <td>
                      {parcel.senderDistrict} - {parcel.senderWirehouse}
                    </td>
                    <td>
                      {parcel.recieverDistrict} - {parcel.recieverWirehouse}
                    </td>
                    <td
                      className="truncate max-w-[80px]"
                      title={new Date(parcel.picked_at).toLocaleString()}
                    >
                      {new Date(parcel.picked_at).toLocaleString()}
                    </td>
                    <td
                      className="truncate max-w-[80px]"
                      title={new Date(parcel.delivered_at).toLocaleString()}
                    >
                      {new Date(parcel.delivered_at).toLocaleString()}
                    </td>
                    <td className="font-semibold text-sm text-green-600">
                      ৳{calculateEarning(parcel)}
                    </td>
                    <td>
                      {parcel.cashout_status === "cashed_out" ? (
                        <span className="badge badge-success rounded-full h-auto badge-xs font-bold whitespace-nowrap">
                          Cashed Out
                        </span>
                      ) : (
                        <button
                          className="btn btn-xs btn-warning"
                          onClick={() => handleCashout(parcel._id)}
                          disabled={loadingParcelId === parcel._id}
                        >
                          {loadingParcelId === parcel._id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            "Cashout"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CompletedDeliveries;
