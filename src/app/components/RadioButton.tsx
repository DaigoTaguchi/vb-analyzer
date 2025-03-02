import React from "react";

type Props = {
  serveRight: string;
  onChangeServe: (value: string) => void;
};

const RadioButtons: React.FC<Props> = ({ serveRight, onChangeServe }) => {
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      <label
        htmlFor="hs-radio-in-form"
        className="flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <input
          type="radio"
          name="serve-right"
          className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          id="hs-radio-in-form"
          value="home"
          checked={serveRight === "home"}
          onChange={() => onChangeServe("home")}
        />
        <span className="text-sm text-gray-500 ms-3">Home サーブ</span>
      </label>

      <label
        htmlFor="hs-radio-checked-in-form"
        className="flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <input
          type="radio"
          name="serve-right"
          className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          id="hs-radio-checked-in-form"
          value="away"
          checked={serveRight === "away"}
          onChange={() => onChangeServe("away")}
        />
        <span className="text-sm text-gray-500 ms-3">Away サーブ</span>
      </label>
    </div>
  );
};

export default RadioButtons;
