import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const { user, logOutUser } = useAuth();
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosSecure.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.status === 401) {
        logOutUser().then(() => {
          navigate("/login");
        });
      }

      if (error.status === 403) {
        navigate("/forbidden");
      }

      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
