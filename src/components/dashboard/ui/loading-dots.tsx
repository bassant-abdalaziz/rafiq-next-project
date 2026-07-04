type LoadingDotsProps = {
  label?: string;
  className?: string;
  dotClassName?: string;
};

export function LoadingDots({
  label = "Loading",
  className = "",
  dotClassName = "",
}: LoadingDotsProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`flex items-center justify-center gap-1 ${className}`}
    >
      <span className="sr-only">{label}</span>

      <span
        className={`h-2 w-2 animate-bounce rounded-full bg-primary ${dotClassName}`}
        style={{ animationDelay: "0ms" }}
      />

      <span
        className={`h-2 w-2 animate-bounce rounded-full bg-primary ${dotClassName}`}
        style={{ animationDelay: "150ms" }}
      />

      <span
        className={`h-2 w-2 animate-bounce rounded-full bg-primary ${dotClassName}`}
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}
