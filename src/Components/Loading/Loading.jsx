import Lottie from "lottie-react";
import loader from "../../assets/animations/loading.json";

const Loading = () => {
  return (
    <Lottie
      className="h-[40vh] place-items-center"
      loop={true}
      animationData={loader}
    ></Lottie>
  );
};

export default Loading;
