import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Navbar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import API from '../../api/axios';

export default function HRCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        // Fetch leaves to show on calendar
        const leavesRes = await API.get('/hr/leaves');
        const employeesRes = await API.get('/hr/employees');

        const leaveEvents = leavesRes.data
          .filter(l => l.status === 'Approved')
          .map(l => ({
            title: `Leave: ${l.userName}`,
            start: new Date().toISOString().split('T')[0], // Mocking today for demo
            backgroundColor: '#ef4444',
            borderColor: '#ef4444'
          }));

        const onboardingEvents = employeesRes.data.map(e => ({
          title: `Onboard: ${e.name}`,
          start: e.createdAt.split('T')[0],
          backgroundColor: '#3b82f6',
          borderColor: '#3b82f6'
        }));

        setEvents([...leaveEvents, ...onboardingEvents]);
      } catch (err) {
        console.error("Calendar fetch error");
      }
    };
    fetchCalendarData();
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Organization Calendar</h1>
        <p className="text-slate-500 font-medium">Tracking team leaves, holidays, and onboarding schedules.</p>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="65vh"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
        />
      </div>
    </Layout>
  );
}