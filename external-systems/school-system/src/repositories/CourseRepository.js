"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRepository = void 0;
const knex_1 = __importDefault(require("../database/knex"));
const BaseRepository_1 = __importDefault(require("./BaseRepository"));
class CourseRepository extends BaseRepository_1.default {
    constructor() {
        super('Courses');
    }
    getCoursesByTerm(termId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)('SchoolTerms as ST')
                .select([
                'C.id',
                'C.name',
                'C.idNumber'
            ])
                .innerJoin('EnrolledTerms as ET', 'ST.id', 'ET.schoolTermId')
                .innerJoin('CourseTaken as CT', 'ET.id', 'CT.enrolledTermId')
                .innerJoin('Course as C', 'CT.courseId', 'C.id')
                .where('ST.id', termId)
                .groupBy('C.id')
                .orderBy('C.name', 'asc');
        });
    }
}
exports.CourseRepository = CourseRepository;
