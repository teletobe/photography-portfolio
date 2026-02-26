"use client";
import classNames from "classnames";

interface Props {
  show: boolean;
  fadeOut: boolean;
}

export default function WelcomeOverlay({ show, fadeOut }: Props) {
  if (!show) return null;

  return (
    <div
      className={classNames(
        "fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-1000",
        { "opacity-0": fadeOut }
      )}
    >
      <span className="text-2xl font-bold">Welcome!</span>
    </div>
  );
}
