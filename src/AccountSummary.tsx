import React from 'react';
import ChartGridLines from './ChartGridLines';
import { insuranceData } from './data';
import { AccountMetric } from './types';
import decorativeImage1 from './images/Screenshot_2025-11-20_145127-removebg-preview_imgupscaler.ai_V1(Fast)_2K.svg';
import decorativeImage2 from './images/Screenshot_2025-11-20_144037-removebg-preview_imgupscaler.ai_V1(Fast)_2K.svg';

interface AccountSummaryProps {
  selectedInsurance: string;
  currentMetrics: AccountMetric[];
  maxValue: number;
  waterfallBars: any[]; // Defining a specific type for waterfall bars would be better, but 'any' works for now to match App.tsx structure
}

export default function AccountSummary({
  selectedInsurance,
  currentMetrics,
  maxValue,
  waterfallBars
}: AccountSummaryProps) {
  return (
    <div className="relative">
      <img 
        src={decorativeImage1}
        alt="Decorative element" 
        style={{ width: '98.98px', marginRight: '104px', marginTop: '-59px', height: '108.41px' }}
        className="absolute top-1 right-12 z-0 hidden lg:block"
      />
      <img 
        src={decorativeImage2}
        alt="Decorative element" 
        style={{ width: '96.38px', marginRight: '67px', marginTop: '-80px', height: '133.95px' }}
        className="absolute top-1 right-0 z-0 hidden lg:block"
      />
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-[0px_20px_70px_rgba(15,23,42,0.06)] border border-white dark:border-slate-800 relative z-10 w-full">
        <div className="mb-4 space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {selectedInsurance} Account Summary
            </h2>
            <span className="px-4 py-1 bg-[#d9f0cf] text-green-700 text-xs font-semibold rounded-full">
              Active
            </span>
          </div>
          <p className="text-sm text-gray-500">Subscriber: {insuranceData[selectedInsurance].subscriber}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
          {currentMetrics.map(metric => (
            <div
              key={metric.label}
              className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 flex flex-col gap-0.5"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <span className={`w-2 h-2 rounded-full ${metric.dot}`}></span>
                {metric.label}
              </div>
              <div className={`text-base font-semibold text-gray-900 dark:text-white ${metric.highlight ?? ''}`}>{metric.value}</div>
            </div>
          ))}
        </div>

        <div className="relative mt-2 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-6 pb-16 overflow-hidden">
          <ChartGridLines maxValue={maxValue} />
          <div
            className="h-64 flex items-end justify-between gap-3 pl-6 relative bg-[image:linear-gradient(to_bottom,rgba(226,232,240,0.6)_1px,transparent_1px)] bg-[size:100%_56px] dark:bg-none"
          >
            {waterfallBars.map((bar, index) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-1 relative group" style={{ height: '256px' }}>
                {/* Connector line */}
                {index > 0 && bar.type !== 'total' && waterfallBars[index - 1] && (
                  <div 
                    className="absolute border-t border-gray-200 dark:border-gray-700 z-0 transition-all duration-700 ease-in-out"
                    style={{ 
                      bottom: `${waterfallBars[index - 1].barBottom + waterfallBars[index - 1].barHeight}%`,
                      right: '50%',
                      width: 'calc(50% + 1.5rem)'
                    }}
                  />
                )}
                
                {/* Tooltip on hover */}
                <div 
                  className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg z-20 whitespace-nowrap pointer-events-none"
                  style={{ 
                    bottom: `${bar.barBottom + bar.barHeight + 5}%`,
                    transform: 'translateX(-50%)',
                    left: '50%'
                  }}
                >
                  ${Math.abs(bar.amount).toLocaleString()}
                  {/* Tooltip arrow */}
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
                </div>
                
                {/* Waterfall bar */}
                <div
                  className={`w-8 rounded-lg bg-gradient-to-b ${bar.color} shadow-md absolute z-10 cursor-pointer hover:opacity-90 transition-all duration-700 ease-in-out`}
                  style={{ 
                    height: `${bar.barHeight}%`,
                    bottom: `${bar.barBottom}%`
                  }}
                />
                
                {/* Label */}
                <div 
                  className={`text-[11px] text-gray-500 leading-tight whitespace-pre-line absolute z-10 ${index === 0 ? 'production-label' : ''}`}
                  style={{ bottom: '-40px' }}
                >
                  {bar.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
