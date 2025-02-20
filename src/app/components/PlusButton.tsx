export function PlusButton(props: { handler: () => void }) {
  return (
    <button
      type="button"
      onClick={props.handler}
      className="w-[2.875rem] h-[2.875rem] inline-flex justify-center items-center text-blue-600 bg-blue-200 hover:bg-blue-300 rounded-full transition duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M12 5v14"></path>
        <path d="M5 12h14"></path>
      </svg>
    </button>
  );
}
