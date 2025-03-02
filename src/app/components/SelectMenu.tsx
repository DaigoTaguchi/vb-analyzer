type SelectMenuProps = {
  options: {
    value: string;
    label: string;
  }[];
  label: string;
  initOption: string;
  onChange: (value: string) => void;
};

export function SelectMenu(props: SelectMenuProps) {
  return (
    <>
      <label
        htmlFor="homeTeamName"
        className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
      >
        {props.label}
      </label>
      <select
        className="w-full block rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-blue-600 transition duration-100 focus:ring-1"
        onChange={(e) => props.onChange(e.target.value)}
        value={props.initOption}
      >
        <option value={""} disabled>
          選択してください
        </option>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
