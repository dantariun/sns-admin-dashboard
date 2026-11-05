type Props = {
  title: string;
  phase: string;
};

export function ComingSoonPage({ title, phase }: Props) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">{title}</h1>
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-dashed border-gray-300 text-center">
        <div className="text-4xl mb-4">🚧</div>
        <p className="text-gray-500 font-medium">{phase}에서 구현 예정</p>
        <p className="text-sm text-gray-400 mt-1">Coming soon</p>
      </div>
    </div>
  );
}
