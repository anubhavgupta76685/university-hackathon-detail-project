
import React from 'react';
import { CollegeEvent, EventType } from '../types';

interface EventCardProps {
  event: CollegeEvent;
  onViewDetails: (event: CollegeEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
  const getTypeStyles = (type: EventType) => {
    switch (type) {
      case EventType.HACKATHON: return 'bg-violet-500/10 text-violet-600 border-violet-200 group-hover:shadow-violet-200';
      case EventType.WORKSHOP: return 'bg-blue-500/10 text-blue-600 border-blue-200 group-hover:shadow-blue-200';
      case EventType.CULTURAL: return 'bg-rose-500/10 text-rose-600 border-rose-200 group-hover:shadow-rose-200';
      case EventType.SPORTS: return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 group-hover:shadow-emerald-200';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-200 group-hover:shadow-slate-200';
    }
  };

  return (
    <div 
      onClick={() => onViewDetails(event)}
      className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border backdrop-blur-md ${getTypeStyles(event.type)}`}>
            {event.type}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">
          {event.title}
        </h3>
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400">
          <div className="flex items-center space-x-1.5">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-xs font-bold tracking-tight">
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
            <span className="text-xs font-bold tracking-tight truncate max-w-[120px]">
              {event.location.split(',')[0]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
