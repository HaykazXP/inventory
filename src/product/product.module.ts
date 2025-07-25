import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UserModule } from '../user/user.module';
import { I18nModule } from '../i18n/i18n.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    UserModule,
    I18nModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {} 