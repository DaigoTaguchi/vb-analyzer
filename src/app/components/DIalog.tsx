import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";

export default function AttackDialog(props: { buttonText: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="py-2 px-4 bg-blue-600 text-white rounded-lg"
      >
        {props.buttonText}
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 bg-white border border-gray-300 shadow-xl rounded-lg p-8">
            <DialogTitle className="font-bold">アタック結果の入力</DialogTitle>
            <Description>
              {props.buttonText}のアタック結果を入力してください
            </Description>
            <p className="text-sm text-gray-600 my-2">
              <span className="font-medium">成功:</span> アタックヒットで得点{" "}
              <br />
              <span className="font-medium">
                失敗:
              </span> アタックヒットで失点 <br />
              <span className="font-medium">返球:</span>{" "}
              アタックヒットで得点も失点もしていない <br />
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-blue-600 text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:outline-none focus:border-blue-500 focus:text-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              >
                成功
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-red-500 text-red-500 hover:border-red-400 hover:text-red-400 focus:outline-none focus:border-red-400 focus:text-red-400 disabled:opacity-50 disabled:pointer-events-none"
              >
                失敗
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-teal-500 text-teal-500 hover:border-teal-400 hover:text-teal-400 focus:outline-none focus:border-teal-400 focus:text-teal-400 disabled:opacity-50 disabled:pointer-events-none"
              >
                返球
              </button>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 focus:outline-none focus:border-blue-600 focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700"
            >
              戻る
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
