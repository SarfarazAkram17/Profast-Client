import { useState } from "react";
import Swal from "sweetalert2";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Lottie from "lottie-react";
import loader from "../../../assets/animations/loading.json";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PendingRiders = () => {
  const { userEmail, uid } = useAuth();
  const [selectedRider, setSelectedRider] = useState(null);
  const axiosSecure = useAxiosSecure();

  const {
    isPending,
    data: riders = [],
    refetch,
  } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders/pending?email=${userEmail}&uid=${uid}`);
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

  const handleDecision = async (id, action, email) => {
    const confirm = await Swal.fire({
      title: `${action === "approve" ? "Approve" : "Reject"} Application?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/riders/${id}/status?email=${userEmail}&uid=${uid}`, {
        status: action === "approve" ? "active" : "rejected",
        email,
      });

      refetch();

      Swal.fire(
        "Success",
        `Rider ${action}${action === "approve" ? "d" : "ed"} successfully`,
        "success"
      );
    } catch (err) {
      Swal.fire("Error", "Could not update rider status", err);
    }
  };

  return (
    <div className="p-6">
      {riders.length === 0 ? (
        <h1 className="text-3xl text-gray-600 font-extrabold mb-6 text-center">
          There is no Pending Rider Applications
        </h1>
      ) : (
        <>
          {" "}
          <h1 className="text-3xl text-gray-600 font-extrabold mb-6 text-center">
            Pending Rider Applications
          </h1>
          <div className="overflow-x-auto rounded-box border-2 border-base-content/5 bg-base-200">
            <table className="table table-sm text-center">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Region</th>
                  <th>District</th>
                  <th>Wire House</th>
                  <th>Contact</th>
                  <th>Applied At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {riders.map((rider) => (
                  <tr key={rider._id}>
                    <td>{rider.riderName}</td>
                    <td
                      className="truncate max-w-[100px]"
                      title={rider.riderEmail}
                    >
                      {rider.riderEmail}
                    </td>
                    <td>{rider.riderRegion}</td>
                    <td>{rider.riderDistrict}</td>
                    <td>{rider.riderWirehouse}</td>
                    <td>{rider.riderContact}</td>
                    <td
                      className="truncate max-w-[100px]"
                      title={new Date(rider.created_at).toLocaleString()}
                    >
                      {new Date(rider.created_at).toLocaleString()}
                    </td>
                    <td className="flex gap-1 justify-center">
                      <button
                        onClick={() => setSelectedRider(rider)}
                        className="btn btn-xs btn-info"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() =>
                          handleDecision(rider._id, "approve", rider.riderEmail)
                        }
                        className="btn btn-xs btn-success"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() =>
                          handleDecision(rider._id, "reject", rider.riderEmail)
                        }
                        className="btn btn-xs btn-error"
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal for viewing rider details */}
      {selectedRider && (
        <dialog id="riderDetailsModal" className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-2xl mb-5">Rider Details</h3>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedRider.riderName}
              </p>
              <p>
                <strong>Email:</strong> {selectedRider.riderEmail}
              </p>
              <p>
                <strong>Contact:</strong> {selectedRider.riderContact}
              </p>
              <p>
                <strong>Age:</strong> {selectedRider.riderAge}
              </p>
              <p>
                <strong>NID:</strong> {selectedRider.riderNidNo}
              </p>
              <p>
                <strong>Bike Brand:</strong> {selectedRider.riderBikeBrand}
              </p>
              <p>
                <strong>Bike Registration:</strong>{" "}
                {selectedRider.riderBikeRegistrationNo}
              </p>
              <p>
                <strong>Region:</strong> {selectedRider.riderRegion}
              </p>
              <p>
                <strong>District:</strong> {selectedRider.riderDistrict}
              </p>
              <p>
                <strong>Wire House:</strong> {selectedRider.riderWirehouse}
              </p>
              <p>
                <strong>Applied At:</strong>{" "}
                {new Date(selectedRider.created_at).toLocaleString()}
              </p>
              {selectedRider.riderAdditionalInformation && (
                <p>
                  <strong>Additional Information:</strong>{" "}
                  {selectedRider.riderAdditionalInformation}
                </p>
              )}
            </div>

            <div className="modal-action mt-6">
              <button
                className="btn btn-outline"
                onClick={() => setSelectedRider(null)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingRiders;
