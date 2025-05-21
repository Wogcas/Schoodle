import { GradeSyncService } from './sync/grade-sync.service';

async function main() {
    const syncService = new GradeSyncService();
    
    try {
        // Verificación inicial obligatoria
        await syncService.initialize();
        
        // Ejecutar inmediatamente después de inicializar
        await syncService.run();
        
        // Programar ejecuciones posteriores
        setInterval(() => syncService.run(), 60 * 1000);
    } catch (error) {
        console.error('Error crítico en inicialización:', error);
        process.exit(1);
    }
}

main().catch(console.error);