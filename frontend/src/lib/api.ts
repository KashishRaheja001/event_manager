const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
}

export interface Participant {
  id: number;
  event_id: number;
  name: string;
  email: string;
  registration_date: string;
  status: string;
  cancel_reason: string | null;
}

export const api = {
  events: {
    list: async (search?: string, sort?: string, order?: 'ASC' | 'DESC'): Promise<Event[]> => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      if (order) params.append('order', order);
      
      const res = await fetch(`${API_URL}/events?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    },
    
    get: async (id: string): Promise<Event> => {
      const res = await fetch(`${API_URL}/events/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch event');
      return res.json();
    },
    
    create: async (data: Omit<Event, 'id'>): Promise<Event> => {
      const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create event');
      return res.json();
    },
    
    update: async (id: string, data: Omit<Event, 'id'>): Promise<Event> => {
      const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update event');
      return res.json();
    },
    
    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete event');
    }
  },
  
  participants: {
    list: async (eventId: string): Promise<Participant[]> => {
      const res = await fetch(`${API_URL}/events/${eventId}/participants`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch participants');
      return res.json();
    },
    
    apply: async (eventId: string, data: { name: string; email: string }): Promise<Participant> => {
      const res = await fetch(`${API_URL}/events/${eventId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to apply to event');
      return res.json();
    },
    
    cancel: async (participantId: string, reason: string): Promise<Participant> => {
      const res = await fetch(`${API_URL}/participants/${participantId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error('Failed to cancel registration');
      return res.json();
    }
  }
};
