export default function StatsCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border shadow-sm rounded-xl">
      <div className="p-4 md:p-5">
        <div className="flex items-center gap-x-2">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
            {title}
          </p>
        </div>

        <div className="mt-1 flex items-center gap-x-2">
          <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
            {children}
          </h3>
        </div>
      </div>
    </div>
  );
}
