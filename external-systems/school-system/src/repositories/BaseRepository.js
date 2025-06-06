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
class BaseRepository {
    constructor(tableName) {
        this.tableName = tableName;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)(this.tableName).select('*');
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)(this.tableName).where({ id }).first();
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield (0, knex_1.default)(this.tableName).insert(data);
            return this.findById(id);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, knex_1.default)(this.tableName).where({ id }).update(data);
            return this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, knex_1.default)(this.tableName).where({ id }).del();
        });
    }
}
exports.default = BaseRepository;
