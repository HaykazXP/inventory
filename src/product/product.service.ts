import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(data: Partial<Product>): Promise<Product> {
    if (!data.name || !data.price) {
      throw new BadRequestException('Name and price are required');
    }
    
    if (data.price <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }

    const product = new this.productModel({
      ...data,
      oldPrices: data.oldPrices || {}
    });
    
    return product.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Product> {
    if (!id) {
      throw new BadRequestException('Product ID is required');
    }
    
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    if (!id) {
      throw new BadRequestException('Product ID is required');
    }

    const existingProduct = await this.productModel.findById(id).exec();
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // If price is being updated, add current price to oldPrices
    if (data.price && data.price !== existingProduct.price) {
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const updatedOldPrices = {
        ...existingProduct.oldPrices,
        [currentDate]: existingProduct.price
      };
      
      data.oldPrices = updatedOldPrices;
    }

    const product = await this.productModel.findByIdAndUpdate(
      id, 
      data, 
      { new: true, runValidators: true }
    ).exec();
    
    return product;
  }

  async remove(id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException('Product ID is required');
    }
    
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Product not found');
    }
  }

  async updatePrice(id: string, newPrice: number): Promise<Product> {
    if (!id) {
      throw new BadRequestException('Product ID is required');
    }
    
    if (newPrice <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }

    const existingProduct = await this.productModel.findById(id).exec();
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const updatedOldPrices = {
      ...existingProduct.oldPrices,
      [currentDate]: existingProduct.price
    };

    return this.productModel.findByIdAndUpdate(
      id,
      { 
        price: newPrice,
        oldPrices: updatedOldPrices
      },
      { new: true }
    ).exec();
  }

  async getPriceHistory(id: string): Promise<Record<string, number>> {
    const product = await this.findOne(id);
    return product.oldPrices;
  }
} 