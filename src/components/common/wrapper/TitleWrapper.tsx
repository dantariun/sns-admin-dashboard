type Props = {
  title: string;
  children?: React.ReactNode;
};

export function TitleWrapper({ title, children }: Props) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
