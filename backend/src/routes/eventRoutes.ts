import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  applyToEvent,
  getEventParticipants,
  cancelRegistration,
} from '../controllers/eventController';

const router = Router();

// Event Routes
router.post('/events', createEvent);
router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// Participant Routes
router.post('/events/:id/apply', applyToEvent);
router.get('/events/:id/participants', getEventParticipants);
router.put('/participants/:id/cancel', cancelRegistration);

export default router;
