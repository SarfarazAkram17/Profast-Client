import { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import useTrackingLogger from "../../../Hooks/useTrackingLogger";
import Loading from "../../../Components/Loading/Loading";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { logTracking } = useTrackingLogger();
  const { user, userEmail, uid } = useAuth();

  const [activeParcelId, setActiveParcelId] = useState(null);

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["riderParcels", userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rider/parcels?email=${userEmail}&uid=${uid}`
      );
      return res.data;
    },
  });

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: async ({ parcel, status }) => {
      const res = await axiosSecure.patch(
        `/parcels/${parcel._id}/status?email=${userEmail}&uid=${uid}`,
        {
          status,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["riderParcels"]);
    },
  });

  const handleStatusUpdate = (parcel, newStatus) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Mark parcel as ${newStatus.replace("_", " ")}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
    }).then((result) => {
      if (result.isConfirmed) {
        setActiveParcelId(parcel._id);
        updateStatus({ parcel, status: newStatus })
          .then(async () => {
            Swal.fire("Updated!", "Parcel status updated.", "success");

            // log tracking
            let trackDetails = `Picked up by ${user.displayName}`;
            if (newStatus === "delivered") {
              trackDetails = `Delivered by ${user.displayName}`;
            }

            await logTracking({
              tracking_id: parcel.tracking_id,
              status: newStatus,
              details: trackDetails,
              updated_by: userEmail,
            });
          })
          .catch((error) => {
            Swal.fire(error.message, "Failed to update status.", "error");
          })
          .finally(() => {
            setActiveParcelId(null);
          });
      }
    });
  };

  return (
    <div className="p-6">
      {isLoading ? (
        <Loading></Loading>
      ) : parcels.length === 0 ? (
        <h1 className="text-3xl text-gray-600 font-extrabold mb-6 text-center">
          No assigned deliveries yet.
        </h1>
      ) : (
        <>
          <h1 className="text-3xl text-gray-600 font-extrabold mb-6 text-center">
            Pending Deliveries
          </h1>
          <div className="overflow-x-auto rounded-box border-2 border-base-content/5 bg-base-200">
            <table className="table table-sm text-center">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Receiver</th>
                  <th>Receiver Wirehouse</th>
                  <th>Cost</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {parcels.map((parcel) => (
                  <tr key={parcel._id}>
                    <td>{parcel.tracking_id}</td>
                    <td>{parcel.title}</td>
                    <td>{parcel.type}</td>
                    <td>{parcel.recieverName}</td>
                    <td>{parcel.recieverWirehouse}</td>
                    <td>৳{parcel.cost}</td>
                    <td className="capitalize">
                      {parcel.delivery_status.replace("_", " ")}
                    </td>
                    <td>
                      {parcel.delivery_status === "rider_assigned" && (
                        <button
                          className="btn btn-xs btn-primary text-black"
                          disabled={activeParcelId === parcel._id}
                          onClick={() =>
                            handleStatusUpdate(parcel, "in_transit")
                          }
                        >
                          {activeParcelId === parcel._id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            "Mark Picked Up"
                          )}
                        </button>
                      )}
                      {parcel.delivery_status === "in_transit" && (
                        <button
                          disabled={activeParcelId === parcel._id}
                          className="btn btn-xs btn-success text-black"
                          onClick={() =>
                            handleStatusUpdate(parcel, "delivered")
                          }
                        >
                          {activeParcelId === parcel._id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            "Mark Delivered"
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

export default PendingDeliveries;
