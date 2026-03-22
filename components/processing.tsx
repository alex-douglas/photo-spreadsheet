"use client";

export function Processing() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 animate-in fade-in duration-300">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
        <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-green-300 border-b-transparent animate-spin direction-reverse" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Analyzing your document...
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Detecting document type and extracting data
        </p>
      </div>
    </div>
  );
}
