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
  };

  static async getUsersRegisteredSince(req: Request, res: Response): Promise<void> {
    try {
      const startDateParam = req.query.since as string;
      const startDate = new Date(startDateParam);
      
      if (isNaN(startDate.getTime())) {
        res.status(400).json({ 
          error: 'Formato de fecha/hora inválido. Use ISO8601 (YYYY-MM-DD o YYYY-MM-DDTHH:MM:SS)',
          example1: '2024-01-01',
          example2: '2024-01-01T14:30:00'
        });
        return;
      }

      const users = await userService.getUsersRegisteredSince(startDate);
      
      if (users.length === 0) {
        res.status(404).json({ 
          message: 'No users found with Tutor or Teacher role after specified date',
          startDate: startDate.toISOString()
        });
        return;
      }

      res.json(users.map(user => ({
        ...user,
        registeredAt: user.registeredAt.toISOString()
      })));
      
    } catch (error) {
      res.status(500).json({
        error: 'Error retrieving users',
        details: (error as Error).message
      });
    }
  }
}