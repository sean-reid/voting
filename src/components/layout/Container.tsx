import { type ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  wide?: boolean;
  className?: string;
}

export default function Container({ children, wide, className = "" }: ContainerProps) {
  return (
    <div
      className={`mx-auto px-6 ${wide ? "max-w-[72rem]" : "max-w-[48rem]"} ${className}`}
    >
      {children}
    </div>
  );
}
