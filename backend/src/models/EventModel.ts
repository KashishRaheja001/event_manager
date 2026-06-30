import { query } from '../config/db';

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

export class EventModel {
  static async create(name: string, description: string, date: string, location: string) {
    const text = 'INSERT INTO events(name, description, date, location) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [name, description, date, location];
    const { rows } = await query(text, values);
    return rows[0];
  }

  static async findAll(search?: string, sortBy?: string, order: 'ASC' | 'DESC' = 'ASC') {
    let text = 'SELECT * FROM events';
    const values: any[] = [];

    if (search) {
      text += ' WHERE name ILIKE $1 OR location ILIKE $1';
      values.push(`%${search}%`);
    }

    if (sortBy === 'date') {
      text += ` ORDER BY date ${order}`;
    } else {
      text += ` ORDER BY id ASC`;
    }

    const { rows } = await query(text, values);
    return rows;
  }

  static async findById(id: number) {
    const text = 'SELECT * FROM events WHERE id = $1';
    const { rows } = await query(text, [id]);
    return rows[0];
  }

  static async update(id: number, name: string, description: string, date: string, location: string) {
    const text = 'UPDATE events SET name = $1, description = $2, date = $3, location = $4 WHERE id = $5 RETURNING *';
    const values = [name, description, date, location, id];
    const { rows } = await query(text, values);
    return rows[0];
  }

  static async delete(id: number) {
    const text = 'DELETE FROM events WHERE id = $1 RETURNING *';
    const { rows } = await query(text, [id]);
    return rows[0];
  }

  // Participants
  static async addParticipant(eventId: number, name: string, email: string) {
    const text = 'INSERT INTO participants(event_id, name, email) VALUES($1, $2, $3) RETURNING *';
    const values = [eventId, name, email];
    const { rows } = await query(text, values);
    return rows[0];
  }

  static async getParticipants(eventId: number) {
    const text = 'SELECT * FROM participants WHERE event_id = $1 ORDER BY registration_date DESC';
    const { rows } = await query(text, [eventId]);
    return rows;
  }

  static async cancelRegistration(participantId: number, reason: string) {
    const text = "UPDATE participants SET status = 'cancelled', cancel_reason = $1 WHERE id = $2 RETURNING *";
    const { rows } = await query(text, [reason, participantId]);
    return rows[0];
  }
}
