import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { I18nModule } from '../i18n/i18n.module';

@Module({
  imports: [UserModule, I18nModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
