import { toast } from "react-toastify";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useTrackingLogger = () => {
  const { uid } = useAuth();
  const axiosSecure = useAxiosSecure();

  const logTracking = async ({
    tracking_id,
    status,
    details,
    location,
    updated_by,
  }) => {
    try {
      const payload = {
        tracking_id,
        status,
        details,
        location,
        updated_by,
      };
      await axiosSecure.post(`/trackings?uid=${uid}`, payload);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return { logTracking };
};

export default useTrackingLogger;
