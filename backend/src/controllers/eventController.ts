import { Request, Response } from 'express';
import { EventModel } from '../models/EventModel';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, description, date, location } = req.body;
    if (!name || !date) {
      return res.status(400).json({ error: 'Name and date are required' });
    }
    const event = await EventModel.create(name, description, date, location);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { search, sort, order } = req.query;
    const events = await EventModel.findAll(
      search as string,
      sort as string,
      (order as string)?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
    );
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await EventModel.findById(Number(req.params.id));
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { name, description, date, location } = req.body;
    const event = await EventModel.update(Number(req.params.id), name, description, date, location);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await EventModel.delete(Number(req.params.id));
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Participant Handlers
export const applyToEvent = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const eventId = Number(req.params.id);
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const participant = await EventModel.addParticipant(eventId, name, email);
    res.status(201).json(participant);
  } catch (error) {
    console.error('Error applying to event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEventParticipants = async (req: Request, res: Response) => {
  try {
    const participants = await EventModel.getParticipants(Number(req.params.id));
    res.json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const cancelRegistration = async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ error: 'Cancellation reason is required' });
    }
    const participant = await EventModel.cancelRegistration(Number(req.params.id), reason);
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    res.json(participant);
  } catch (error) {
    console.error('Error canceling registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
