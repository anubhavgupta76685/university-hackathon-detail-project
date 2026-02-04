
import { CollegeEvent, EventType } from './types';

export const MOCK_EVENTS: CollegeEvent[] = [
  {
    id: '1',
    title: 'CodeSprint 2024: 48H Hackathon',
    description: 'The ultimate endurance test for developers. Build innovative solutions for real-world problems in 48 hours.',
    type: EventType.HACKATHON,
    date: '2024-11-15',
    location: 'Central IT Block, Main Hall',
    imageUrl: 'https://picsum.photos/seed/hack/800/400',
    registrationDeadline: '2024-11-10',
    registrationLink: 'https://example.com/register/codesprint',
    rules: [
      'Maximum 4 members per team.',
      'All code must be written during the event.',
      'Pre-built assets are allowed but must be disclosed.',
      'Decision of judges is final.'
    ],
    schedule: [
      { time: '09:00 AM', activity: 'Registration & Breakfast', venue: 'Lobby' },
      { time: '10:30 AM', activity: 'Opening Ceremony', venue: 'Main Hall' },
      { time: '11:00 AM', activity: 'Coding Begins', venue: 'Hackathon Zone' },
      { time: '01:00 PM', activity: 'Lunch', venue: 'Cafeteria' }
    ],
    coordinators: [
      { name: 'Dr. Sarah Johnson', role: 'Head Coordinator', email: 'sarah.j@college.edu', phone: '+1234567890' },
      { name: 'Alex Rivera', role: 'Technical Lead', email: 'alex.r@college.edu', phone: '+1234567891' }
    ]
  },
  {
    id: '2',
    title: 'Mastering React & Gemini AI',
    description: 'A deep dive workshop into building intelligent web applications using Google Gemini API and React.',
    type: EventType.WORKSHOP,
    date: '2024-11-20',
    location: 'Seminar Room 302',
    imageUrl: 'https://picsum.photos/seed/workshop/800/400',
    registrationDeadline: '2024-11-18',
    registrationLink: 'https://example.com/register/workshop',
    rules: [
      'Participants must bring their own laptops.',
      'Prior basic knowledge of JavaScript is required.',
      'Attendance certificate provided.'
    ],
    schedule: [
      { time: '10:00 AM', activity: 'Introduction to Generative AI', venue: 'Room 302' },
      { time: '12:00 PM', activity: 'Hands-on Lab: Gemini API', venue: 'Room 302' },
      { time: '02:00 PM', activity: 'Project Showcase', venue: 'Room 302' }
    ],
    coordinators: [
      { name: 'Prof. David Chen', role: 'Lead Instructor', email: 'd.chen@college.edu', phone: '+1234567892' }
    ]
  },
  {
    id: '3',
    title: 'Rhythm & Beats: Cultural Night',
    description: 'An evening of music, dance, and cultural performances by students from all departments.',
    type: EventType.CULTURAL,
    date: '2024-12-05',
    location: 'Open Air Theatre (OAT)',
    imageUrl: 'https://picsum.photos/seed/culture/800/400',
    registrationDeadline: '2024-12-01',
    registrationLink: 'https://example.com/register/culture',
    rules: [
      'Performances should not exceed 10 minutes.',
      'Registration required for audition by Nov 25.',
      'Dress code: Traditional or Formal.'
    ],
    schedule: [
      { time: '05:00 PM', activity: 'Opening Act', venue: 'OAT' },
      { time: '06:30 PM', activity: 'Dance Competition', venue: 'OAT' },
      { time: '08:30 PM', activity: 'Prize Distribution', venue: 'OAT' }
    ],
    coordinators: [
      { name: 'Elena Gilbert', role: 'Cultural Secretary', email: 'elena.g@college.edu', phone: '+1234567893' }
    ]
  }
];
