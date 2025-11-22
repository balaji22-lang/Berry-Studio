import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AutoPaymentCard } from './types';

interface AutoPaymentsProps {
  displayedCards: AutoPaymentCard[];
  currentIndex: number;
  autoCards: AutoPaymentCard[];
  setSelectedCard: (card: AutoPaymentCard) => void;
  isSliding: boolean;
  showNextCardSet: () => void;
  handleAddSubscription: () => void;
}

export default function AutoPayments({
  displayedCards,
  currentIndex,
  autoCards,
  setSelectedCard,
  isSliding,
  showNextCardSet,
  handleAddSubscription
}: AutoPaymentsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-[0px_12px_45px_rgba(15,23,42,0.05)] border border-white dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Auto Payments</h3>
        <button onClick={handleAddSubscription} className="px-5 py-2 bg-black text-white text-xs font-semibold rounded-full hover:bg-gray-900 transition">Add Subscription</button>
      </div>
      <div className="relative">
        <div className={`hide-scrollbar overflow-x-hidden`}>
          <div 
            className="card-container"
          >
            {displayedCards.map((card, index) => (
              <div
                key={`${card.amount}-${card.gradient}-${(currentIndex + index) % autoCards.length}`}
                onClick={() => setSelectedCard(card)}
                className={`auto-card w-[304px] h-[184px] bg-gradient-to-br ${card.gradient} rounded-2xl p-4 text-white flex flex-col justify-between shadow-lg cursor-pointer transition-transform duration-200 ${
                  isSliding ? 'smooth-slide' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] opacity-70">Upto</div>
                    <div className="text-2xl font-semibold">{card.amount}</div>
                  </div>
                  <span className="px-3 py-0.5 bg-white/90 text-green-600 rounded-full text-[11px] font-semibold">Active</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      <span className="w-3 h-3 rounded-full bg-red-400"></span>
                      <span className="w-3 h-3 rounded-full bg-orange-300 -ml-1.5 border border-white/30"></span>
                    </div>
                    <span className="tracking-[0.25em] text-sm">•••• {card.card}</span>
                  </div>
                  <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] opacity-70">
                    <div>
                      <div className="mb-1">Start on</div>
                      <div className="text-white font-semibold normal-case tracking-normal">{card.start}</div>
                    </div>
                    <div className="text-right">
                      <div className="mb-1">End on</div>
                      <div className="text-white font-semibold normal-case tracking-normal">{card.end}</div>
                    </div>
                  </div>
                  <div className="text-[11px] opacity-80">{card.payments}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-white via-white/70 to-transparent"></div>
        <button
          className="w-12 h-12 rounded-full bg-white/70 shadow flex items-center justify-center hover:bg-white transition absolute top-1/2 -translate-y-1/2 right-4 transform hover:scale-105 active:scale-95 duration-300 ease-in-out"
          onClick={showNextCardSet}
          aria-label="Show next auto payment card"
        >
          <ChevronRight size={20} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}
