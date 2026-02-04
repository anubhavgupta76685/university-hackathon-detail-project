
import React, { useState } from 'react';
import { CollegeEvent } from '../types.ts';

interface EventDetailsProps {
  event: CollegeEvent;
  isRegistered: boolean;
  onRegister: () => void;
  onUnregister: () => void;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, isRegistered, onRegister, onUnregister, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (isRegistered) onUnregister();
    else onRegister();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-xl transition-all duration-500">
      <div className="bg-white w-full max-w-6xl h-full sm:h-auto sm:max-h-[94vh] overflow-y-auto relative animate-in slide-in-from-bottom-12 sm:rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.25)] border border-white/20">
        
        {/* Banner Section */}
        <div className="relative h-[40vh] sm:h-[500px] w-full">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
          
          {/* Top Actions */}
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
             <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-[10px] font-black uppercase tracking-widest">
                {event.type}
             </div>
             <button 
                onClick={onClose}
                className="p-3 bg-white hover:bg-slate-50 rounded-full text-slate-900 transition-all shadow-xl hover:rotate-90"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
          </div>
          
          <div className="absolute bottom-12 left-8 right-8 lg:left-16 lg:right-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
             <div className="max-w-3xl">
                <h2 className="text-4xl sm:text-6xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl mb-4">{event.title}</h2>
                <div className="flex flex-wrap gap-4">
                   <div className="flex items-center space-x-2 text-white/80 font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-sm">{event.date}</span>
                   </div>
                   <div className="flex items-center space-x-2 text-white/80 font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                      <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                      <span className="text-sm">{event.location}</span>
                   </div>
                </div>
             </div>
             
             <button 
                onClick={handleAction}
                disabled={loading}
                className={`px-12 py-5 rounded-[2rem] font-black text-xl transition-all shadow-2xl active:scale-95 flex items-center justify-center min-w-[240px] h-20 ${
                  loading ? 'bg-slate-400 text-white' :
                  isRegistered 
                  ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-400/40'
                }`}
              >
                {loading ? (
                  <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  isRegistered ? 'Withdraw' : 'Register Now'
                )}
              </button>
          </div>
        </div>

        <div className="p-8 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-20">
              <section>
                <div className="inline-block px-4 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black uppercase tracking-widest mb-6">Introduction</div>
                <h3 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter">About the Event</h3>
                <p className="text-slate-500 text-xl leading-relaxed font-medium">{event.description}</p>
              </section>

              <section>
                <div className="inline-block px-4 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-black uppercase tracking-widest mb-6">Timeline</div>
                <h3 className="text-4xl font-black text-slate-900 mb-10 tracking-tighter">Event Itinerary</h3>
                <div className="grid gap-4">
                  {event.schedule.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-8 rounded-[2rem] border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all group">
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center space-x-6">
                             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600 font-black text-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                               {item.time.split(' ')[0]}
                             </div>
                             <div>
                                <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{item.activity}</h4>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{item.venue}</p>
                             </div>
                          </div>
                          <div className="hidden sm:block">
                             <svg className="w-6 h-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-slate-950 p-12 rounded-[3rem] text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
                <h3 className="text-3xl font-black mb-10 tracking-tight flex items-center">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 20.944a11.955 11.955 0 01-8.618-3.04m12.726-1.2h.01" /></svg>
                  </div>
                  Guidelines & Entry
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {event.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start space-x-4">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                      <p className="text-slate-300 font-medium leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-10">
              <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Admin Details</h4>
                 <div className="space-y-8">
                    <div className="flex items-center space-x-5">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       </div>
                       <div>
                         <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Time Remaining</div>
                         <div className="text-lg font-black text-slate-900">Ends in 5 Days</div>
                       </div>
                    </div>
                    <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                       <div className="text-[10px] text-rose-400 font-black uppercase tracking-widest mb-1">Closing Date</div>
                       <div className="text-lg font-black text-rose-600 leading-none">{event.registrationDeadline}</div>
                    </div>
                 </div>
              </div>

              <div>
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Event Leads</h4>
                 <div className="grid gap-4">
                    {event.coordinators.map((c, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                          {c.name.charAt(0)}
                        </div>
                        <div className="ml-5">
                           <div className="text-sm font-black text-slate-900">{c.name}</div>
                           <div className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">{c.role}</div>
                           <div className="text-xs text-slate-400 font-bold mt-1">{c.email}</div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <button className="w-full py-5 bg-white border-2 border-slate-100 rounded-[2rem] text-slate-900 font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm active:scale-95">
                 <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                 Share Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
