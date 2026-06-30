"use client";

import { useEffect, useState, use } from "react";
import { api, Event, Participant } from "@/lib/api";
import { Button, Input, Label } from "@/components/ui";
import { format } from "date-fns";
import { Calendar, MapPin, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const applySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});
type ApplyFormValues = z.infer<typeof applySchema>;

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [applySuccess, setApplySuccess] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
  });

  const fetchData = async () => {
    try {
      const [eventData, participantsData] = await Promise.all([
        api.events.get(resolvedParams.id),
        api.participants.list(resolvedParams.id),
      ]);
      setEvent(eventData);
      setParticipants(participantsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [resolvedParams.id]);

  const onApply = async (data: ApplyFormValues) => {
    try {
      await api.participants.apply(resolvedParams.id, data);
      setApplySuccess(true);
      reset();
      fetchData(); // Refresh participants list
    } catch (error) {
      console.error(error);
      alert("Failed to apply");
    }
  };

  const handleCancelRegistration = async (participantId: number) => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }
    try {
      await api.participants.cancel(participantId.toString(), cancelReason);
      setCancelingId(null);
      setCancelReason("");
      fetchData(); // Refresh participants list
    } catch (error) {
      console.error(error);
      alert("Failed to cancel registration");
    }
  };

  if (loading) return <div className="h-64 flex items-center justify-center font-serif text-xl text-gray-400 animate-pulse">Loading event details...</div>;
  if (!event) return <div className="text-red-500">Event not found</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700 pb-20">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-semibold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight mb-4">{event.name}</h1>
        
        <div className="flex flex-wrap gap-6 text-sm text-gray-600 uppercase tracking-widest border-y border-gray-200 py-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-black" />
            {format(new Date(event.date), "MMMM d, yyyy")}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-black" />
            {event.location}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 border-b border-black pb-2 inline-block">About</h2>
            <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">{event.description}</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 border-b border-black pb-2 inline-block flex items-center">
              <Users className="w-4 h-4 mr-2" /> Participants ({participants.filter(p => p.status === 'active').length})
            </h2>
            
            {participants.length === 0 ? (
              <p className="text-gray-500 italic">No one has registered yet.</p>
            ) : (
              <div className="space-y-4">
                {participants.map((p) => (
                  <div key={p.id} className={`p-4 border ${p.status === 'cancelled' ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-sm text-gray-500">{p.email}</p>
                        <p className="text-xs text-gray-400 mt-1">Registered: {format(new Date(p.registration_date), "MMM d, yyyy")}</p>
                      </div>
                      
                      {p.status === 'active' ? (
                        cancelingId === p.id ? (
                          <div className="flex flex-col gap-2 min-w-[200px]">
                            <Input 
                              size={1}
                              placeholder="Reason for cancellation..." 
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              className="h-8 text-xs"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" variant="danger" className="flex-1" onClick={() => handleCancelRegistration(p.id)}>Confirm</Button>
                              <Button size="sm" variant="ghost" className="flex-1" onClick={() => setCancelingId(null)}>Back</Button>
                            </div>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => setCancelingId(p.id)}>Cancel</Button>
                        )
                      ) : (
                        <div className="text-right">
                          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Cancelled</span>
                          <p className="text-xs text-gray-500 mt-1">Reason: {p.cancel_reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-gray-50 p-6 border border-gray-200 sticky top-8">
            <h3 className="text-xl font-serif font-bold mb-6">REGISTER</h3>
            
            {applySuccess ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">✓</span>
                </div>
                <h4 className="font-bold uppercase tracking-widest mb-2">Success</h4>
                <p className="text-sm text-gray-600 mb-6">You have been registered for this event.</p>
                <Button onClick={() => setApplySuccess(false)} variant="outline" className="w-full">Register Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onApply)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantName">Full Name</Label>
                  <Input id="applicantName" {...register('name')} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="applicantEmail">Email Address</Label>
                  <Input id="applicantEmail" type="email" {...register('email')} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
                  {isSubmitting ? "PROCESSING..." : "APPLY NOW"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
