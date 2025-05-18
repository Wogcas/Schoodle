import { Request, Response } from "express";

export default class SystemController {
    static getInfo(req: Request, res: Response) {
      const systemInfo = {
        name: "School-System",
        description: "Componente para gestión escolar",
        version: "1.0.0",
        availablePaths: {
          grades: {
            sync: {
              method: "POST",
              path: "/api/school-system/grades/sync",
              description: "Sincroniza calificaciones desde otro sistema"
            }
            // Otras rutas de grades si existen
          },
          violations: {
            create: {
              method: "POST",
              path: "/api/school-system/violations/",
              description: "Genera reporte de entregas tardías de calificaciones"
            }
            // Otras rutas de violations si existen
          }
        }
      };
  
      res.json(systemInfo);
    }
}