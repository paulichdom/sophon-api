import { User } from '../entities/user.entity';

export class UserCreatedEvent {
  userId: number;
  payload: User;

  constructor({ userId, payload }: { userId: number; payload: User }) {
    this.userId = userId;
    this.payload = payload;
  }
}
