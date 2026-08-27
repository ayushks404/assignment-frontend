export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ocean-dark active:scale-[0.98]";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-cyan-500/20 focus:ring-cyan-400",
    secondary: "border-2 border-cyan-500/80 text-cyan-400 hover:bg-cyan-500/10 focus:ring-cyan-500"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
