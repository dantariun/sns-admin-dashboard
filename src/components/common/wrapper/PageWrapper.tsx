type Props = {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function PageWrapper({ title, actions, children }: Props) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
