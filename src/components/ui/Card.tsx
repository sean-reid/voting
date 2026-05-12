interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

function Card({ children, className = "", padding = true, hover = false }: CardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-xl ${padding ? "p-6" : ""} ${hover ? "transition-shadow duration-200 hover:shadow-md" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
