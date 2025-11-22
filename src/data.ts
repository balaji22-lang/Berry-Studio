import {
  CalendarDays,
  ClipboardList,
  FileText,
  Layers,
  MapPin,
  Building2
} from 'lucide-react';
import { cilDollar } from '@coreui/icons';
import { CiBank } from 'react-icons/ci';
import { AccountMetric, AutoPaymentCard, LedgerEntry, QuickAction } from './types';

export const patientDetails = [
  { icon: CalendarDays, label: 'DOB', value: '10-25-2000' },
  { icon: FileText, label: 'Exam', value: 'mm-dd-yyy' },
  { icon: ClipboardList, label: 'Status', value: 'Inactive Tx' },
  { icon: Layers, label: 'Phase', value: 'Phase I / Aligners Phase I / Aligners' },
  { icon: MapPin, label: 'Location', value: 'Practice Location name' }
];

export const ledgerData: LedgerEntry[] = [
  { 
    date: '08-18-2024', 
    code: '1F', 
    type: 'New Treatment Fee', 
    subtype: 'Treatment Fee', 
    totalAcc: '5730.00', 
    adjustments: '-', 
    charges: '-', 
    payments: '-', 
    balance: '-',
    reference: 'TF-2024-001',
    notes: 'Initial treatment fee for orthodontic services. Full comprehensive plan including aligners and retainers.'
  },
  { 
    date: '11-05-2024', 
    code: 'V', 
    type: 'Principal Payment (1/18) (3/4/17)', 
    subtype: 'Insurance Payment', 
    totalAcc: '-', 
    adjustments: '-', 
    charges: '-', 
    payments: '(742.18)', 
    balance: '-',
    reference: 'INS-2024-4567',
    notes: 'Insurance payment received from Delta Dental. Principal payment 1 of 18 installments.'
  },
  {
    date: 'Nov 17, 2024',
    code: '3',
    type: 'Contract Charge',
    subtype: '1st Month Charge',
    totalAcc: '-',
    adjustments: '-',
    charges: '632.50',
    payments: '-',
    balance: '632.50',
    reference: 'XXXX-XXXX-7898',
    notes: 'First monthly installment charge for treatment plan. Auto-payment scheduled for the 17th of each month.'
  },
  { 
    date: 'Nov 12, 2024', 
    code: '3', 
    type: 'Visa (XXXX 8368)', 
    subtype: 'Ancestry Bank Card', 
    totalAcc: '-', 
    adjustments: '-', 
    charges: '-', 
    payments: '(117.18)', 
    balance: '515.32',
    reference: 'PAY-2024-1122',
    notes: 'Partial payment received via Visa ending in 8368. Ancestry Bank Card on file.'
  },
  { 
    date: 'Nov 12, 2024', 
    code: '3', 
    type: 'Contract Charge', 
    subtype: '2nd Month Charge', 
    totalAcc: '-', 
    adjustments: '-', 
    charges: '207.50', 
    payments: '-', 
    balance: '722.82',
    reference: 'CC-2024-002',
    notes: 'Second monthly contract charge applied to patient account as per payment plan agreement.'
  },
  { 
    date: 'Nov 12, 2024', 
    code: '3', 
    type: 'Visa (XXXX 8368)', 
    subtype: 'Ancestry Bank Card', 
    totalAcc: '-', 
    adjustments: '-', 
    charges: '-', 
    payments: '(117.18)', 
    balance: '605.82',
    reference: 'PAY-2024-1123',
    notes: 'Monthly payment processed successfully. Payment method: Visa ending in 8368.'
  },
  { 
    date: 'Nov 12, 2024', 
    code: '3', 
    type: 'Contract Charge', 
    subtype: '3rd Month Charge', 
    totalAcc: '-', 
    adjustments: '-', 
    charges: '207.50', 
    payments: '-', 
    balance: '813.32',
    reference: 'CC-2024-003',
    notes: 'Third installment charge applied. Payment due immediately to maintain treatment schedule.'
  },
  { 
    date: 'Nov 12, 2024', 
    code: '3', 
    type: 'Visa (XXXX 8368)', 
    subtype: 'Ancestry Bank Card', 
    totalAcc: '-', 
    adjustments: '-', 
    charges: '-', 
    payments: '(117.18)', 
    balance: '696.92',
    reference: 'PAY-2024-1124',
    notes: 'Automated payment processed via stored payment method. Transaction completed successfully.'
  },
  { 
    date: 'Nov 17, 2024', 
    code: '3', 
    type: 'Contract Charge', 
    subtype: '4th Month Charge', 
    totalAcc: '-', 
    adjustments: '-', 
    charges: '207.50', 
    payments: '-', 
    balance: '903.43',
    reference: 'CC-2024-004',
    notes: 'Fourth monthly charge for ongoing treatment services. Includes aligner adjustment and monitoring.'
  },
  { 
    date: 'Nov 17, 2024', 
    code: '3', 
    type: 'Visa (XXXX 8368)', 
    subtype: 'Ancestry Bank Card', 
    totalAcc: '-', 
    adjustments: '-', 
    charges: '-', 
    payments: '(903.43)', 
    balance: '0.00',
    reference: 'PAY-2024-1125',
    notes: 'Final payment received. Account balance cleared to $0.00. Treatment plan fully paid.'
  }
];

export const waterfallData = [
  { label: 'Production', amount: 5730, type: 'total', color: 'from-green-200 to-green-300' },
  { label: 'Production\nAdjustment', amount: -3050, type: 'change', color: 'from-green-100 to-green-200' },
  { label: 'Total\nA/R', amount: 2680, type: 'total', color: 'from-blue-100 to-blue-200' },
  { label: 'Collection\nto-date', amount: -990, type: 'change', color: 'from-blue-200 to-blue-300' },
  { label: 'Collection\nadjustment', amount: -300, type: 'change', color: 'from-red-50 to-red-100' },
  { label: 'Pending\nA/R', amount: 500, type: 'change', color: 'from-blue-100 to-blue-200' },
  { label: 'A/R\nDue now', amount: 185, type: 'change', color: 'from-yellow-100 to-yellow-200' },
  { label: 'A/R aging\n0-30 days', amount: 250, type: 'change', color: 'from-yellow-200 to-yellow-300' },
  { label: 'A/R aging\n31-60 days', amount: 300, type: 'change', color: 'from-yellow-100 to-yellow-200' },
  { label: 'A/R aging\n61-90 days', amount: 200, type: 'change', color: 'from-yellow-50 to-yellow-100' },
  { label: 'A/R aging\n>91 days', amount: 150, type: 'change', color: 'from-red-100 to-red-200' }
];

export const autoPaymentCards: AutoPaymentCard[] = [
  { gradient: 'from-[#7ec7ff] to-[#1d99ff]', amount: '$244.00', card: '2224', start: '11/24/2024', end: '12/12/2025', payments: '6 Payments Done' },
  { gradient: 'from-[#4d4f5c] to-[#262731]', amount: '$220.00', card: '2422', start: '04/22/2024', end: '12/12/2025', payments: '2 Payments Done' },
  { gradient: 'from-[#ffeb9b] to-[#f6d95c]', amount: '$3275.00', card: '2729', start: '12/12/2024', end: '07/12/2025', payments: '0 Payment Done' }
];

export const accountMetrics: AccountMetric[] = [
  { label: 'Production', value: '$5730.00', dot: 'bg-green-400', amount: '$5.73K' },
  { label: 'Collection', value: '$990.00', dot: 'bg-red-300', amount: '$3.05K' },
  { label: 'Adjustment', value: '$300.00', dot: 'bg-amber-300', amount: '$1.80K' },
  { label: 'A/R', value: '$500.00', dot: 'bg-blue-300', amount: '$2.60K' },
  { label: 'To be Charged', value: '$185.00', dot: 'bg-rose-200', amount: '$2.10K', highlight: 'text-rose-500' },
  { label: 'Overdue', value: '$0.00', dot: 'bg-purple-200', amount: '$0.00', highlight: 'text-rose-500' }
];

export const insuranceData: Record<string, { 
  subscriber: string; 
  metrics: AccountMetric[];
  cards: AutoPaymentCard[];
  ledger: LedgerEntry[];
}> = {
  'Delta Dental of CA': {
    subscriber: 'Christopher',
    metrics: [
      { label: 'Production', value: '$5730.00', dot: 'bg-green-400', amount: '$5.73K' },
      { label: 'Collection', value: '$990.00', dot: 'bg-red-300', amount: '$3.05K' },
      { label: 'Adjustment', value: '$300.00', dot: 'bg-amber-300', amount: '$1.80K' },
      { label: 'A/R', value: '$500.00', dot: 'bg-blue-300', amount: '$2.60K' },
      { label: 'To be Charged', value: '$185.00', dot: 'bg-rose-200', amount: '$2.10K', highlight: 'text-rose-500' },
      { label: 'Overdue', value: '$0.00', dot: 'bg-purple-200', amount: '$0.00', highlight: 'text-rose-500' }
    ],
    cards: [
      { gradient: 'from-[#7ec7ff] to-[#1d99ff]', amount: '$244.00', card: '2224', start: '11/24/2024', end: '12/12/2025', payments: '6 Payments Done' },
      { gradient: 'from-[#4d4f5c] to-[#262731]', amount: '$220.00', card: '2422', start: '04/22/2024', end: '12/12/2025', payments: '2 Payments Done' },
      { gradient: 'from-[#ffeb9b] to-[#f6d95c]', amount: '$3275.00', card: '2729', start: '12/12/2024', end: '07/12/2025', payments: '0 Payment Done' }
    ],
    ledger: ledgerData
  },
  'Anthem Bluecross': {
    subscriber: 'George Washington',
    metrics: [
      { label: 'Production', value: '$4200.00', dot: 'bg-green-400', amount: '$4.20K' },
      { label: 'Collection', value: '$1200.00', dot: 'bg-red-300', amount: '$1.20K' },
      { label: 'Adjustment', value: '$150.00', dot: 'bg-amber-300', amount: '$0.15K' },
      { label: 'A/R', value: '$850.00', dot: 'bg-blue-300', amount: '$0.85K' },
      { label: 'To be Charged', value: '$320.00', dot: 'bg-rose-200', amount: '$0.32K', highlight: 'text-rose-500' },
      { label: 'Overdue', value: '$100.00', dot: 'bg-purple-200', amount: '$0.10K', highlight: 'text-rose-500' }
    ],
    cards: [
      { gradient: 'from-purple-400 to-purple-600', amount: '$350.00', card: '4156', start: '10/15/2024', end: '11/15/2025', payments: '4 Payments Done' },
      { gradient: 'from-[#7ec7ff] to-[#1d99ff]', amount: '$180.00', card: '8832', start: '09/01/2024', end: '10/01/2025', payments: '3 Payments Done' },
      { gradient: 'from-pink-400 to-rose-500', amount: '$2100.00', card: '1947', start: '11/20/2024', end: '06/20/2025', payments: '1 Payment Done' }
    ],
    ledger: [
      { date: '09-10-2024', code: '2A', type: 'Initial Consultation', subtype: 'Service Fee', totalAcc: '4200.00', adjustments: '-', charges: '-', payments: '-', balance: '-', reference: 'SF-2024-089', notes: 'Consultation and treatment planning.' },
      { date: '10-15-2024', code: 'P', type: 'Insurance Coverage', subtype: 'Anthem Payment', totalAcc: '-', adjustments: '-', charges: '-', payments: '(850.00)', balance: '-', reference: 'ANT-2024-3301', notes: 'Partial coverage from Anthem Bluecross.' },
      { date: 'Nov 20, 2024', code: '4', type: 'Monthly Payment', subtype: 'Patient Payment', totalAcc: '-', adjustments: '-', charges: '350.00', payments: '(350.00)', balance: '0.00', reference: 'XXXX-4156', notes: 'Monthly payment via credit card.' }
    ]
  },
  'Molina Healthcare': {
    subscriber: 'Patrick Jarie',
    metrics: [
      { label: 'Production', value: '$3800.00', dot: 'bg-green-400', amount: '$3.80K' },
      { label: 'Collection', value: '$2100.00', dot: 'bg-red-300', amount: '$2.10K' },
      { label: 'Adjustment', value: '$450.00', dot: 'bg-amber-300', amount: '$0.45K' },
      { label: 'A/R', value: '$650.00', dot: 'bg-blue-300', amount: '$0.65K' },
      { label: 'To be Charged', value: '$275.00', dot: 'bg-rose-200', amount: '$0.28K', highlight: 'text-rose-500' },
      { label: 'Overdue', value: '$50.00', dot: 'bg-purple-200', amount: '$0.05K', highlight: 'text-rose-500' }
    ],
    cards: [
      { gradient: 'from-[#ffeb9b] to-[#f6d95c]', amount: '$190.00', card: '5523', start: '08/10/2024', end: '09/10/2025', payments: '5 Payments Done' },
      { gradient: 'from-[#4d4f5c] to-[#262731]', amount: '$275.00', card: '7641', start: '07/25/2024', end: '08/25/2025', payments: '4 Payments Done' },
      { gradient: 'from-purple-400 to-purple-600', amount: '$1850.00', card: '3392', start: '10/05/2024', end: '05/05/2025', payments: '2 Payments Done' }
    ],
    ledger: [
      { date: '07-22-2024', code: '3C', type: 'Treatment Package', subtype: 'Initial Fee', totalAcc: '3800.00', adjustments: '-', charges: '-', payments: '-', balance: '-', reference: 'PKG-2024-445', notes: 'Complete dental treatment package.' },
      { date: '08-30-2024', code: 'M', type: 'Molina Payment', subtype: 'Insurance Coverage', totalAcc: '-', adjustments: '-', charges: '-', payments: '(1250.00)', balance: '-', reference: 'MOL-2024-8822', notes: 'Insurance payment from Molina Healthcare.' },
      { date: 'Oct 25, 2024', code: '5', type: 'Installment', subtype: 'Monthly Charge', totalAcc: '-', adjustments: '-', charges: '275.00', payments: '(225.00)', balance: '50.00', reference: 'XXXX-7641', notes: 'Partial payment received, $50 overdue.' }
    ]
  }
};

export const quickActions: QuickAction[] = [
  { label: 'Claim', description: 'Short Description', coreIcon: cilDollar },
  { label: 'Account Detail', description: 'Short Description', reactIcon: CiBank }
];
