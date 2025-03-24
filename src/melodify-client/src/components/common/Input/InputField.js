import React from "react";

const InputField = ({ type, placeholder, value, onChange, icon }) => {
  return (
    <div className="mb-3 position-relative">
      <input
        type={type}
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          backgroundColor: "#2F284B",
          color: "white",
          border: "none",
          padding: "10px",
        }}
      />
      {icon && (
        <span className="position-absolute top-50 end-0 translate-middle-y p-2">
          <i className={icon + " text-muted"}></i>
        </span>
      )}
    </div>
  );
};

export default InputField;