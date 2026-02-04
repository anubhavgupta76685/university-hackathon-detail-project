
export enum EventType {
  HACKATHON = 'Hackathon',
  WORKSHOP = 'Workshop',
  CULTURAL = 'Cultural',
  SPORTS = 'Sports',
  SEMINAR = 'Seminar'
}

export interface User {
  name: string;
  email: string;
  id: string;
}

export interface Coordinator {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface ScheduleItem {
  time: string;
  activity: string;
  venue: string;
}

export interface CollegeEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  date: string;
  location: string;
  imageUrl: string;
  registrationDeadline: string;
  registrationLink: string;
  rules: string[];
  schedule: ScheduleItem[];
  coordinators: Coordinator[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type PageView = 'home' | 'explore' | 'registrations' | 'login' | 'signup';
