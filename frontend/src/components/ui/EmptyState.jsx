export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border px-6 py-12 text-center">
      {Icon && <Icon className="h-8 w-8 text-faint" aria-hidden="true" />}
      <div>
        <p className="font-medium text-ink">{title}</p>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
