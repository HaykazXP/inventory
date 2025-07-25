import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { I18nModule } from './i18n/i18n.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UserModule,
    I18nModule,
    ProductModule,
  ],
})
export class AppModule {}
