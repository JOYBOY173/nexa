export default function Card({ as: Tag = "div", className = "", children, ...props }) {
  return (
    <Tag
      className={`rounded-md border border-border bg-surface shadow-subtle ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
