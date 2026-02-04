
import React, { useState, useMemo, useEffect } from 'react';
import { CollegeEvent, EventType, PageView, User } from './types.ts';
import { dataService } from './dataService.ts';
import { authService } from './authService.ts';
import EventCard from './components/EventCard.tsx';
import EventDetails from './components/EventDetails.tsx';
import UniBot from './components/UniBot.tsx';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CollegeEvent | null>(null);
  const [activeFilter, setActiveFilter] = useState<EventType | 'All'>('All');
  const [userRegs, setUserRegs] = useState<string[]>([]);

  // Auth form states
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  const events = useMemo(() => dataService.getEvents(), []);

  useEffect(() => {
    if (user) {
      setUserRegs(dataService.getUserRegistrations());
    } else {
      setUserRegs([]);
    }
  }, [user]);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            e.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || e.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [events, searchQuery, activeFilter]);

  const registeredEventsList = useMemo(() => {
    return events.filter(e => userRegs.includes(e.id));
  }, [events, userRegs]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentPage('home');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = authService.login(authEmail, authPass);
    if (result.success) {
      setUser(result.user || null);
      setCurrentPage('home');
      setAuthEmail('');
      setAuthPass('');
      setAuthError('');
    } else {
      setAuthError(result.message);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = authService.signup(authName, authEmail, authPass);
    if (result.success) {
      setUser(authService.getCurrentUser());
      setCurrentPage('home');
      setAuthName('');
      setAuthEmail('');
      setAuthPass('');
      setAuthError('');
    } else {
      setAuthError(result.message);
    }
  };

  const handleRegisterClick = (id: string) => {
    if (!user) {
      setCurrentPage('login');
      setSelectedEvent(null);
      return;
    }
    dataService.registerForEvent(id);
    setUserRegs(dataService.getUserRegistrations());
  };

  const handleUnregisterClick = (id: string) => {
    dataService.unregisterFromEvent(id);
    setUserRegs(dataService.getUserRegistrations());
  };

  const handleExport = () => {
    dataService.downloadRegistrationsAsCSV();
  };

  const navigateToExplore = (query?: string) => {
    if (query !== undefined) setSearchQuery(query);
    setCurrentPage('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dynamic Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[80] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="glass-card rounded-2xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-6 py-3 flex justify-between items-center transition-all">
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => {setCurrentPage('home'); setSearchQuery('');}}
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
                U
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">UniEvent<span className="text-indigo-600">Hub</span></span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              {[
                { id: 'home', label: 'Home' },
                { id: 'explore', label: 'Explore' }
              ].map(link => (
                <button 
                  key={link.id}
                  onClick={() => setCurrentPage(link.id as PageView)} 
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === link.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  {link.label}
                </button>
              ))}
              
              {user ? (
                <div className="flex items-center ml-4 pl-4 border-l border-slate-100">
                  <button onClick={() => setCurrentPage('registrations')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all mr-2 ${currentPage === 'registrations' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                    My Dashboard
                  </button>
                  <div className="flex items-center bg-slate-100 rounded-full pl-1 pr-4 py-1 space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex flex-col items-start leading-none">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Student</span>
                       <span className="text-xs font-bold text-slate-900">{user.name.split(' ')[0]}</span>
                    </div>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center ml-4 space-x-2">
                  <button onClick={() => setCurrentPage('login')} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600">Log In</button>
                  <button onClick={() => setCurrentPage('signup')} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 hover:-translate-y-0.5 active:translate-y-0">Sign Up</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 pt-24 pb-12">
        {/* PAGE: LOGIN / SIGNUP - Common Glass Wrapper */}
        {(currentPage === 'login' || currentPage === 'signup') && (
          <div className="max-w-md mx-auto mt-12 px-4">
             <div className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"></div>
                <div className="p-10">
                  <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
                    {currentPage === 'login' ? 'Welcome Back' : 'Get Started'}
                  </h2>
                  <p className="text-slate-500 mb-8 font-medium">
                    {currentPage === 'login' ? 'The campus heartbeat is waiting for you.' : 'Join 2,000+ students on the official hub.'}
                  </p>
                  
                  {authError && <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold mb-6 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    <span>{authError}</span>
                  </div>}

                  <form onSubmit={currentPage === 'login' ? handleLoginSubmit : handleSignupSubmit} className="space-y-5">
                    {currentPage === 'signup' && (
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                        <input required type="text" value={authName} onChange={(e) => setAuthName(e.target.value)} className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 border border-transparent focus:border-indigo-200 transition-all font-semibold" placeholder="John Doe" />
                      </div>
                    )}
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                      <input required type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 border border-transparent focus:border-indigo-200 transition-all font-semibold" placeholder="name@college.edu" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
                      <input required type="password" value={authPass} onChange={(e) => setAuthPass(e.target.value)} className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 border border-transparent focus:border-indigo-200 transition-all font-semibold" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95 transition-all mt-4">
                      {currentPage === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                  </form>
                  <p className="text-center mt-8 text-sm text-slate-400 font-bold">
                    {currentPage === 'login' ? "New here?" : "Already a member?"} <button onClick={() => setCurrentPage(currentPage === 'login' ? 'signup' : 'login')} className="text-indigo-600 hover:underline">
                      {currentPage === 'login' ? 'Register Now' : 'Sign In instead'}
                    </button>
                  </p>
                </div>
             </div>
          </div>
        )}

        {/* HOME VIEW - Premium Hero */}
        {currentPage === 'home' && (
          <div className="animate-in fade-in duration-700">
             <section className="relative overflow-hidden pt-12 pb-24">
                <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-10 left-[-5%] w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-[100px] -z-10"></div>
                
                <div className="max-w-7xl mx-auto px-4 text-center">
                   <div className="inline-flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full mb-8 animate-float">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                      </span>
                      <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Live: Fall Semester Hackathons</span>
                   </div>
                   
                   <h1 className="text-6xl sm:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
                     Discover your <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500">Campus Pulse.</span>
                   </h1>
                   
                   <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12 font-medium leading-relaxed">
                     The official digital destination for every workshop, festival, and hackathon happening at your college. Built for students, by students.
                   </p>
                   
                   <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                      <button onClick={() => navigateToExplore()} className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-200 hover:scale-110 active:scale-95 transition-all">
                        Browse Events
                      </button>
                      <button onClick={() => setCurrentPage('signup')} className="w-full sm:w-auto px-12 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-lg border border-slate-200 hover:bg-slate-50 transition-all">
                        Join the Hub
                      </button>
                   </div>
                </div>
             </section>
             
             {/* Dynamic Filter Strip */}
             <div className="max-w-7xl mx-auto px-4 mb-16">
                <div className="flex flex-wrap justify-center gap-3">
                   {['All', ...Object.values(EventType)].map(filter => (
                     <button 
                       key={filter}
                       onClick={() => setActiveFilter(filter as any)}
                       className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeFilter === filter ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-300'}`}
                     >
                       {filter}
                     </button>
                   ))}
                </div>
             </div>

             <section className="max-w-7xl mx-auto px-4 pb-20">
                <div className="flex items-center justify-between mb-12">
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trending Now 🔥</h2>
                   <button onClick={() => navigateToExplore()} className="text-sm font-bold text-indigo-600 hover:underline flex items-center">
                     View All <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                   </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                   {filteredEvents.map(e => (
                     <EventCard key={e.id} event={e} onViewDetails={setSelectedEvent} />
                   ))}
                </div>
             </section>
          </div>
        )}

        {/* EXPLORE VIEW */}
        {currentPage === 'explore' && (
          <div className="max-w-7xl mx-auto px-4 py-10 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Explore Events</h1>
                <p className="text-slate-500 font-medium">Find your next big opportunity across all departments.</p>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, keywords..."
                  className="w-full md:w-80 pl-12 pr-6 py-4 bg-white rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm font-bold"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
            
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredEvents.map(e => (
                  <EventCard key={e.id} event={e} onViewDetails={setSelectedEvent} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">No events found</h3>
                <p className="text-slate-400 font-medium">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        )}

        {/* REGISTRATIONS VIEW - Dashboard style */}
        {currentPage === 'registrations' && (
          <div className="max-w-5xl mx-auto px-4 py-10 animate-in slide-in-from-right-8 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
              <div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Your Dashboard</h1>
                <p className="text-slate-500 font-medium">Managing {userRegs.length} active registrations.</p>
              </div>
              {registeredEventsList.length > 0 && (
                <button 
                  onClick={handleExport}
                  className="group flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-emerald-100 hover:-translate-y-1 active:scale-95"
                >
                  <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <span>Export Report</span>
                </button>
              )}
            </div>

            {registeredEventsList.length > 0 ? (
              <div className="grid gap-6">
                {registeredEventsList.map(e => (
                  <div key={e.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:border-indigo-100 transition-all group">
                    <div className="flex items-center space-x-6 w-full sm:w-auto">
                       <img src={e.imageUrl} className="w-24 h-24 object-cover rounded-3xl" />
                       <div>
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full mb-2 inline-block">{e.type}</span>
                          <h3 className="text-2xl font-extrabold text-slate-900 leading-tight mb-1">{e.title}</h3>
                          <p className="text-sm text-slate-400 font-medium">{e.date} • {e.location}</p>
                       </div>
                    </div>
                    <div className="flex space-x-3 mt-6 sm:mt-0 w-full sm:w-auto">
                       <button onClick={() => setSelectedEvent(e)} className="flex-1 sm:flex-none px-6 py-3 bg-slate-50 text-slate-900 font-black rounded-xl hover:bg-slate-100 transition-all text-sm uppercase tracking-widest">Details</button>
                       <button onClick={() => handleUnregisterClick(e.id)} className="flex-1 sm:flex-none px-6 py-3 bg-rose-50 text-rose-600 font-black rounded-xl hover:bg-rose-100 transition-all text-sm uppercase tracking-widest">Withdraw</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                 <div className="text-6xl mb-6">🎒</div>
                 <h3 className="text-2xl font-black text-slate-900 mb-2">Your backpack is empty</h3>
                 <p className="text-slate-400 font-medium mb-8">Start your campus adventure today.</p>
                 <button onClick={() => setCurrentPage('explore')} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:scale-105 transition-all">Explore Events</button>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedEvent && (
        <EventDetails 
          event={selectedEvent} 
          isRegistered={userRegs.includes(selectedEvent.id)}
          onRegister={() => handleRegisterClick(selectedEvent.id)}
          onUnregister={() => handleUnregisterClick(selectedEvent.id)}
          onClose={() => setSelectedEvent(null)} 
        />
      )}

      <UniBot events={events} />
      
      {/* Dynamic Footer */}
      <footer className="mt-auto py-12 border-t border-slate-100 text-center">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-lg italic">U</div>
              <span className="text-lg font-black tracking-tight text-slate-900 uppercase tracking-widest">UniEvent Hub</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">© 2024 College Cultural & Technical Committee. Built with Gemini AI.</p>
         </div>
      </footer>
    </div>
  );
};

export default App;
