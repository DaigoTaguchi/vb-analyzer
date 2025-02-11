export default function Team() {
  return (
    <div className="max-w-sm space-y-3">
      <div className="max-w-sm">
        <label
          htmlFor="input-label"
          className="block text-sm font-medium mb-2 dark:text-white"
        >
          チーム名
        </label>
        <input
          type="text"
          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          placeholder="チームA"
        />
      </div>
    </div>
  );
}
