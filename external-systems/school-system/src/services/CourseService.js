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
Object.defineProperty(exports, "__esModule", { value: true });
const CourseRepository_1 = require("../repositories/CourseRepository");
const courseRepository = new CourseRepository_1.CourseRepository();
class CourseService {
    getCoursesByTermId(termId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield courseRepository.getCoursesByTerm(termId);
            }
            catch (error) {
                throw new Error(`Error fetching courses: ${error.message}`);
            }
        });
    }
}
exports.default = CourseService;
