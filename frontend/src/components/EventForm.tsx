"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { api, Event } from '@/lib/api';
import { Button, Input, Label } from '@/components/ui';

const eventSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: Event;
}

export default function EventForm({ initialData }: EventFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      date: initialData.date.split('T')[0], // format for date input
      location: initialData.location,
    } : undefined,
  });

  const onSubmit = async (data: EventFormValues) => {
    try {
      if (initialData) {
        await api.events.update(initialData.id.toString(), data);
      } else {
        await api.events.create(data);
      }
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 border-b border-black pb-4">
        <h2 className="text-3xl font-serif font-bold">{initialData ? 'EDIT EVENT.' : 'NEW EVENT.'}</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="name">Event Name</Label>
          <Input id="name" placeholder="e.g. Annual Tech Conference" {...register('name')} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea 
            id="description" 
            placeholder="What is this event about?"
            className="flex min-h-[120px] w-full border-b border-black bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-b-2 resize-none"
            {...register('description')}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g. New York City, NY" {...register('location')} />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto">
            {isSubmitting ? 'SAVING...' : 'SAVE EVENT'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isSubmitting}>
            CANCEL
          </Button>
        </div>
      </form>
    </div>
  );
}
