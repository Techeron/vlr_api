import * as mongoose from 'mongoose';

export const EventSchema = new mongoose.Schema({
  type: String,
  event_id: Number,
  title: String,
  date: Date,
  status: String,
  prize: String,
  region: String,
  logo: String,
  url: String,
});
