import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaUserShield, FaUserTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Lottie from "lottie-react";
import loader from "../../../assets/animations/loading.json";
import useAuth from "../../../Hooks/useAuth";

const MakeAdmin = () => {
  const { userEmail, uid } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [emailQuery, setEmailQuery] = useState("");

  const {
    data: users = [],
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["searchedUsers", emailQuery],
    enabled: !!emailQuery,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/search?emailQuery=${emailQuery}&email=${userEmail}&uid=${uid}`
      );
      return res.data;
    },
  });

  const { mutateAsync: updateRole } = useMutation({
    mutationFn: async ({ id, role }) =>
      await axiosSecure.patch(
        `/users/${id}/role?email=${userEmail}&uid=${uid}`,
        { role }
      ),

    onSuccess: () => {
      refetch();
    },
  });

  const handleRoleChange = async (id, currentRole) => {
    const action = currentRole === "admin" ? "Remove admin" : "Make admin";
    const newRole = currentRole === "admin" ? "user" : "admin";

    const confirm = await Swal.fire({
      title: `${action}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await updateRole({ id, role: newRole });
      Swal.fire("Success", `${action} successful`, "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update user role", error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl text-gray-600 font-extrabold mb-6">Make Admin</h1>

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
            value={emailQuery}
            onChange={(e) => setEmailQuery(e.target.value)}
            className="w-full max-w-md"
            type="search"
            placeholder="Search user by email"
          />
        </label>
      </div>

      {isFetching && (
        <Lottie
          className="h-[40vh] place-items-center"
          loop={true}
          animationData={loader}
        ></Lottie>
      )}

      {!isFetching && users.length === 0 && emailQuery && (
        <h1 className="text-3xl text-gray-600 font-extrabold mb-6 text-center">
          There is no user in this Email
        </h1>
      )}

      {!isFetching && users.length > 0 && (
        <div className="overflow-x-auto rounded-box border-2 border-base-content/5 bg-base-200">
          <table className="table text-center">
            <thead>
              <tr>
                <th>Email</th>
                <th>Created At</th>
                <th>Last Login At</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.email}</td>
                  <td>{new Date(u.created_at).toLocaleString()}</td>
                  <td>{new Date(u.last_log_in).toLocaleString()}</td>
                  <td>
                    <span
                      className={`badge-xs text-xs font-bold h-auto rounded-full badge ${
                        u.role === "admin" ? "badge-success" : "badge-warning"
                      }`}
                    >
                      {u.role || "user"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleRoleChange(u._id, u.role)}
                      className={`btn btn-xs text-black ${
                        u.role === "admin" ? "btn-error" : "btn-primary"
                      }`}
                    >
                      {u.role === "admin" ? (
                        <>
                          <FaUserTimes className="mr-1" />
                          Remove Admin
                        </>
                      ) : (
                        <>
                          <FaUserShield className="mr-1" />
                          Make Admin
                        </>
                      )}
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

export default MakeAdmin;
