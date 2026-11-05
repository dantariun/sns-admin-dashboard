type Props = {
  children: React.ReactNode;
};

export function SearchSection({ children }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3 items-end">
      {children}
    </div>
  );
}
