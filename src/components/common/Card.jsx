/**
 * src/components/common/Card.jsx
 * Reusable surface container styled with dark navy glassmorphic card design.
 */

export default function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#0B132B]/85 backdrop-blur-md border border-slate-800/90 rounded-2xl p-5 shadow-xl shadow-black/20 ${
        hover ? 'hover:border-emerald-500/40 hover:bg-[#0E1838] transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

