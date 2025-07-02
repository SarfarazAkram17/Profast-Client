import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://profast-sarfaraz-akram.vercel.app",
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
