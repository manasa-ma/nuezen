import React from 'react';
import Layout from '../../components/layout/Navbar';
import FullCalendar from '@fullcalendar/react';
import daygridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const CompanyCalendar = () => {
  const events = [
    { title: 'Independence Day', start: '2025-08-15', backgroundColor: '#ef4444' },
    { title: 'New Hire: John', start: '2025-08-12', backgroundColor: '#3b82f6' },
    { title: 'Leave: Sarah', start: '2025-08-14', end: '2025-08-16', backgroundColor: '#f59e0b' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Company Calendar</h1>
        <p className="text-slate-500">Upcoming holidays and team schedules.</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <FullCalendar
          plugins={[daygridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="70vh"
        />
      </div>
    </Layout>
  );
};

export default CompanyCalendar;