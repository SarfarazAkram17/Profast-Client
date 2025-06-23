import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ProfastLogo from "../../Shared/ProfastLogo/ProfastLogo";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import userImage from "../../../assets/image-upload-icon.png";
import useAuth from "../../../Hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { createUser, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  // Cleanup previous preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      clearErrors("photo");
    }
  };

  const handleRegister = (formData) => {
    setLoading(true);

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password.trim();

    const imageData = new FormData();
    imageData.append("image", selectedFile);

    const imgbbApiKey = import.meta.env.VITE_imgbb_key;

    fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: "POST",
      body: imageData,
    })
      .then((res) => res.json())
      .then((imgData) => {
        if (!imgData.success) {
          toast.error("Image upload failed");
          return;
        }

        const photo = imgData.data.url;
        createUser(email, password)
          .then(() => {
            toast.success("Registered successfully");
            updateUserProfile(name, photo).catch((error) =>
              toast.error(error.message)
            );
            navigate(location.state || "/");
          })
          .catch((error) => {
            toast.error(error.message);
          });
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="px-4">
      <ProfastLogo />
      <div className="card w-full shadow-xl max-w-sm mx-auto my-12">
        <div className="card-body">
          <h1 className="text-3xl font-extrabold">Create an Account</h1>
          <p className="mb-4 text-sm font-semibold">Register with Profast</p>

          <form onSubmit={handleSubmit(handleRegister)} className="fieldset">
            <label htmlFor="profileImage" className="cursor-pointer">
              <img
                src={preview || userImage}
                alt="Upload"
                className="w-13 h-13 object-cover rounded-full border-2 p-0.5 border-blue-300"
              />
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              {...register("photo", { required: true })}
              onChange={handleImageChange}
              className="hidden"
            />
            {errors.photo && (
              <p className="text-red-500 font-bold">
                Profile image is required.
              </p>
            )}

            <label className="label font-semibold mt-4">Name</label>
            <input
              type="text"
              {...register("name", { required: true, minLength: 6 })}
              className="input placeholder:text-[13px] placeholder:font-bold"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 font-bold">
                {errors.name.type === "required"
                  ? "Name is required."
                  : "Name must be at least 6 characters."}
              </p>
            )}

            <label className="label font-semibold mt-4">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input placeholder:text-[13px] placeholder:font-bold"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 font-bold">Email is required.</p>
            )}

            <label className="label font-semibold mt-4">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input placeholder:text-[13px] placeholder:font-bold"
                placeholder="Enter your password"
                {...register("password", {
                  required: true,
                  minLength: 6,
                  validate: {
                    hasUppercase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Must include at least one uppercase letter",
                    hasLowercase: (value) =>
                      /[a-z]/.test(value) ||
                      "Must include at least one lowercase letter",
                    hasNumber: (value) =>
                      /\d/.test(value) || "Must include at least one number",
                  },
                })}
              />
              {showPassword ? (
                <FaEyeSlash
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-6 cursor-pointer z-10"
                  size={17}
                />
              ) : (
                <FaEye
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-6 cursor-pointer z-10"
                  size={17}
                />
              )}
            </div>
            {errors.password && (
              <div className="text-red-500 text-xs font-bold mt-1">
                {errors.password.message ||
                  (errors.password.type === "minLength"
                    ? "Password must be at least 6 characters."
                    : "Password is required.")}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary text-black mt-6"
            >
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Register"
              )}
            </button>

            <p className="text-xs my-2">
              Already have an account?{" "}
              <Link
                state={location.state}
                to="/login"
                className="hover:underline text-[#8FA748] font-semibold"
              >
                Login
              </Link>
            </p>
          </form>

          <div className="divider my-4 text-gray-500 font-semibold">Or</div>
          <SocialLogin
            state={location.state}
            message={"You registered successfully"}
          ></SocialLogin>
        </div>
      </div>
    </div>
  );
};

export default Register;
