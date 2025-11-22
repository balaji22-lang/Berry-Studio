import React from 'react';

export default function ChartGridLines({ maxValue }: { maxValue: number }) {
  const midValue = maxValue / 2;
  const formatK = (val: number) => val >= 1000 ? (val / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : val.toString();

  return (
    <>
      <div className="absolute left-3 top-5 text-[10px] text-gray-400">{formatK(maxValue)}</div>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">{formatK(midValue)}</div>
      <div className="absolute left-3 bottom-5 text-[10px] text-gray-400">0</div>
      <div className="absolute inset-x-4 top-9 h-px bg-transparent"></div>
      <div className="absolute inset-x-4 bottom-9 h-px bg-transparent"></div>
      <div className="absolute top-6 bottom-6 left-1/2 w-px border-l border-dashed border-gray-200 dark:border-transparent"></div>
    </>
  );
}
