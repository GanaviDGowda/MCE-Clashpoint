// server/services/eventServices.js
import { Event } from "../models/Event.js";

export const filterEvents = async (filters = {}) => {
  const query = {};

  if (filters.category) query.category = filters.category;
  if (filters.mode) query.mode = filters.mode;
  if (filters.host) query.host = filters.host;

  const events = await Event.find(query).sort({ date: 1 });
  return events;
};
