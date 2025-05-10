const ButtonCustom = ({ text, onClick, type = "button", className, style, children }) => {
  return (
    <button
      type={type}
      className={`btn w-100 mb-3 ${className}`}
      style={{ border: "none", ...style }}
      onClick={onClick}
    >
      {children} {/* Hiển thị nội dung bên trong */}
      {text && <span className="ms-2">{text}</span>} {/* Hi��n thị text nếu có */}
    </button>
  )
}

export default ButtonCustom

