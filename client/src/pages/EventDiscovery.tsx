import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Tag,
  Heart,
  Share2,
  Clock,
  CheckCircle,
  Zap,
} from 'lucide-react';
import { EventManager, type Event, type EventType } from '@/data/eventSystem';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Event Discovery Page
 * Allows students to browse and discover events
 */
export default function EventDiscovery() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<EventType | 'all'>('all');
  const [selectedSize, setSelectedSize] = useState<'all' | 'small' | 'medium' | 'large' | 'mega'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Load events
  useEffect(() => {
    const allEvents = EventManager.getPublishedEvents();
    setEvents(allEvents);
    setFilteredEvents(allEvents);

    // Load favorites from localStorage
    const saved = localStorage.getItem('event_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Filter events
  useEffect(() => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(
        e =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(e => e.type === selectedType);
    }

    if (selectedSize !== 'all') {
      filtered = filtered.filter(e => e.size === selectedSize);
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedType, selectedSize]);

  const handleToggleFavorite = (eventId: string) => {
    const updated = favorites.includes(eventId)
      ? favorites.filter(id => id !== eventId)
      : [...favorites, eventId];
    setFavorites(updated);
    localStorage.setItem('event_favorites', JSON.stringify(updated));
  };

  const handleRegisterEvent = (event: Event) => {
    if (user) {
      EventManager.registerUserForEvent(
        event.id,
        user.id || 'user_' + Date.now(),
        user.email || '',
        user.name || '',
        user.universityName || ''
      );
      alert(`Successfully registered for ${event.title}!`);
    } else {
      alert('Please sign in to register for events');
    }
  };

  const isBigEvent = (event: Event) => {
    return event.size === 'large' || event.size === 'mega' || event.type === 'hackathon';
  };

  const isEventExpired = (event: Event) => {
    return new Date() > event.registrationDeadline;
  };

  const eventTypes: EventType[] = ['conference', 'hackathon', 'workshop', 'seminar', 'competition', 'webinar'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Discover Events</h1>
          <p className="text-slate-600">Find and register for exciting events across India</p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8 border-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Search Events</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Event Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Event Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                {eventTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Size Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Event Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value as any)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sizes</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="mega">Mega</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Filter className="w-4 h-4" />
            <span>Showing {filteredEvents.length} of {events.length} events</span>
          </div>
        </Card>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <Card className="p-12 border-2 text-center">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-semibold">No events found</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your search filters</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="border-2 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                {/* Event Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                      <p className="text-sm text-blue-100">{event.organizingUniversity}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(event.id);
                      }}
                      className="ml-2"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          favorites.includes(event.id) ? 'fill-red-400 text-red-400' : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {isBigEvent(event) && (
                      <span className="bg-red-400 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Big Event
                      </span>
                    )}
                    {event.type === 'hackathon' && (
                      <span className="bg-purple-400 text-white text-xs font-bold px-2 py-1 rounded">
                        💻 Hackathon
                      </span>
                    )}
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-4">
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{event.description}</p>

                  {/* Info Grid */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{event.startDate.toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>{event.registeredParticipants} registered</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Deadline: {event.registrationDeadline.toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {event.tags.length > 3 && (
                      <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-1 rounded">
                        +{event.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Register Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRegisterEvent(event);
                    }}
                    disabled={isEventExpired(event)}
                    className={`w-full ${
                      isEventExpired(event)
                        ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isEventExpired(event) ? 'Registration Closed' : 'Register Now'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-96 overflow-y-auto border-2">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedEvent.title}</h2>
                    <p className="text-slate-600">{selectedEvent.organizingUniversity}</p>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-slate-500 hover:text-slate-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-slate-700">{selectedEvent.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">📅 Start Date</p>
                      <p className="text-slate-900">{selectedEvent.startDate.toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">📍 Location</p>
                      <p className="text-slate-900">{selectedEvent.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">👥 Registered</p>
                      <p className="text-slate-900">{selectedEvent.registeredParticipants} participants</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">⏰ Registration Deadline</p>
                      <p className="text-slate-900">{selectedEvent.registrationDeadline.toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">📧 Contact Email</p>
                      <p className="text-slate-900">{selectedEvent.contactEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">📞 Contact Phone</p>
                      <p className="text-slate-900">{selectedEvent.contactPhone}</p>
                    </div>
                  </div>

                  {selectedEvent.website && (
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">🌐 Website</p>
                      <a
                        href={selectedEvent.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        {selectedEvent.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      handleRegisterEvent(selectedEvent);
                      setSelectedEvent(null);
                    }}
                    disabled={isEventExpired(selectedEvent)}
                    className={`flex-1 ${
                      isEventExpired(selectedEvent)
                        ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isEventExpired(selectedEvent) ? 'Registration Closed' : 'Register Now'}
                  </Button>
                  <Button
                    onClick={() => setSelectedEvent(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
