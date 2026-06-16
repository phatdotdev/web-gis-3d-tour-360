// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthPasswordService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const util_1 = require("util");
const scrypt = (0, util_1.promisify)(crypto_1.scrypt);
let AuthPasswordService = class AuthPasswordService {
    async hash(value) {
        const salt = (0, crypto_1.randomBytes)(16).toString('hex');
        const derivedKey = (await scrypt(value, salt, 64));
        return `${salt}:${derivedKey.toString('hex')}`;
    }
    async verify(value, storedHash) {
        const [salt, key] = storedHash.split(':');
        if (!salt || !key)
            return false;
        const derivedKey = (await scrypt(value, salt, 64));
        const storedKey = Buffer.from(key, 'hex');
        if (storedKey.length !== derivedKey.length)
            return false;
        return (0, crypto_1.timingSafeEqual)(storedKey, derivedKey);
    }
};
exports.AuthPasswordService = AuthPasswordService;
exports.AuthPasswordService = AuthPasswordService = __decorate([
    (0, common_1.Injectable)()
], AuthPasswordService);

export { AuthPasswordService };
