/**
 * Event Management System
 * Manages university events, hackathons, and automatic notifications
 */

export type EventType = 'conference' | 'hackathon' | 'workshop' | 'seminar' | 'competition' | 'webinar' | 'other';
export type EventSize = 'small' | 'medium' | 'large' | 'mega';

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  size: EventSize;
  organizingUniversity: string;
  organizingUniversityId: string;
  startDate: Date;
  endDate: Date;
  location: string;
  registrationDeadline: Date;
  maxParticipants?: number;
  registeredParticipants: number;
  posterUrl?: string;
  website?: string;
  contactEmail: string;
  contactPhone: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  emailNotificationSent: boolean;
  emailNotificationSentAt?: Date;
  targetAudience: 'students' | 'faculty' | 'both';
  registeredUsers: string[]; // User IDs
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userUniversity: string;
  registeredAt: Date;
  status: 'registered' | 'attended' | 'cancelled';
}

/**
 * Event Manager
 */
export class EventManager {
  private static readonly STORAGE_KEY = 'synapse_events';
  private static readonly REGISTRATION_KEY = 'synapse_event_registrations';

  /**
   * Create new event
   */
  static createEvent(
    title: string,
    description: string,
    type: EventType,
    size: EventSize,
    organizingUniversity: string,
    organizingUniversityId: string,
    startDate: Date,
    endDate: Date,
    location: string,
    registrationDeadline: Date,
    contactEmail: string,
    contactPhone: string,
    tags: string[],
    targetAudience: 'students' | 'faculty' | 'both',
    maxParticipants?: number,
    posterUrl?: string,
    website?: string
  ): Event {
    const event: Event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      type,
      size,
      organizingUniversity,
      organizingUniversityId,
      startDate,
      endDate,
      location,
      registrationDeadline,
      maxParticipants,
      registeredParticipants: 0,
      posterUrl,
      website,
      contactEmail,
      contactPhone,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
      emailNotificationSent: false,
      targetAudience,
      registeredUsers: [],
    };

    this.storeEvent(event);
    return event;
  }

  /**
   * Store event
   */
  private static storeEvent(event: Event): void {
    const events = this.getAllEvents();
    const index = events.findIndex(e => e.id === event.id);
    if (index !== -1) {
      events[index] = event;
    } else {
      events.push(event);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
  }

  /**
   * Get all events
   */
  static getAllEvents(): Event[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    try {
      const events = JSON.parse(data);
      return events.map((e: any) => ({
        ...e,
        startDate: new Date(e.startDate),
        endDate: new Date(e.endDate),
        registrationDeadline: new Date(e.registrationDeadline),
        createdAt: new Date(e.createdAt),
        updatedAt: new Date(e.updatedAt),
        emailNotificationSentAt: e.emailNotificationSentAt ? new Date(e.emailNotificationSentAt) : undefined,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get published events
   */
  static getPublishedEvents(): Event[] {
    return this.getAllEvents().filter(e => e.status === 'published' || e.status === 'ongoing');
  }

  /**
   * Get big events and hackathons
   */
  static getBigEventsAndHackathons(): Event[] {
    return this.getPublishedEvents().filter(
      e => (e.size === 'large' || e.size === 'mega') || e.type === 'hackathon'
    );
  }

  /**
   * Get events by university
   */
  static getEventsByUniversity(universityId: string): Event[] {
    return this.getAllEvents().filter(e => e.organizingUniversityId === universityId);
  }

  /**
   * Get events by type
   */
  static getEventsByType(type: EventType): Event[] {
    return this.getPublishedEvents().filter(e => e.type === type);
  }

  /**
   * Get event by ID
   */
  static getEventById(eventId: string): Event | undefined {
    return this.getAllEvents().find(e => e.id === eventId);
  }

  /**
   * Update event
   */
  static updateEvent(eventId: string, updates: Partial<Event>): Event | undefined {
    const events = this.getAllEvents();
    const event = events.find(e => e.id === eventId);
    if (event) {
      const updated = {
        ...event,
        ...updates,
        updatedAt: new Date(),
      };
      this.storeEvent(updated);
      return updated;
    }
    return undefined;
  }

  /**
   * Publish event
   */
  static publishEvent(eventId: string): Event | undefined {
    return this.updateEvent(eventId, { status: 'published' });
  }

  /**
   * Mark event notification as sent
   */
  static markNotificationSent(eventId: string): Event | undefined {
    return this.updateEvent(eventId, {
      emailNotificationSent: true,
      emailNotificationSentAt: new Date(),
    });
  }

  /**
   * Register user for event
   */
  static registerUserForEvent(eventId: string, userId: string, userEmail: string, userName: string, userUniversity: string): EventRegistration {
    const registration: EventRegistration = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventId,
      userId,
      userEmail,
      userName,
      userUniversity,
      registeredAt: new Date(),
      status: 'registered',
    };

    const registrations = this.getAllRegistrations();
    registrations.push(registration);
    localStorage.setItem(this.REGISTRATION_KEY, JSON.stringify(registrations));

    // Update event participant count
    const event = this.getEventById(eventId);
    if (event) {
      event.registeredParticipants += 1;
      event.registeredUsers.push(userId);
      this.storeEvent(event);
    }

    return registration;
  }

  /**
   * Get all registrations
   */
  static getAllRegistrations(): EventRegistration[] {
    const data = localStorage.getItem(this.REGISTRATION_KEY);
    if (!data) return [];
    try {
      const registrations = JSON.parse(data);
      return registrations.map((r: any) => ({
        ...r,
        registeredAt: new Date(r.registeredAt),
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get registrations for event
   */
  static getRegistrationsForEvent(eventId: string): EventRegistration[] {
    return this.getAllRegistrations().filter(r => r.eventId === eventId);
  }

  /**
   * Get registrations for user
   */
  static getRegistrationsForUser(userId: string): EventRegistration[] {
    return this.getAllRegistrations().filter(r => r.userId === userId);
  }

  /**
   * Get all registered university emails for event notification
   */
  static getAllRegisteredUniversityEmails(): string[] {
    // This would connect to the universities database
    // For now, return mock data
    return [
      'admin@iit-bombay.ac.in',
      'admin@iit-delhi.ac.in',
      'admin@iit-madras.ac.in',
      'admin@delhi-university.ac.in',
      'admin@mumbai-university.ac.in',
    ];
  }

  /**
   * Get event statistics
   */
  static getEventStatistics() {
    const allEvents = this.getAllEvents();
    const publishedEvents = this.getPublishedEvents();
    const bigEvents = this.getBigEventsAndHackathons();

    return {
      totalEvents: allEvents.length,
      publishedEvents: publishedEvents.length,
      bigEventsAndHackathons: bigEvents.length,
      totalRegistrations: this.getAllRegistrations().length,
      eventsByType: {
        hackathon: allEvents.filter(e => e.type === 'hackathon').length,
        conference: allEvents.filter(e => e.type === 'conference').length,
        workshop: allEvents.filter(e => e.type === 'workshop').length,
        seminar: allEvents.filter(e => e.type === 'seminar').length,
        competition: allEvents.filter(e => e.type === 'competition').length,
        webinar: allEvents.filter(e => e.type === 'webinar').length,
      },
    };
  }

  /**
   * Delete event
   */
  static deleteEvent(eventId: string): void {
    const events = this.getAllEvents().filter(e => e.id !== eventId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
  }
}

/**
 * Sample events for demo
 */
export const SAMPLE_EVENTS: Event[] = [
  {
    id: 'event_demo_1',
    title: 'All India Hackathon 2026',
    description: 'A nationwide hackathon for students to showcase their coding skills and innovation. Compete with teams from across India for exciting prizes and recognition.',
    type: 'hackathon',
    size: 'mega',
    organizingUniversity: 'Indian Institute of Technology Bombay',
    organizingUniversityId: 'iit-bombay',
    startDate: new Date('2026-04-15'),
    endDate: new Date('2026-04-17'),
    location: 'IIT Bombay, Mumbai',
    registrationDeadline: new Date('2026-04-10'),
    maxParticipants: 5000,
    registeredParticipants: 1250,
    posterUrl: 'https://via.placeholder.com/400x300?text=Hackathon+2026',
    website: 'https://hackathon2026.example.com',
    contactEmail: 'hackathon@iitb.ac.in',
    contactPhone: '+91 22 2576 7000',
    tags: ['coding', 'innovation', 'prizes', 'nationwide'],
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-20'),
    status: 'published',
    emailNotificationSent: true,
    emailNotificationSentAt: new Date('2026-03-20'),
    targetAudience: 'students',
    registeredUsers: [],
  },
  {
    id: 'event_demo_2',
    title: 'National Science Conference 2026',
    description: 'Annual conference bringing together researchers, scientists, and academicians to discuss latest developments in science and technology.',
    type: 'conference',
    size: 'large',
    organizingUniversity: 'Delhi University',
    organizingUniversityId: 'delhi-university',
    startDate: new Date('2026-05-10'),
    endDate: new Date('2026-05-12'),
    location: 'Delhi University, New Delhi',
    registrationDeadline: new Date('2026-05-05'),
    maxParticipants: 2000,
    registeredParticipants: 650,
    posterUrl: 'https://via.placeholder.com/400x300?text=Science+Conference',
    website: 'https://sciconf2026.example.com',
    contactEmail: 'conference@du.ac.in',
    contactPhone: '+91 11 2766 7000',
    tags: ['research', 'science', 'technology', 'conference'],
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-03-18'),
    status: 'published',
    emailNotificationSent: true,
    emailNotificationSentAt: new Date('2026-03-18'),
    targetAudience: 'both',
    registeredUsers: [],
  },
];
