"use client";

import { useEffect, useState, use } from "react";
import { api, Event } from "@/lib/api";
import EventForm from "@/components/EventForm";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await api.events.get(resolvedParams.id);
        setEvent(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [resolvedParams.id]);

  if (loading) return <div className="h-64 flex items-center justify-center font-serif text-xl text-gray-400 animate-pulse">Loading event...</div>;
  if (!event) return <div className="text-red-500">Event not found</div>;

  return (
    <div className="animate-in fade-in duration-700">
      <EventForm initialData={event} />
    </div>
  );
}
