import { Request, Response } from 'express';
import SchoolTermService from '../services/SchoolTermService';

const termService = new SchoolTermService();

export default class SchoolTermController {
  static async getLatestTerm(req: Request, res: Response): Promise<void> {
    try {
      const term = await termService.getLatestTerm();
      
      if (!term) {
        res.status(404).json({ 
          message: 'No se encontraron períodos escolares registrados' 
        });
        return;
      }

      res.json({
        id: term.id,
        termStartDate: term.termStartDate.toISOString().split('T')[0],
        termEndDate: term.termEndDate.toISOString().split('T')[0]
      });
      
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener el período escolar',
        details: (error as Error).message
      });
    }
  }
}