"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Event } from '@/lib/api';
import { Button, Input } from './ui';
import { Search, Plus, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'id' | 'date'>('date');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await api.events.list(search, sort, order);
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, sort, order]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.events.delete(id.toString());
      fetchEvents();
    } catch (error) {
      console.error(error);
      alert('Failed to delete event');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold">ALL EVENTS</h2>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-wider">Manage your upcoming schedule</p>
        </div>
        <Link href="/events/new">
          <Button><Plus className="w-4 h-4 mr-2" /> CREATE EVENT</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 p-4 border border-gray-200">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search by name or location..." 
            className="pl-10 border-none bg-transparent h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="h-8 w-px bg-gray-300 hidden sm:block" />
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <Button 
            variant={sort === 'date' && order === 'ASC' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => { setSort('date'); setOrder('ASC'); }}
          >
            SOONEST
          </Button>
          <Button 
            variant={sort === 'date' && order === 'DESC' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => { setSort('date'); setOrder('DESC'); }}
          >
            LATEST
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center font-serif text-xl text-gray-400 animate-pulse">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-gray-300">
          <p className="text-gray-500 uppercase tracking-widest text-sm mb-4">No events found.</p>
          <Link href="/events/new">
            <Button variant="outline">Create your first event</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="group relative border border-gray-200 p-6 transition-all hover:border-black hover:shadow-lg flex flex-col h-full bg-white">
              <div className="mb-4">
                <h3 className="text-xl font-serif font-bold mb-2 line-clamp-1 group-hover:text-accent transition-colors">
                  <Link href={`/events/${event.id}`}>
                    <span className="absolute inset-0"></span>
                    {event.name}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
              </div>
              
              <div className="mt-auto space-y-2 pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(event.date), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                 <Link href={`/events/${event.id}/edit`} className="relative z-20">
                   <Button variant="outline" size="sm" className="h-8 px-3">Edit</Button>
                 </Link>
                 <Button 
                   variant="danger" 
                   size="sm" 
                   className="h-8 px-3 relative z-20"
                   onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(event.id); }}
                 >
                   Delete
                 </Button>
              </div>
              
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-transform transform translate-x-2 group-hover:translate-x-0">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
