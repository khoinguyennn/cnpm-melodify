import React from "react";

const AuthCard = ({ title, children }) => {
  return (
    <div className="card p-4" style={{ backgroundColor: "#241B3B", borderRadius: "10px", width: "400px" }}>
      <h2 className="text-center mb-4 text-white">{title}</h2>
      {children}
    </div>
  );
};

export default AuthCard;
