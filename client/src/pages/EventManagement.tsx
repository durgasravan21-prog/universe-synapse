import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  Calendar,
  MapPin,
  Users,
  Tag,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { EventManager, type Event, type EventType, type EventSize } from '@/data/eventSystem';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Event Management Page
 * Allows admins to create, edit, and manage events
 */
export default function EventManagement() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'conference' as EventType,
    size: 'medium' as EventSize,
    startDate: '',
    endDate: '',
    location: '',
    registrationDeadline: '',
    contactEmail: '',
    contactPhone: '',
    tags: '',
    targetAudience: 'students' as 'students' | 'faculty' | 'both',
    maxParticipants: '',
    website: '',
  });

  // Load events
  useEffect(() => {
    const loadEvents = () => {
      const allEvents = EventManager.getEventsByUniversity(user?.universityId || '');
      setEvents(allEvents);
    };
    loadEvents();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEvent) {
      // Update event
      const updated = EventManager.updateEvent(editingEvent.id, {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        size: formData.size,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        location: formData.location,
        registrationDeadline: new Date(formData.registrationDeadline),
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        tags: formData.tags.split(',').map(t => t.trim()),
        targetAudience: formData.targetAudience,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        website: formData.website,
      });
      if (updated) {
        setEvents(EventManager.getEventsByUniversity(user?.universityId || ''));
      }
    } else {
      // Create new event
      const newEvent = EventManager.createEvent(
        formData.title,
        formData.description,
        formData.type,
        formData.size,
        user?.universityName || '',
        user?.universityId || '',
        new Date(formData.startDate),
        new Date(formData.endDate),
        formData.location,
        new Date(formData.registrationDeadline),
        formData.contactEmail,
        formData.contactPhone,
        formData.tags.split(',').map(t => t.trim()),
        formData.targetAudience,
        formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        '',
        formData.website
      );
      setEvents([...events, newEvent]);
    }

    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'conference',
      size: 'medium',
      startDate: '',
      endDate: '',
      location: '',
      registrationDeadline: '',
      contactEmail: '',
      contactPhone: '',
      tags: '',
      targetAudience: 'students',
      maxParticipants: '',
      website: '',
    });
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      type: event.type,
      size: event.size,
      startDate: event.startDate.toISOString().split('T')[0],
      endDate: event.endDate.toISOString().split('T')[0],
      location: event.location,
      registrationDeadline: event.registrationDeadline.toISOString().split('T')[0],
      contactEmail: event.contactEmail,
      contactPhone: event.contactPhone,
      tags: event.tags.join(', '),
      targetAudience: event.targetAudience,
      maxParticipants: event.maxParticipants?.toString() || '',
      website: event.website || '',
    });
    setShowForm(true);
  };

  const handleDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      EventManager.deleteEvent(eventId);
      setEvents(EventManager.getEventsByUniversity(user?.universityId || ''));
    }
  };

  const handlePublish = (eventId: string) => {
    const published = EventManager.publishEvent(eventId);
    if (published) {
      setEvents(EventManager.getEventsByUniversity(user?.universityId || ''));
    }
  };

  const handleSendNotification = (event: Event) => {
    if (event.size === 'large' || event.size === 'mega' || event.type === 'hackathon') {
      EventManager.markNotificationSent(event.id);
      setEvents(EventManager.getEventsByUniversity(user?.universityId || ''));
      alert(`Email notification sent to all ${EventManager.getAllRegisteredUniversityEmails().length} registered universities!`);
    } else {
      alert('Email notifications are only sent for large/mega events and hackathons.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'draft':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'ongoing':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-slate-600" />;
    }
  };

  const isBigEvent = (event: Event) => {
    return event.size === 'large' || event.size === 'mega' || event.type === 'hackathon';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Event Management</h1>
            <p className="text-slate-600">Create and manage events for your university</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingEvent(null);
              setFormData({
                title: '',
                description: '',
                type: 'conference',
                size: 'medium',
                startDate: '',
                endDate: '',
                location: '',
                registrationDeadline: '',
                contactEmail: '',
                contactPhone: '',
                tags: '',
                targetAudience: 'students',
                maxParticipants: '',
                website: '',
              });
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="p-8 mb-8 border-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Event Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Annual Hackathon 2026"
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Event Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="conference">Conference</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="competition">Competition</option>
                    <option value="webinar">Webinar</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Event Size *</label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="small">Small (0-100)</option>
                    <option value="medium">Medium (100-500)</option>
                    <option value="large">Large (500-2000)</option>
                    <option value="mega">Mega (2000+)</option>
                  </select>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Target Audience *</label>
                  <select
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="students">Students</option>
                    <option value="faculty">Faculty</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., IIT Bombay, Mumbai"
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Registration Deadline */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Registration Deadline *</label>
                  <input
                    type="date"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Email *</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="event@university.ac.in"
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Phone *</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXXXXXXX"
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Max Participants (Optional)</label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    placeholder="e.g., 500"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Website (Optional)</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://event.example.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g., coding, innovation, prizes"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event in detail..."
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEvent(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Events List */}
        {events.length === 0 ? (
          <Card className="p-12 border-2 text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-semibold mb-4">No events created yet</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Your First Event
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="p-6 border-2 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(event.status)}
                      <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
                      {isBigEvent(event) && (
                        <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                          Big Event
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 mb-3">{event.description.substring(0, 150)}...</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {event.startDate.toLocaleDateString('en-IN')}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="w-4 h-4" />
                        {event.registeredParticipants} registered
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Tag className="w-4 h-4" />
                        {event.type}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    {event.status === 'draft' && (
                      <Button
                        onClick={() => handlePublish(event.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm"
                      >
                        Publish
                      </Button>
                    )}
                    {event.status === 'published' && isBigEvent(event) && !event.emailNotificationSent && (
                      <Button
                        onClick={() => handleSendNotification(event)}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send Email
                      </Button>
                    )}
                    {event.emailNotificationSent && (
                      <span className="text-xs text-green-600 font-semibold">✓ Emails Sent</span>
                    )}
                    <Button
                      onClick={() => handleEdit(event)}
                      variant="outline"
                      size="sm"
                      className="text-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
