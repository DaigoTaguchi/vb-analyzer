export function SimpleButton(props: {
  type: "button" | "submit";
  text: string;
  width: "small" | "medium" | "large" | "full";
}) {
  const widthClass = {
    small: "w-20",
    medium: "w-32",
    large: "w-48",
    full: "w-full",
  }[props.width];
  return (
    <button
      type={props.type}
      className={`${widthClass} mt-4 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition duration-200`}
    >
      {props.text}
    </button>
  );
}
