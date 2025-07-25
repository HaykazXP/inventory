import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async updateUserSettings(username: string, settings: any): Promise<User | null> {
    return this.userModel.findOneAndUpdate(
      { username },
      { $set: { settings } },
      { new: true }
    ).exec();
  }

  async getUserSettings(username: string): Promise<any> {
    const user = await this.userModel.findOne({ username }).exec();
    return user?.settings || { language: 'ru' };
  }
}
