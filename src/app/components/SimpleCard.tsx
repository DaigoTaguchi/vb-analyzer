import Link from "next/link";
import { ReactNode } from "react";

export default function SimpleCard(props: {
  title: string;
  subtitle?: string;
  linkName: string;
  linkHref: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
        {props.title}
      </h3>
      <p className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-neutral-500">
        {props.subtitle}
      </p>
      <p className="mt-2 text-gray-500 dark:text-neutral-400">
        {props.children}
      </p>
      <Link
        className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-blue-600 decoration-2 hover:text-blue-700 hover:underline focus:underline focus:outline-none focus:text-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-600 dark:focus:text-blue-600"
        href={props.linkHref}
      >
        {props.linkName}
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
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </Link>
    </div>
  );
}
