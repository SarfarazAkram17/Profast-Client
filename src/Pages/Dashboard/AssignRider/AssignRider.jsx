import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaMotorcycle } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import useTrackingLogger from "../../../Hooks/useTrackingLogger";
import Loading from "../../../Components/Loading/Loading";

const AssignRider = () => {
  const { userEmail, uid } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { logTracking } = useTrackingLogger();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels?payment_status=paid&delivery_status=not_collected&uid=${uid}`
      );
      return res.data.sort(
        (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
      );
    },
  });

  const { mutateAsync: assignRider, isLoading: isAssigning } = useMutation({
    mutationFn: async ({ parcelId, rider }) => {
      setSelectedRider(rider);
      const res = await axiosSecure.patch(
        `/parcels/${parcelId}/assign?email=${userEmail}&uid=${uid}`,
        {
          riderId: rider._id,
          riderName: rider.riderName,
          riderEmail: rider.riderEmail,
        }
      );
      return res.data;
    },
    onSuccess: async () => {
      setShowModal(false);

      await logTracking({
        tracking_id: selectedParcel.tracking_id,
        status: "rider_assigned",
        details: `Assigned to ${selectedRider.riderName}`,
        updated_by: userEmail,
      });

      Swal.fire("Success", "Rider assigned successfully!", "success").then(
        () => {
          setSelectedParcel(null);
          setSelectedRider(null);
        }
      );
      queryClient.invalidateQueries(["assignableParcels"]);
    },
    onError: (error) => {
      Swal.fire("Error", "Failed to assign rider", error.message);
    },
  });

  const openAssignModal = async (parcel) => {
    setSelectedParcel(parcel);
    setLoadingRiders(true);
    setRiders([]);
    setShowModal(true);

    try {
      const res = await axiosSecure.get(
        `/riders/available?email=${userEmail}&uid=${uid}`,
        {
          params: {
            district: parcel.senderDistrict,
          },
        }
      );
      setRiders(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to load riders", error.message);
    } finally {
      setLoadingRiders(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl text-gray-600 font-extrabold mb-6 text-center">
        Assign Rider to Parcels
      </h1>
      {isLoading ? (
        <Loading></Loading>
      ) : parcels.length === 0 ? (
        <p className="text-gray-500">No parcels available for assign.</p>
      ) : (
        <div className="overflow-x-auto rounded-box border-2 border-base-content/5 bg-base-200">
          <table className="table text-center table-xs w-full">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Sender District</th>
                <th>Receiver District</th>
                <th>Cost</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.title}</td>
                  <td>{parcel.type}</td>
                  <td>{parcel.senderDistrict}</td>
                  <td>{parcel.recieverDistrict}</td>
                  <td>৳{parcel.cost}</td>
                  <td>{new Date(parcel.creation_date).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => openAssignModal(parcel)}
                      className="btn btn-xs btn-primary text-black"
                    >
                      <FaMotorcycle className="inline-block mr-1" />
                      Assign Rider
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal with showModal state */}
          <div className={`modal ${showModal ? "modal-open" : ""}`}>
            <div className="modal-box max-w-2xl">
              <h1 className="text-lg text-gray-600 font-extrabold mb-6 text-center">
                Assign Rider for Parcel:{" "}
                <span className="text-info">{selectedParcel?.title}</span>
              </h1>

              {loadingRiders ? (
                <Loading></Loading>
              ) : riders.length === 0 ? (
                <h1 className="text-lg text-error font-extrabold mb-6 text-center">
                  No available riders in this district.
                </h1>
              ) : (
                <div className="overflow-auto max-h-80 rounded-box border-2 border-base-content/5 bg-base-200">
                  <table className="table text-center table-xs w-full">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Bike Info</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riders.map((rider) => (
                        <tr key={rider._id}>
                          <td>{rider.riderName}</td>
                          <td>{rider.riderEmail}</td>
                          <td>{rider.riderContact}</td>
                          <td>
                            {rider.riderBikeBrand} -{" "}
                            {rider.riderBikeRegistrationNo}
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                assignRider({
                                  parcelId: selectedParcel._id,
                                  rider,
                                })
                              }
                              disabled={isAssigning}
                              className="btn btn-xs btn-primary text-black"
                            >
                              {isAssigning ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                "Assign"
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="modal-action">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedParcel(null);
                  }}
                  className="btn btn-sm btn-error"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
