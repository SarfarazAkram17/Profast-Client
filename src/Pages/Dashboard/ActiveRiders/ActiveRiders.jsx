import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaSearch, FaUserSlash } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import loader from "../../../assets/animations/loading.json";
import Lottie from "lottie-react";

const ActiveRiders = () => {
  const { userEmail, uid } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: riders = [],
    isLoading,
    isPending,
    refetch,
    error,
  } = useQuery({
    queryKey: ["active-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders/active?email=${userEmail}&uid=${uid}`
      );
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

  const handleDeactivate = async (id) => {
    const confirm = await Swal.fire({
      title: "Deactivate this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(
        `/riders/${id}/status?email=${userEmail}&uid=${uid}`,
        {
          status: "deactivated",
        }
      );

      Swal.fire("Done", "Rider has been deactivated", "success");

      refetch();
    } catch (error) {
      Swal.fire("Error", "Failed to deactivate rider", error.message);
    }
  };

  const filteredRiders = riders.filter((rider) =>
    rider.riderName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {!isLoading && riders.length === 0 && searchTerm === "" && (
        <h1 className="text-3xl text-gray-600 font-extrabold mb-6 text-center">
          There is no Active Riders
        </h1>
      )}

      {!isLoading && riders.length > 0 && (
        <>
          <h1 className="text-3xl text-gray-600 font-extrabold mb-6">
            Active Riders
          </h1>

          <div className="mb-12">
            <label className="input">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md"
                type="search"
                placeholder="Search by name"
              />
            </label>
          </div>
        </>
      )}

      {!isLoading && riders.length > 0 && filteredRiders.length === 0 && (
        <h1 className="text-3xl text-gray-600 font-extrabold mb-6 text-center">
          There is no rider in this name
        </h1>
      )}

      {!isLoading && !error && filteredRiders.length > 0 && (
        <div className="overflow-x-auto rounded-box border-2 border-base-content/5 bg-base-200">
          <table className="table table-sm w-full text-center">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Region</th>
                <th>District</th>
                <th>Wire House</th>
                <th>Bike Brand</th>
                <th>Bike Registration No</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.map((rider) => (
                <tr key={rider._id}>
                  <td className="truncate max-w-[80px]" title={rider.riderName}>
                    {rider.riderName}
                  </td>
                  <td
                    className="truncate max-w-[80px]"
                    title={rider.riderEmail}
                  >
                    {rider.riderEmail}
                  </td>
                  <td>{rider.riderContact}</td>
                  <td>{rider.riderRegion}</td>
                  <td>{rider.riderDistrict}</td>
                  <td>{rider.riderWirehouse}</td>
                  <td>{rider.riderBikeBrand}</td>
                  <td>{rider.riderBikeRegistrationNo}</td>
                  <td>
                    <span className="badge badge-success badge-xs font-bold h-auto rounded-full text-xs">
                      Active
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeactivate(rider._id)}
                      className="btn btn-xs btn-error"
                    >
                      <FaUserSlash /> Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;
