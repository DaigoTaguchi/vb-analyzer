type SelectMenuProps = {
  options: string[];
  initOption: string;
  onChange: (value: string) => void;
};

export function SelectMenu(props: SelectMenuProps) {
  return (
    <select
      className="w-24 block rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-blue-600 transition duration-100 focus:ring-1"
      onChange={(e) => props.onChange(e.target.value)}
      defaultValue={props.initOption}
    >
      <option value={""} disabled>
        選択してください
      </option>
      {props.options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
