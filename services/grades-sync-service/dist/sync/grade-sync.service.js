"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeSyncService = void 0;
const school_system_service_1 = require("../services/school-system/school-system.service");
const moodle_service_1 = require("../services/moodle/moodle.service");
const fs_1 = require("fs");
class GradeSyncService {
    constructor(schoolSystemService = new school_system_service_1.SchoolSystemService(), moodleService = new moodle_service_1.MoodleService()) {
        this.schoolSystemService = schoolSystemService;
        this.moodleService = moodleService;
        this.stateFile = 'sync-state.json';
        this.state = this.loadState();
    }
    async initialize() {
        await this.performHealthCheck();
        await this.checkForNewSchoolTerm();
    }
    async performHealthCheck() {
        let retries = 3;
        while (retries > 0) {
            const [schoolConnected, moodleConnected] = await Promise.all([
                this.schoolSystemService.checkConnection(),
                this.moodleService.checkConnection()
            ]);
            if (schoolConnected && moodleConnected) {
                console.log('Conexiones verificadas exitosamente');
                return;
            }
            retries--;
            console.error(`Servicios no disponibles. Intentos restantes: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, 60000)); // Esperar 1 minuto
        }
        throw new Error('No se pudo establecer conexión con los servicios requeridos');
    }
    async run() {
        try {
            // Verificar conexiones primero
            // Verificar conexiones
            const [schoolConnected, moodleConnected] = await Promise.all([
                this.schoolSystemService.checkConnection(),
                this.moodleService.checkConnection()
            ]);
            if (!schoolConnected || !moodleConnected) {
                throw new Error(`Service unavailable: School ${schoolConnected}, Moodle ${moodleConnected}`);
            }
            // Continuar con la lógica normal
            if (this.state.state === 'SEARCHING_TERM') {
                await this.checkForNewSchoolTerm();
            }
            else if (this.state.nextSyncDate) {
                const now = new Date();
                const syncDate = new Date(this.state.nextSyncDate);
                if (now >= syncDate) {
                    await this.syncGrades();
                }
            }
        }
        catch (error) {
            this.handleSyncError(error);
            this.scheduleRetry();
        }
    }
    handleSyncError(error) {
        const errorInfo = {
            timestamp: new Date().toISOString(),
            message: error instanceof Error ? error.message : 'Unknown error'
        };
        if (error instanceof Error) {
            errorInfo.stack = error.stack;
        }
        this.state.lastError = errorInfo;
        this.saveState();
    }
    scheduleRetry() {
        const retryDate = new Date();
        retryDate.setMinutes(retryDate.getMinutes() + 1);
        this.state.nextSyncDate = retryDate.toISOString();
        this.saveState();
        console.log(`Scheduled retry at ${retryDate.toISOString()}`);
    }
    async checkForNewSchoolTerm() {
        try {
            const latestTerm = await this.schoolSystemService.getLatestSchoolTerm();
            if (!latestTerm) {
                console.log('No se encontraron periodos escolares');
                return;
            }
            // Verificar si es un periodo nuevo no sincronizado
            const isNewTerm = latestTerm.id !== this.state.lastSyncedSchoolTermId;
            if (isNewTerm) {
                console.log(`Nuevo periodo detectado: ${latestTerm.id}`);
                this.transitionToWaitingState(latestTerm);
            }
            else {
                console.log('No hay nuevos periodos por sincronizar');
            }
        }
        catch (error) {
            console.error('Error en búsqueda de periodos:', error);
        }
    }
    transitionToWaitingState(term) {
        const termEndDate = new Date(term.termEndDate);
        const nextSyncDate = new Date(termEndDate);
        nextSyncDate.setDate(termEndDate.getDate() + 7);
        this.state = {
            ...this.state,
            currentSchoolTermId: term.id,
            nextSyncDate: nextSyncDate.toISOString(),
            state: 'WAITING_TERM_END'
        };
        this.saveState();
        console.log(`Programada sincronización para: ${nextSyncDate}`);
    }
    async syncGrades() {
        if (!this.state.currentSchoolTermId)
            return;
        const courses = await this.schoolSystemService.getCoursesByTerm(this.state.currentSchoolTermId);
        let allSynced = true;
        for (const course of courses) {
            const grades = await this.moodleService.getCourseGrades(course.idNumber);
            for (const student of grades) {
                if (this.isStudentComplete(student)) {
                    await this.schoolSystemService.submitGrade(course.idNumber, student.useremail, this.calculateFinalGrade(student));
                }
                else {
                    allSynced = false;
                }
            }
        }
        if (allSynced) {
            this.state.lastSyncedSchoolTermId = this.state.currentSchoolTermId;
            this.state.currentSchoolTermId = undefined;
            this.state.nextSyncDate = undefined;
            this.state.state = 'SEARCHING_TERM';
            this.saveState();
        }
        else {
            // Corregimos aquí: usar ISO string
            const nextDay = new Date();
            nextDay.setDate(nextDay.getDate() + 1);
            this.state.nextSyncDate = nextDay.toISOString();
            this.saveState();
        }
    }
    isStudentComplete(student) {
        return student.gradeItems.every(item => typeof item.grade === 'number' && !isNaN(item.grade));
    }
    calculateFinalGrade(student) {
        return student.gradeItems.reduce((sum, item) => sum + item.grade, 0);
    }
    loadState() {
        if (!(0, fs_1.existsSync)(this.stateFile))
            return this.getDefaultState();
        const rawData = (0, fs_1.readFileSync)(this.stateFile, 'utf-8');
        const data = JSON.parse(rawData);
        return {
            ...data,
            nextSyncDate: data.nextSyncDate ? new Date(data.nextSyncDate) : undefined
        };
    }
    saveState() {
        (0, fs_1.writeFileSync)(this.stateFile, JSON.stringify(this.state, null, 2));
    }
    getDefaultState() {
        return {
            state: 'SEARCHING_TERM',
            termCheckInterval: 5 // minutos
        };
    }
}
exports.GradeSyncService = GradeSyncService;
