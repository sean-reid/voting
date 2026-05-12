type BadgeVariant = "default" | "terracotta" | "sage" | "slate" | "muted-red";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-surface-hover text-ink-secondary",
  terracotta: "bg-terracotta/15 text-terracotta",
  sage: "bg-sage/15 text-sage",
  slate: "bg-slate/15 text-slate",
  "muted-red": "bg-muted-red/15 text-muted-red",
};

function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}

export default Badge;
