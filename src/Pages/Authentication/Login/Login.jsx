import React, { useState } from "react";
import { Link } from "react-router";
import ProfastLogo from "../../Shared/ProfastLogo/ProfastLogo";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
  } = useForm();

  const handleLogin = (formData) => {
    const email = formData.email
    const password = formData.password

    console.log(email, password)
  };

  return (
    <div className="px-4">
      <div>
        <ProfastLogo></ProfastLogo>
      </div>
      <div className="card w-full shadow-xl max-w-sm mx-auto my-12">
        <div className="card-body">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mb-4 text-sm font-semibold">Login with Profast</p>
          <form onSubmit={handleSubmit(handleLogin)} className="fieldset">
            <label className="label font-semibold">Email</label>
            <input
              type="email"
              {...register("email")}
              required
              className="input mb-4 placeholder:text-[13px] placeholder:font-bold"
              placeholder="Enter your email"
            />
            <label className="label font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input placeholder:text-[13px] placeholder:font-bold"
                {...register("password")}
                required
                placeholder="Enter your password"
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
            <div>
              <a className="link link-hover text-gray-600 font-semibold">
                Forgot password?
              </a>
            </div>
            <button className="btn btn-primary text-black mt-6">Login</button>
            <p className="text-xs my-2">
              Don't have any account ?{" "}
              <Link
                // state={location.state}
                to="/register"
                className="hover:underline text-[#8FA748] font-semibold"
              >
                Register
              </Link>
            </p>
          </form>
          <div className="divider my-4">OR</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
