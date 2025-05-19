import { Request, Response } from 'express';
import UserService from '../services/UserService';

const userService = new UserService();

export default class UserController {
  static async getFirstRegisteredUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.getFirstRegisteredUser();
      
      if (!user) {
        res.status(404).json({ message: 'No users found' });
        return;
      }

      res.json({
        id: user.id,
        idNumber: user.idNumber,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        registeredAt: user.registeredAt
      });
      
    } catch (error) {
      res.status(500).json({
        error: 'Error retrieving first user',
        details: (error as Error).message
      });
    }
  }
}