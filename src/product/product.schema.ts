import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true, minlength: 1, maxlength: 100 })
  name: string;

  @Prop({ required: true, min: 0.01 })
  price: number;

  @Prop({ type: Map, of: Number, default: {} })
  oldPrices: Record<string, number>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Add indexes for better query performance
ProductSchema.index({ name: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ price: 1 }); 