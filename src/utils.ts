import { AccountMetric } from './types';

// Function to generate waterfall data from metrics
export function generateWaterfallData(metrics: AccountMetric[]) {
  const parseValue = (value: string) => parseFloat(value.replace(/[$,]/g, ''));
  
  const production = parseValue(metrics.find(m => m.label === 'Production')?.value || '0');
  const collection = parseValue(metrics.find(m => m.label === 'Collection')?.value || '0');
  const adjustment = parseValue(metrics.find(m => m.label === 'Adjustment')?.value || '0');
  const ar = parseValue(metrics.find(m => m.label === 'A/R')?.value || '0');
  const toBeCharged = parseValue(metrics.find(m => m.label === 'To be Charged')?.value || '0');
  const overdue = parseValue(metrics.find(m => m.label === 'Overdue')?.value || '0');
  
  return [
    { label: 'Production', amount: production, type: 'total', color: 'from-green-200 to-green-300' },
    { label: 'Collection\nto-date', amount: -collection, type: 'change', color: 'from-[#FDE4E1] to-[#FDE4E1]' },
    { label: 'Adjustment', amount: -adjustment, type: 'change', color: 'from-[#FFF0B8] to-[#FFF0B8]' },
    { label: 'Remaining\nA/R', amount: ar, type: 'total', color: 'from-blue-100 to-blue-200' },
    { label: 'To be\nCharged', amount: toBeCharged, type: 'change', color: 'from-[#E7DAEF] to-[#E7DAEF]' },
    { label: 'Overdue', amount: overdue, type: 'change', color: 'from-red-100 to-red-200' }
  ];
}
