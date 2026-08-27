export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 shadow-xl ${className}`}>
      {children}
    </div>
  );
}
