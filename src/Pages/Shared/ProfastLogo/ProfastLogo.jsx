import React from "react";
import logo from "../../../assets/logo.png";

const ProfastLogo = () => {
  return (
    <div className="font-extrabold text-3xl flex items-end">
      <img src={logo} className="h-auto w-9" alt="Website logo" />
      <span className="-ml-4 -mb-2.5">Profast</span>
    </div>
  );
};

export default ProfastLogo;
