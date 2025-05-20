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
const knex_1 = __importDefault(require("../database/knex"));
const BaseRepository_1 = __importDefault(require("./BaseRepository"));
class UserRepository extends BaseRepository_1.default {
    constructor() {
        super('Users');
    }
    getFirstRegisteredUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)('Users')
                .select('*')
                .orderBy('registeredAt', 'asc')
                .first();
        });
    }
    getUsersRegisteredSince(startDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)('Users as U')
                .select([
                'U.id',
                'U.idNumber',
                'U.name',
                'U.lastName',
                'U.email',
                'U.registeredAt',
                knex_1.default.raw(`
        CASE
          WHEN T.userId IS NOT NULL THEN 'Teacher'
          WHEN TU.userId IS NOT NULL THEN 'Tutor'
          ELSE NULL
        END as role
      `)
            ])
                .leftJoin('Teachers as T', 'U.id', 'T.userId')
                .leftJoin('Tutors as TU', 'U.id', 'TU.userId')
                .where('U.registeredAt', '>=', startDate)
                .andWhere(function () {
                this.whereNotNull('T.userId').orWhereNotNull('TU.userId');
            })
                .orderBy('U.registeredAt', 'asc');
        });
    }
}
exports.default = UserRepository;
