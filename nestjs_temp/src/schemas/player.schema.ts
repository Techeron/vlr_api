import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema({
  name: String,
  age: Number,
  breed: String,
});
