import UserRepository from "../repositories/UserRepository";
import User from "../models/User";

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
}