import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async create(username: string, password: string) {
    return this.userModel.create({ username, password });
  }
}
