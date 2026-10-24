// simple horizontal bar list (labelled, single hue) for breakdowns
export function BarList({ items, valueFormat = (v) => v, emptyText = "No data yet" }) {
  const max = Math.max(...items.map((i) => i.value), 0);
  if (!items.length) return <p className="py-6 text-center text-sm text-gray-500">{emptyText}</p>;
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.key || item.label}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2 truncate font-medium text-gray-700">
              {item.icon}
              <span className="truncate">{item.label}</span>
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-gray-900">{valueFormat(item.value)}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-[#2d8f6a]" style={{ width: `${max ? Math.max(2, (item.value / max) * 100) : 0}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
