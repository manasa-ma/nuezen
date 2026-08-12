import React from 'react';
import { Loader2, Inbox } from 'lucide-react';

export const LoadingState = () => (
  <div className="flex flex-col items-center justify-center p-20 w-full">
    <Loader2 className="text-blue-600 animate-spin mb-4" size={40} />
    <p className="text-slate-500 font-medium animate-pulse">Fetching records...</p>
  </div>
);

export const EmptyState = ({ message = "No records found" }) => (
  <div className="flex flex-col items-center justify-center p-16 w-full border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
      <Inbox className="text-slate-300" size={32} />
    </div>
    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{message}</p>
  </div>
);