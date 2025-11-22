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

export type LedgerEntry = {
  date: string;
  code: string;
  type: string;
  subtype: string;
  totalAcc: string;
  adjustments: string;
  charges: string;
  payments: string;
  balance: string;
  reference?: string;
  notes?: string;
};

export type AutoPaymentCard = {
  gradient: string;
  amount: string;
  card: string;
  start: string;
  end: string;
  payments: string;
};

export type QuickAction =
  | { label: string; description: string; coreIcon: typeof cilDollar; reactIcon?: undefined; icon?: undefined }
  | { label: string; description: string; reactIcon: typeof CiBank; coreIcon?: undefined; icon?: undefined }
  | { label: string; description: string; icon: typeof Building2; coreIcon?: undefined; reactIcon?: undefined };

export type AccountMetric = {
  label: string;
  value: string;
  dot: string;
  amount: string;
  highlight?: string;
};
