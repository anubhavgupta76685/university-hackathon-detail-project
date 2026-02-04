
import { MOCK_EVENTS } from './constants.tsx';
import { CollegeEvent } from './types.ts';
import { authService } from './authService.ts';

const REG_PREFIX = 'unievent_regs_';

export const dataService = {
  getEvents: (): CollegeEvent[] => {
    return MOCK_EVENTS;
  },

  getEventById: (id: string): CollegeEvent | undefined => {
    return MOCK_EVENTS.find(e => e.id === id);
  },

  getUserRegistrations: (): string[] => {
    const user = authService.getCurrentUser();
    if (!user) return [];
    const data = localStorage.getItem(REG_PREFIX + user.email);
    return data ? JSON.parse(data) : [];
  },

  registerForEvent: (eventId: string): boolean => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    
    const regs = dataService.getUserRegistrations();
    if (!regs.includes(eventId)) {
      regs.push(eventId);
      localStorage.setItem(REG_PREFIX + user.email, JSON.stringify(regs));
    }
    return true;
  },

  unregisterFromEvent: (eventId: string): void => {
    const user = authService.getCurrentUser();
    if (!user) return;
    
    const regs = dataService.getUserRegistrations();
    const updated = regs.filter(id => id !== eventId);
    localStorage.setItem(REG_PREFIX + user.email, JSON.stringify(updated));
  },

  // NEW: Function to export data to Excel-compatible CSV
  downloadRegistrationsAsCSV: () => {
    const user = authService.getCurrentUser();
    if (!user) return;

    const regIds = dataService.getUserRegistrations();
    const events = dataService.getEvents().filter(e => regIds.includes(e.id));

    if (events.length === 0) {
      alert("No registrations to export!");
      return;
    }

    // Define CSV Headers
    let csvContent = "Student Name,Email,Event Title,Date,Location,Type\n";

    // Add Data Rows
    events.forEach(e => {
      const row = [
        user.name,
        user.email,
        `"${e.title}"`, // Wrap in quotes to handle commas
        e.date,
        `"${e.location}"`,
        e.type
      ].join(",");
      csvContent += row + "\n";
    });

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `registrations_${user.name.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
