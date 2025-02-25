import { useEffect } from "react";

const MatchStartModal = () => {
  useEffect(() => {
    const modal = document.getElementById("hs-basic-modal");
    const overlay = document.getElementById("overlay");
    if (modal && overlay) {
      // モーダルとオーバーレイの表示設定
      modal.classList.remove("hidden", "opacity-0");
      modal.classList.add("opacity-100", "duration-500");
      overlay.classList.remove("hidden", "opacity-0");
      overlay.classList.add("opacity-50", "duration-500");

      // ポインターイベントを有効に
      modal.style.pointerEvents = "auto";
      overlay.style.pointerEvents = "auto";
    }
  }, []);

  return (
    <div>
      {/* 背景のオーバーレイ */}
      <div
        id="overlay"
        className="hidden fixed top-0 left-0 w-full h-full bg-black opacity-0 pointer-events-none transition-all z-40"
      ></div>

      {/* モーダル本体 */}
      <div
        id="hs-basic-modal"
        className="hs-overlay size-full fixed top-0 start-0 z-[80] opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-auto"
        role="dialog"
        tabIndex={-1}
        aria-labelledby="hs-basic-modal-label"
      >
        <div className="sm:max-w-lg sm:w-full m-3 sm:mx-auto">
          <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto">
            <div className="flex justify-between items-center py-3 px-4 border-b">
              <h3 id="hs-basic-modal-label" className="font-bold text-gray-800">
                サーブ権の選択
              </h3>
              <button
                type="button"
                className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                aria-label="Close"
                onClick={() => {
                  const modal = document.getElementById("hs-basic-modal");
                  const overlay = document.getElementById("overlay");
                  if (modal && overlay) {
                    modal.classList.add("opacity-0");
                    modal.classList.remove("opacity-100");
                    overlay.classList.add("opacity-0");
                    overlay.classList.remove("opacity-50");
                    modal.style.pointerEvents = "none";
                    overlay.style.pointerEvents = "none";
                  }
                }}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <p className="mt-1 text-gray-800">
                サーブ権を選んで、試合を開始してください。
              </p>
              {/* サーブ権選択フォームやボタン */}
            </div>
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => {
                  const modal = document.getElementById("hs-basic-modal");
                  const overlay = document.getElementById("overlay");
                  if (modal && overlay) {
                    modal.classList.add("opacity-0");
                    modal.classList.remove("opacity-100");
                    overlay.classList.add("opacity-0");
                    overlay.classList.remove("opacity-50");
                    modal.style.pointerEvents = "none";
                    overlay.style.pointerEvents = "none";
                  }
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                試合開始
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchStartModal;
