import React, { Fragment } from 'react';
import { ChevronUp, ChevronDown, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { LedgerEntry, AccountMetric } from './types';

interface LedgerTableProps {
  ledgerEntries: LedgerEntry[];
  expandedRows: Record<number, boolean>;
  toggleRow: (index: number) => void;
  editingNoteIndex: number | null;
  editedNote: string;
  setEditedNote: (note: string) => void;
  saveNote: (index: number) => void;
  cancelEdit: () => void;
  startEditingNote: (index: number, note: string) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentMetrics: AccountMetric[];
  handleAddLedger: () => void;
}

export default function LedgerTable({
  ledgerEntries,
  expandedRows,
  toggleRow,
  editingNoteIndex,
  editedNote,
  setEditedNote,
  saveNote,
  cancelEdit,
  startEditingNote,
  currentPage,
  setCurrentPage,
  currentMetrics,
  handleAddLedger
}: LedgerTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0px_25px_80px_rgba(15,23,42,0.08)] border border-white dark:border-slate-800">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Ledger</h3>
        <div className="flex gap-3">
          <button 
            onClick={handleAddLedger}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            Adjust
          </button>
          <button className="px-4 py-2 text-xs font-semibold text-white bg-black rounded-full hover:bg-gray-900">Post Payment</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed" style={{ minWidth: '100%' }}>
          <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
            <tr>
              <th className="px-5 py-4 text-left w-[15%]">
                <div className="text-[10px] font-semibold text-gray-500 tracking-[0.2em] uppercase">Date</div>
              </th>
              <th className="px-5 py-4 text-left w-[25%]">
                <div className="text-[10px] font-semibold text-gray-500 tracking-[0.2em] uppercase">Transaction Type</div>
              </th>
              <th className="px-5 py-4 text-center w-[12%]">
                <div className="text-[10px] font-semibold text-gray-500 tracking-[0.2em] uppercase">Total Acc.</div>
                <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                  {currentMetrics.find(m => m.label === 'Production')?.value}
                </div>
              </th>
              <th className="px-5 py-4 text-center w-[12%]">
                <div className="text-[10px] font-semibold text-gray-500 tracking-[0.2em] uppercase">Adjustments</div>
                <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                  {currentMetrics.find(m => m.label === 'Adjustment')?.value}
                </div>
              </th>
              <th className="px-5 py-4 text-center w-[12%]">
                <div className="text-[10px] font-semibold text-gray-500 tracking-[0.2em] uppercase">+ Charges</div>
                <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                  {(() => {
                    const total = ledgerEntries.reduce((acc, entry) => {
                      const val = entry.charges === '-' ? 0 : parseFloat(entry.charges.replace(/[$,]/g, '') || '0');
                      return acc + (isNaN(val) ? 0 : val);
                    }, 0);
                    return '$' + total.toFixed(2);
                  })()}
                </div>
              </th>
              <th className="px-5 py-4 text-center w-[12%]">
                <div className="text-[10px] font-semibold text-gray-500 tracking-[0.2em] uppercase">+ Payments</div>
                <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                  ({currentMetrics.find(m => m.label === 'Collection')?.value})
                </div>
              </th>
              <th className="px-5 py-4 text-center w-[12%]">
                <div className="text-[10px] font-semibold text-gray-500 tracking-[0.2em] uppercase">= Balance</div>
                <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                  {currentMetrics.find(m => m.label === 'A/R')?.value}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPage === 1 ? (
              ledgerEntries.map((row, index) => (
                <Fragment key={`${row.date}-${index}`}>
                  <tr className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleRow(index)} className="text-gray-400 hover:text-gray-600">
                          {expandedRows[index] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <div>
                          <div className="text-xs font-semibold text-gray-900 dark:text-white">{row.date}</div>
                          <div className="text-[10px] text-gray-400">{row.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs font-semibold text-gray-900 dark:text-white">{row.type}</div>
                      <div className="text-[10px] text-gray-500">{row.subtype}</div>
                    </td>
                    <td className="px-5 py-4 text-center text-xs text-gray-900 dark:text-white">{row.totalAcc}</td>
                    <td className="px-5 py-4 text-center text-xs text-gray-900 dark:text-white">{row.adjustments}</td>
                    <td className="px-5 py-4 text-center text-xs text-gray-900 dark:text-white">{row.charges}</td>
                    <td className="px-5 py-4 text-center text-xs text-gray-900 dark:text-white">{row.payments}</td>
                    <td className="px-5 py-4 text-center text-xs text-gray-900 dark:text-white">{row.balance}</td>
                  </tr>
                  {expandedRows[index] && row.notes && (
                    <tr className="border-b border-gray-50 dark:border-slate-800 bg-gray-50 dark:bg-slate-800">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <div className="text-[10px] text-gray-500 mb-1 tracking-[0.2em] uppercase">Reference Number</div>
                            <div className="text-xs text-gray-900 dark:text-white font-semibold">{row.reference}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-500 mb-1 tracking-[0.2em] uppercase">Notes</div>
                            {editingNoteIndex === index ? (
                              <div className="flex flex-col gap-2">
                                <textarea
                                  value={editedNote}
                                  onChange={(e) => setEditedNote(e.target.value)}
                                  className="text-xs text-gray-900 leading-relaxed border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => saveNote(index)}
                                    className="px-3 py-1 bg-black text-white text-xs rounded-full hover:bg-gray-800"
                                  >
                                    Save
                                  </button>
                                  <button 
                                    onClick={cancelEdit}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start gap-2">
                                <div className="text-xs text-gray-900 dark:text-white flex-1 leading-relaxed">{row.notes}</div>
                                <button 
                                  onClick={() => startEditingNote(index, row.notes || '')}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <Edit size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            ) : (
              // Blank rows for other pages to maintain height
              Array(10).fill(null).map((_, index) => (
                <tr key={`blank-${index}`} className="border-b border-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5"></div>
                      <div>
                        <div className="text-xs font-semibold text-transparent select-none">Blank</div>
                        <div className="text-[10px] text-transparent select-none">Blank</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs font-semibold text-transparent select-none">Blank</div>
                    <div className="text-[10px] text-transparent select-none">Blank</div>
                  </td>
                  <td className="px-5 py-4 text-center text-xs text-transparent select-none">Blank</td>
                  <td className="px-5 py-4 text-center text-xs text-transparent select-none">Blank</td>
                  <td className="px-5 py-4 text-center text-xs text-transparent select-none">Blank</td>
                  <td className="px-5 py-4 text-center text-xs text-transparent select-none">Blank</td>
                  <td className="px-5 py-4 text-center text-xs text-transparent select-none">Blank</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-5 border-t border-gray-100 flex items-center justify-center gap-2">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={`w-8 h-8 flex items-center justify-center text-xs rounded-full transition-colors ${
            currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft size={18} />
        </button>
        
        <div className="flex items-center gap-1 px-2">
          {(() => {
            const totalPages = 10;
            const pages = [];
            
            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
              } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
              } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
              }
            }

            return pages.map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={typeof page !== 'number'}
                className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-full transition-all ${
                  page === currentPage 
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-md' 
                    : typeof page === 'number'
                      ? 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'
                      : 'text-gray-400 cursor-default'
                }`}
              >
                {page}
              </button>
            ));
          })()}
        </div>

        <button 
          onClick={() => setCurrentPage(prev => Math.min(10, prev + 1))}
          disabled={currentPage === 10}
          className={`w-8 h-8 flex items-center justify-center text-xs rounded-full transition-colors ${
            currentPage === 10 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
