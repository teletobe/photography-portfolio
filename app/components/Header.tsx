"use client";
import classNames from "classnames";

interface Props {
  breakpointCols: number;
  setBreakpointCols: (n: number) => void;
}

export default function Header({ breakpointCols, setBreakpointCols }: Props) {
  return (
    <header className="fixed top-0 w-full z-30 flex justify-between items-center h-[90px] px-10">
      <span className="uppercase text-lg font-medium">Tobi's Portfolio</span>
      <div className="flex gap-3 pr-4">
        <span className="text-sm py-1 ">columns:</span>
        <button
          className={classNames(
            "rounded-3xl bg-stone-200 text-black px-2 py-1 text-sm",
            {
              "bg-opacity-30": breakpointCols !== 2,
            }
          )}
          onClick={() => setBreakpointCols(2)}
        >
          x2
        </button>
        <button
          className={classNames(
            "rounded-3xl bg-stone-200 text-black px-2 py-1 text-sm",
            {
              "bg-opacity-30": breakpointCols !== 3,
            }
          )}
          onClick={() => setBreakpointCols(3)}
        >
          x3
        </button>
      </div>
    </header>
  );
}
