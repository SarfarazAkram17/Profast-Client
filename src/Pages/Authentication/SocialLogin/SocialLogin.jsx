import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../../Hooks/useAuth";
import useAxios from "../../../Hooks/useAxios";

const SocialLogin = ({ state, message }) => {
  const axiosInstance = useAxios();
  const { continueWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    continueWithGoogle()
      .then((res) => {
        toast.success(message);
        const email = res.user?.providerData[0]?.email;

        const userInfo = {
          email,
          role: "user", //default role
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        axiosInstance.post("/users", userInfo);

        navigate(state || "/");
      })
      .catch((error) => toast.error(error.message));
  };
  return (
    <button onClick={handleGoogleLogin} className="btn btn-primary text-black">
      <svg
        aria-label="Google logo"
        width="25"
        height="25"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <g>
          <path
            fill="#34a853"
            d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
          ></path>
          <path
            fill="#4285f4"
            d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
          ></path>
          <path
            fill="#fbbc02"
            d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
          ></path>
          <path
            fill="#ea4335"
            d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
          ></path>
        </g>
      </svg>
      Continue with Google
    </button>
  );
};

export default SocialLogin;
