import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema({
  name: String,
  ign: String,
  team: String,
  team_id: Number,
  position: String,
  breed: String,
});
