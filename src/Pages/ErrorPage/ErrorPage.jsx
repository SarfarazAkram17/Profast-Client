import Lottie from "lottie-react";
import errorLottie from "../../assets/animations/error.json";
import { Link } from "react-router";

const ErrorPage = () => {
  return (
    <div className="bg-white rounded-2xl place-items-center space-y-4 py-20 px-4">
      <h1 className="font-extrabold text-red-600 text-2xl md:text-4xl text-center">
        Error 404
      </h1>
      <Lottie
        className="h-[40vh]"
        loop={true}
        animationData={errorLottie}
      ></Lottie>

      <Link to="/">
        <button className="btn btn-primary text-black font-bold">
          Go Home
        </button>
      </Link>
    </div>
  );
};

export default ErrorPage;
