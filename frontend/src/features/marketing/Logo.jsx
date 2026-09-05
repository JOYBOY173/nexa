export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-ink ${className}`}>
      <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-current text-white text-[13px] leading-none">
        N
      </span>
      Nexa
    </span>
  );
}
