import { FadeLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
};
const LoadingScreen = () => {
  return (
    <div className="loading-page">
      <FadeLoader color="orange" cssOverride={override} />
    </div>
  );
};

export default LoadingScreen;
