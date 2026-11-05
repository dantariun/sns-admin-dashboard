type Props = {
  children: React.ReactNode;
};

export function TableSection({ children }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {children}
    </div>
  );
}
