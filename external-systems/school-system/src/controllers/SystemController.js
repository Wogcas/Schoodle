"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SystemController {
    static getInfo(req, res) {
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
exports.default = SystemController;
