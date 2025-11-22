import { Fragment, useMemo, useState, useEffect, useRef } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronLeft,
  Settings,
  User,
  X,
  Moon,
  Sun
} from 'lucide-react';
import CIcon from '@coreui/icons-react';
import { cilDollar } from '@coreui/icons';
import { CiBank } from 'react-icons/ci';
import { FaArrowRight } from 'react-icons/fa';

import SidebarNav from './SidebarNav';
import AccountSummary from './AccountSummary';
import AutoPayments from './AutoPayments';
import LedgerTable from './LedgerTable';
import { generateWaterfallData } from './utils';
import { 
  patientDetails, 
  ledgerData, 
  autoPaymentCards, 
  accountMetrics, 
  insuranceData, 
  quickActions 
} from './data';
import { LedgerEntry, AutoPaymentCard } from './types';

// Calculate cumulative values for waterfall
function BerryStudioDashboard() {
  const [activeTab, setActiveTab] = useState('Ledger');
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [selectedInsurance, setSelectedInsurance] = useState('Delta Dental of CA');
  const [currentMetrics, setCurrentMetrics] = useState(insuranceData['Delta Dental of CA'].metrics);
  const [autoCards, setAutoCards] = useState(insuranceData['Delta Dental of CA'].cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [profileImage, setProfileImage] = useState<string | null>(() => {
    return localStorage.getItem('profileImage');
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAccountDetailsOpen, setIsAccountDetailsOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
   
  // Calculate waterfall positions
  // Calculate waterfall positions and max value
  const { bars: waterfallBars, maxValue } = useMemo(() => {
    const currentWaterfallData = generateWaterfallData(currentMetrics);
    let runningTotal = 0;
    let peakValue = 0;

    // First pass: Calculate running totals and find peak value
    const barsWithTotals = currentWaterfallData.map((item, index) => {
      let barStart, barHeight, barBottom, currentTotal;
      
      if (index === 0 || item.type === 'total') {
        barStart = 0;
        barHeight = item.amount;
        barBottom = 0;
        currentTotal = item.amount;
        runningTotal = item.amount;
      } else {
        barStart = runningTotal;
        barHeight = Math.abs(item.amount);
        barBottom = item.amount > 0 ? runningTotal : runningTotal + item.amount;
        currentTotal = runningTotal + item.amount;
        runningTotal += item.amount;
      }

      // Track peak value for scaling (check both start and end of bar)
      peakValue = Math.max(peakValue, barBottom + barHeight);
      
      return { ...item, barStart, barHeight, barBottom, currentTotal };
    });

    // Round up max value to nearest 1000 for nice grid lines
    const calculatedMax = Math.ceil(peakValue / 1000) * 1000 || 1000;

    // Second pass: Normalize to percentages
    const normalizedBars = barsWithTotals.map(item => ({
      ...item,
      barBottom: (item.barBottom / calculatedMax) * 100,
      barHeight: (item.barHeight / calculatedMax) * 100,
      previousTotal: item.barStart,
      isNegative: item.amount < 0
    }));

    return { bars: normalizedBars, maxValue: calculatedMax };
  }, [currentMetrics]);
  
  const showNextCardSet = () => {
    setIsSliding(true);
    setCurrentIndex(prev => (prev + 1) % autoCards.length);
    setTimeout(() => {
      setIsSliding(false);
    }, 400);
  };

  // Get the current set of 3 cards to display
  const displayedCards = [
    autoCards[currentIndex],
    autoCards[(currentIndex + 1) % autoCards.length],
    autoCards[(currentIndex + 2) % autoCards.length]
  ];

  const pills = useMemo(() => ['Related Parties', 'Insurance', 'Tasks', 'Tx Plan', 'Forms', 'Ledger', 'Charting'], []);

  const toggleRow = (index: number) => {
    setExpandedRows(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Note editing state and functions
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [editedNote, setEditedNote] = useState('');
  const [ledgerEntries, setLedgerEntries] = useState(ledgerData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [editedCardData, setEditedCardData] = useState<AutoPaymentCard | null>(null);
  const [selectedCard, setSelectedCard] = useState<AutoPaymentCard | null>(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardData, setNewCardData] = useState<AutoPaymentCard>({
    gradient: 'from-[#7ec7ff] to-[#1d99ff]',
    amount: '',
    card: '',
    start: '',
    end: '',
    payments: '0 Payments Done'
  });

  const handleAddSubscription = () => {
    setIsAddingCard(true);
    setNewCardData({
      gradient: 'from-[#7ec7ff] to-[#1d99ff]',
      amount: '',
      card: '',
      start: '',
      end: '',
      payments: '0 Payments Done'
    });
  };

  const handleSaveNewCard = () => {
    if (newCardData.amount && newCardData.card) {
      setAutoCards(prev => [...prev, newCardData]);
      setIsAddingCard(false);
    }
  };

  const startEditingNote = (index: number, currentNote: string) => {
    setEditingNoteIndex(index);
    setEditedNote(currentNote);
  };

  const saveNote = (index: number) => {
    setLedgerEntries(prev => prev.map((entry, i) => 
      i === index ? { ...entry, notes: editedNote } : entry
    ));
    setEditingNoteIndex(null);
    setEditedNote('');
  };

  const cancelEdit = () => {
    setEditingNoteIndex(null);
    setEditedNote('');
  };

  const handleStartEditCard = () => {
    setIsEditingCard(true);
    setEditedCardData(selectedCard);
  };

  const handleSaveCard = () => {
    if (editedCardData && selectedCard) {
      setAutoCards(prev => prev.map(card => 
        card.card === selectedCard.card ? editedCardData : card
      ));
      setSelectedCard(editedCardData);
      setIsEditingCard(false);
      setEditedCardData(null);
    }
  };

  const handleCancelEditCard = () => {
    setIsEditingCard(false);
    setEditedCardData(null);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
    setPreviewImage(null); // Reset preview when opening modal
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String); // Set preview, not the actual profile image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmUpload = () => {
    if (previewImage) {
      setProfileImage(previewImage);
      localStorage.setItem('profileImage', previewImage);
      setPreviewImage(null);
      setIsProfileOpen(false);
    }
  };

  const handleCancelUpload = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveProfileImage = () => {
    setProfileImage(null);
    setPreviewImage(null);
    localStorage.removeItem('profileImage');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const [isAddingLedger, setIsAddingLedger] = useState(false);
  const [newLedgerEntry, setNewLedgerEntry] = useState<LedgerEntry>({
    date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
    code: '',
    type: '',
    subtype: '',
    totalAcc: '-',
    adjustments: '-',
    charges: '-',
    payments: '-',
    balance: '-',
    reference: '',
    notes: ''
  });

  const handleAddLedger = () => {
    setIsAddingLedger(true);
    // Reset form with today's date
    setNewLedgerEntry({
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
      code: '',
      type: '',
      subtype: '',
      totalAcc: '-',
      adjustments: '-',
      charges: '-',
      payments: '-',
      balance: '-',
      reference: '',
      notes: ''
    });
  };

  const handleSaveLedger = () => {
    // Basic validation
    if (!newLedgerEntry.type) return;

    // Calculate balance based on the last entry if possible, or just use what's entered
    // For now, we'll just append it. In a real app, we'd calculate the new balance.
    // Let's try to calculate a running balance from the last entry in the current list
    const parseAmount = (val: string) => {
      if (!val || val === '-') return 0;
      const cleanVal = val.replace(/[$,()]/g, '');
      const num = parseFloat(cleanVal);
      return isNaN(num) ? 0 : num;
    };

    const lastBalance = parseAmount(ledgerEntries[ledgerEntries.length - 1]?.balance || '0');
    const charges = parseAmount(newLedgerEntry.charges);
    const payments = parseAmount(newLedgerEntry.payments);
    const adjustments = parseAmount(newLedgerEntry.adjustments);
    
    let newBalance = lastBalance + charges - payments - adjustments;
    
    const formattedEntry = {
      ...newLedgerEntry,
      charges: charges > 0 ? charges.toFixed(2) : '-',
      payments: payments > 0 ? `(${payments.toFixed(2)})` : '-',
      adjustments: adjustments > 0 ? adjustments.toFixed(2) : '-',
      balance: newBalance.toFixed(2)
    };

    // Update Metrics
    const formatCurrency = (val: number) => '$' + val.toFixed(2);
    const formatK = (val: number) => '$' + (val / 1000).toFixed(2) + 'K';

    const newMetrics = currentMetrics.map(m => {
      let val = parseFloat(m.value.replace(/[$,]/g, ''));
      if (isNaN(val)) val = 0; // Safety check

      if (m.label === 'Production') val += charges;
      if (m.label === 'Collection') val += payments;
      if (m.label === 'Adjustment') val += adjustments;
      if (m.label === 'A/R') val = val + charges - payments - adjustments;
      
      return {
        ...m,
        value: formatCurrency(val),
        amount: formatK(val)
      };
    });

    setCurrentMetrics(newMetrics);
    insuranceData[selectedInsurance].metrics = newMetrics;

    setLedgerEntries(prev => [formattedEntry, ...prev]); // Add to top
    setIsAddingLedger(false);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#9AD29D_-25%,#ffffff_400px)] dark:bg-none dark:bg-slate-950 flex">  
      {/* Add Ledger Modal */}
      {isAddingLedger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsAddingLedger(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-2xl m-4 shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsAddingLedger(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add Ledger Entry</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Date</label>
                <input 
                  type="text" 
                  value={newLedgerEntry.date}
                  onChange={e => setNewLedgerEntry({...newLedgerEntry, date: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 font-semibold focus:ring-2 focus:ring-black/5 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Code</label>
                <input 
                  type="text" 
                  value={newLedgerEntry.code}
                  onChange={e => setNewLedgerEntry({...newLedgerEntry, code: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 font-semibold focus:ring-2 focus:ring-black/5 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Transaction Type</label>
                <input 
                  type="text" 
                  value={newLedgerEntry.type}
                  onChange={e => setNewLedgerEntry({...newLedgerEntry, type: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 font-semibold focus:ring-2 focus:ring-black/5 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Subtype</label>
                <input 
                  type="text" 
                  value={newLedgerEntry.subtype}
                  onChange={e => setNewLedgerEntry({...newLedgerEntry, subtype: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 font-semibold focus:ring-2 focus:ring-black/5 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Charges</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={newLedgerEntry.charges === '-' ? '' : newLedgerEntry.charges}
                  onChange={e => setNewLedgerEntry({...newLedgerEntry, charges: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 font-semibold focus:ring-2 focus:ring-black/5 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Payments</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={newLedgerEntry.payments === '-' ? '' : newLedgerEntry.payments}
                  onChange={e => setNewLedgerEntry({...newLedgerEntry, payments: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 font-semibold focus:ring-2 focus:ring-black/5 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Adjustments</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={newLedgerEntry.adjustments === '-' ? '' : newLedgerEntry.adjustments}
                  onChange={e => setNewLedgerEntry({...newLedgerEntry, adjustments: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 font-semibold focus:ring-2 focus:ring-black/5 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Reference</label>
                <input 
                  type="text" 
                  value={newLedgerEntry.reference}
                  onChange={e => setNewLedgerEntry({...newLedgerEntry, reference: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 font-semibold focus:ring-2 focus:ring-black/5 outline-none transition"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Notes</label>
                <textarea 
                  value={newLedgerEntry.notes}
                  onChange={e => setNewLedgerEntry({...newLedgerEntry, notes: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 font-semibold focus:ring-2 focus:ring-black/5 outline-none transition min-h-[80px]"
                />
              </div>
            </div>

            <button 
              onClick={handleSaveLedger}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors mt-6"
            >
              Add Entry
            </button>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {isAddingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsAddingCard(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md m-4 shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsAddingCard(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add Subscription</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Amount</label>
                <input 
                  type="text" 
                  placeholder="$0.00"
                  value={newCardData.amount}
                  onChange={e => setNewCardData({...newCardData, amount: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-semibold focus:ring-2 focus:ring-black/5 outline-none transition"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Card Number (Last 4)</label>
                <input 
                  type="text" 
                  placeholder="1234"
                  maxLength={4}
                  value={newCardData.card}
                  onChange={e => setNewCardData({...newCardData, card: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-semibold focus:ring-2 focus:ring-black/5 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Start Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/DD/YYYY"
                    value={newCardData.start}
                    onChange={e => setNewCardData({...newCardData, start: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-semibold focus:ring-2 focus:ring-black/5 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">End Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/DD/YYYY"
                    value={newCardData.end}
                    onChange={e => setNewCardData({...newCardData, end: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-semibold focus:ring-2 focus:ring-black/5 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Card Color</label>
                <div className="flex gap-3">
                  {[
                    'from-[#7ec7ff] to-[#1d99ff]',
                    'from-[#4d4f5c] to-[#262731]',
                    'from-[#ffeb9b] to-[#f6d95c]',
                    'from-purple-400 to-purple-600',
                    'from-pink-400 to-rose-500'
                  ].map(gradient => (
                    <button
                      key={gradient}
                      onClick={() => setNewCardData({...newCardData, gradient})}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} ring-2 ring-offset-2 ${newCardData.gradient === gradient ? 'ring-black' : 'ring-transparent'} transition-all`}
                    />
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSaveNewCard}
                className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors mt-4"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md m-4 shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Appearance</h4>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-orange-100 text-orange-600'}`}>
                      {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Dark Mode</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Adjust the appearance</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}
                  >
                    <span 
                      className={`absolute top-1 left-1 bg-white rounded-full w-6 h-6 shadow-sm transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsProfileOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md m-4 shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsProfileOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Picture</h3>
            
            <div className="space-y-6">
              {/* Profile Image Preview */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-800 flex items-center justify-center border-4 border-gray-200 dark:border-slate-700">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Current Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={48} className="text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  {profileImage && !previewImage && (
                    <button
                      onClick={handleRemoveProfileImage}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                      title="Remove profile picture"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {previewImage ? 'Preview - Click Upload to Save' : profileImage ? 'Change Profile Picture' : 'Upload Profile Picture'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG or GIF (MAX. 5MB)
                  </div>
                </div>
              </div>

              {/* Upload Button */}
              <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
              />
              
              {!previewImage ? (
                <>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Choose Image
                  </button>

                  {profileImage && (
                    <button 
                      onClick={handleRemoveProfileImage}
                      className="w-full py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Remove Picture
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button 
                    onClick={handleConfirmUpload}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={20} />
                    Upload Picture
                  </button>

                  <button 
                    onClick={handleCancelUpload}
                    className="w-full py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Account Details Modal */}
      {isAccountDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsAccountDetailsOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-2xl m-4 shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsAccountDetailsOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Patient Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800 pb-2">Patient Information</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Full Name</div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white">Carl S Griffith</div>
                  </div>
                  {patientDetails.map((detail) => (
                    <div key={detail.label}>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{detail.label}</div>
                      <div className="text-base font-semibold text-gray-900 dark:text-white">{detail.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insurance & Financial Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800 pb-2">Insurance Information</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Provider</div>
                      <div className="text-base font-semibold text-gray-900 dark:text-white">{selectedInsurance}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Subscriber</div>
                      <div className="text-base font-semibold text-gray-900 dark:text-white">{insuranceData[selectedInsurance].subscriber}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800 pb-2">Financial Summary</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {currentMetrics.slice(0, 4).map((metric) => (
                      <div key={metric.label} className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{metric.label}</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setIsAccountDetailsOpen(false)}
                  className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Details Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedCard(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md m-4 shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{isEditingCard ? 'Edit Card' : 'Card Details'}</h3>
            
            <div className={`w-full h-48 bg-gradient-to-br ${selectedCard.gradient} rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg mb-8`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] opacity-70">Upto</div>
                  <div className="text-3xl font-semibold">
                    {isEditingCard ? (
                      <input 
                        type="text"
                        value={editedCardData?.amount || ''}
                        onChange={e => setEditedCardData(prev => prev ? ({ ...prev, amount: e.target.value }) : null)}
                        className="bg-white/20 border-none text-white placeholder-white/50 rounded px-2 py-1 w-32 focus:ring-2 focus:ring-white/50 outline-none"
                      />
                    ) : (
                      selectedCard.amount
                    )}
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/90 text-green-600 rounded-full text-xs font-bold">Active</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex">
                    <span className="w-4 h-4 rounded-full bg-red-400"></span>
                    <span className="w-4 h-4 rounded-full bg-orange-300 -ml-2 border border-white/30"></span>
                  </div>
                  <span className="tracking-[0.25em] text-lg">•••• {selectedCard.card}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Start Date</div>
                  {isEditingCard ? (
                    <input 
                      type="text"
                      value={editedCardData?.start || ''}
                      onChange={e => setEditedCardData(prev => prev ? ({ ...prev, start: e.target.value }) : null)}
                      className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-black/10 outline-none"
                    />
                  ) : (
                    <div className="text-gray-900 dark:text-white font-bold">{selectedCard.start}</div>
                  )}
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">End Date</div>
                  {isEditingCard ? (
                    <input 
                      type="text"
                      value={editedCardData?.end || ''}
                      onChange={e => setEditedCardData(prev => prev ? ({ ...prev, end: e.target.value }) : null)}
                      className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-black/10 outline-none"
                    />
                  ) : (
                    <div className="text-gray-900 dark:text-white font-bold">{selectedCard.end}</div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Status</div>
                  <div className="text-gray-900 dark:text-white font-bold">{selectedCard.payments}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                  <CheckCircle2 size={20} />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {isEditingCard ? (
                  <>
                    <button 
                      onClick={handleSaveCard}
                      className="flex-1 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button 
                      onClick={handleCancelEditCard}
                      className="flex-1 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleStartEditCard}
                      className="flex-1 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                    >
                      Edit Card
                    </button>
                    <button className="flex-1 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      View History
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 px-6 py-8 flex-col">
        <div className="mb-10">
          <div className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">BerryStudio</div>
        </div>
        <SidebarNav />
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-6 relative">
          {/* Back button moved to top-left corner of main container */}
          <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm absolute top-0 left-6" style={{ marginLeft: '-248px' }}>
            <ChevronLeft size={18} />
            <span>Back</span>
          </button>
          {/* Top right elements positioned absolutely */}
          <div className="flex items-center gap-3 absolute top-0 right-6" style={{ marginTop: 'inherit', marginRight: '-247px' }}>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 transition-colors"
            >
              <Settings size={18} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-xl border border-gray-100 relative">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={handleProfileClick}
              className="w-9 h-9 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden hover:ring-2 hover:ring-offset-2 hover:ring-black/10 dark:hover:ring-white/10 transition-all relative cursor-pointer"
              title="Profile Picture"
            >
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} className="text-gray-400 dark:text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </button>
          </div>
          <section className="px-8 py-6 space-y-6">
            <div className="flex items-start gap-4">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#ff5d5f] text-white font-semibold text-lg flex items-center justify-center">CG</div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Carl S Griffith</h1>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs rounded-full">Female • 23y, 10m</span>
                </div>
                <div className="flex flex-wrap gap-6 text-sm">
                  {patientDetails.map(detail => (
                    <div key={detail.label} className="flex items-center gap-2 text-gray-600">
                      <detail.icon size={16} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {pills.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-xs font-semibold rounded-full transition-all ${
                    activeTab === tab ? 'bg-black dark:bg-white text-white dark:text-black shadow-md' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          <section className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="w-full lg:w-64 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-[0px_15px_55px_rgba(15,23,42,0.05)]" style={{ width: '240px', height: '480px' }}>
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-3">Overview</div>
                <div className="text-base font-semibold text-gray-900 dark:text-white mb-4">Account Summary</div>

                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-2">Patient Account</div>
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Christopher</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Father</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">George Washington</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Mother</div>
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-2">Insurance Account</div>
                <div className="space-y-2">
                    <button 
                    onClick={() => {
                      setSelectedInsurance('Delta Dental of CA');
                      setCurrentMetrics(insuranceData['Delta Dental of CA'].metrics);
                      setAutoCards(insuranceData['Delta Dental of CA'].cards);
                      setLedgerEntries(insuranceData['Delta Dental of CA'].ledger);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-colors ${
                      selectedInsurance === 'Delta Dental of CA' 
                        ? 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700' 
                        : 'bg-transparent border-transparent hover:bg-gray-50/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Delta Dental of CA</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Christopher</div>
                  </button>
                    <button 
                    onClick={() => {
                      setSelectedInsurance('Anthem Bluecross');
                      setCurrentMetrics(insuranceData['Anthem Bluecross'].metrics);
                      setAutoCards(insuranceData['Anthem Bluecross'].cards);
                      setLedgerEntries(insuranceData['Anthem Bluecross'].ledger);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-colors ${
                      selectedInsurance === 'Anthem Bluecross' 
                        ? 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700' 
                        : 'bg-transparent border-transparent hover:bg-gray-50/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Anthem Bluecross</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">George Washington</div>
                  </button>
                    <button 
                    onClick={() => {
                      setSelectedInsurance('Molina Healthcare');
                      setCurrentMetrics(insuranceData['Molina Healthcare'].metrics);
                      setAutoCards(insuranceData['Molina Healthcare'].cards);
                      setLedgerEntries(insuranceData['Molina Healthcare'].ledger);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-colors ${
                      selectedInsurance === 'Molina Healthcare' 
                        ? 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700' 
                        : 'bg-transparent border-transparent hover:bg-gray-50/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Molina Healthcare</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Patrick Jarie</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <AccountSummary 
                selectedInsurance={selectedInsurance}
                currentMetrics={currentMetrics}
                maxValue={maxValue}
                waterfallBars={waterfallBars}
              />

              <AutoPayments 
                displayedCards={displayedCards}
                currentIndex={currentIndex}
                autoCards={autoCards}
                setSelectedCard={setSelectedCard}
                isSliding={isSliding}
                showNextCardSet={showNextCardSet}
                handleAddSubscription={handleAddSubscription}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map(action => (
                  <button
                    key={action.label}
                    onClick={() => {
                      if (action.label === 'Account Detail') {
                        setIsAccountDetailsOpen(true);
                      }
                    }}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 flex items-center justify-between text-left shadow-sm hover:shadow-lg transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
                        {action.coreIcon ? (
                          <CIcon icon={action.coreIcon} className="text-gray-600 w-5 h-5" />
                        ) : action.reactIcon ? (
                          <action.reactIcon size={20} className="text-gray-600" />
                        ) : (
                          action.icon && <action.icon size={18} className="text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-base">{action.label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{action.description}</div>
                      </div>
                    </div>
                    {action.label === 'Account Detail' && <FaArrowRight size={16} className="text-gray-400" />}
                  </button>
                ))}
              </div>

              <LedgerTable 
                ledgerEntries={ledgerEntries}
                expandedRows={expandedRows}
                toggleRow={toggleRow}
                editingNoteIndex={editingNoteIndex}
                editedNote={editedNote}
                setEditedNote={setEditedNote}
                saveNote={saveNote}
                cancelEdit={cancelEdit}
                startEditingNote={startEditingNote}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                currentMetrics={currentMetrics}
                handleAddLedger={handleAddLedger}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return <BerryStudioDashboard />;
}