import UserRepository from "../repositories/UserRepository";
import { User, UserWithRole} from "../models/User";

const userRepository = new UserRepository();

export default class UserService {
  async getFirstRegisteredUser(): Promise<User | null> {
    try {
      const user = await userRepository.getFirstRegisteredUser();
      return user || null;
    } catch (error) {
      throw new Error(`Error fetching first user: ${(error as Error).message}`);
    }
  }

  async getUsersRegisteredSince(startDate: Date): Promise<UserWithRole[]> {
    try {
      const users = await userRepository.getUsersRegisteredSince(startDate);
      return users.filter(user => user.role !== null) as UserWithRole[];
    } catch (error) {
      throw new Error(`Error fetching users with role: ${(error as Error).message}`);
    }
  }
}