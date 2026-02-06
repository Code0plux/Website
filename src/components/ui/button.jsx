export function Button({ children, variant = 'default', onClick, className = '', ...props }) {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all'
  const variants = {
    default: 'bg-amber-500 text-white hover:bg-amber-600',
    outline: 'border-2 border-amber-500 text-amber-600 hover:bg-amber-50'
  }
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
