type Props = {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
};

export function StatCard({ label, value, icon, trend }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className="p-3 bg-primary-50 rounded-lg text-primary-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        {trend && (
          <p className="text-xs text-gray-400 mt-1">
            {trend.value > 0 ? '▲' : '▼'} {Math.abs(trend.value)} {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}
