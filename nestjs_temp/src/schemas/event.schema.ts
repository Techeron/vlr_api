import * as mongoose from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Event {
  @Prop()
  type: string;
  @Prop()
  event_id: number;
  @Prop()
  title: string;
  @Prop()
  date: Date;
  @Prop()
  status: string;
  @Prop()
  prize: string;
  @Prop()
  region: string;
  @Prop()
  logo: string;
  @Prop()
  url: string;
}
