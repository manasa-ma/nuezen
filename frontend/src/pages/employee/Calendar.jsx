import React from 'react';
import Layout from '../../components/layout/Navbar';
import { Calendar as LucideCalendar, Info } from 'lucide-react';

export default function TeamCalendarPage() {
  const events = [
    { date: "Aug 15", title: "Independence Day", type: "Holiday" },
    { date: "Aug 20", title: "New Joiner: John", type: "Onboarding" },
    { date: "Aug 28", title: "Foundation Day", type: "Event" }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-slate-800 mb-8">Team Calendar</h1>
        
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8 text-blue-600">
             <LucideCalendar size={32} />
             <h2 className="text-xl font-bold">Upcoming Organization Events</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((ev, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-md transition-all">
                <p className="text-blue-600 font-black text-sm uppercase tracking-tighter mb-1">{ev.date}</p>
                <h3 className="font-bold text-slate-800 text-lg mb-4">{ev.title}</h3>
                <span className="px-3 py-1 bg-white rounded-full text-[10px] font-black text-slate-400 uppercase border border-slate-200">
                  {ev.type}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-3xl flex items-start gap-4">
             <Info className="text-blue-500 mt-1" size={20} />
             <p className="text-blue-800 text-sm font-medium leading-relaxed">
               The interactive calendar is currently displaying verified company events and approved leaves. 
               New onboarding schedules are automatically synced from the HR portal.
             </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
