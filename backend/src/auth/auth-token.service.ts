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
exports.AuthTokenService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const base64UrlEncode = (value) => Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
const base64UrlDecode = (value) => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padding = normalized.length % 4 === 0
        ? ''
        : '='.repeat(4 - (normalized.length % 4));
    return Buffer.from(`${normalized}${padding}`, 'base64').toString('utf8');
};
let AuthTokenService = class AuthTokenService {
    secret = process.env.AUTH_JWT_SECRET || 'dev-jwt-secret-change-me';
    accessTtlSeconds = Number(process.env.AUTH_ACCESS_TTL_SECONDS || 900);
    refreshTtlSeconds = Number(process.env.AUTH_REFRESH_TTL_SECONDS || 604800);
    issueAccessToken(user) {
        return this.sign(user, 'access', this.accessTtlSeconds);
    }
    issueRefreshToken(user) {
        return this.sign(user, 'refresh', this.refreshTtlSeconds);
    }
    verifyAccessToken(token) {
        return this.verify(token, 'access');
    }
    verifyRefreshToken(token) {
        return this.verify(token, 'refresh');
    }
    sign(user, type, ttlSeconds) {
        const header = { alg: 'HS256', typ: 'JWT' };
        const now = Math.floor(Date.now() / 1000);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            type,
            jti: (0, crypto_1.randomUUID)(),
            iat: now,
            exp: now + ttlSeconds,
        };
        const encodedHeader = base64UrlEncode(JSON.stringify(header));
        const encodedPayload = base64UrlEncode(JSON.stringify(payload));
        const signature = this.signValue(`${encodedHeader}.${encodedPayload}`);
        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }
    verify(token, expectedType) {
        const [encodedHeader, encodedPayload, signature] = token.split('.');
        if (!encodedHeader || !encodedPayload || !signature) {
            throw new common_1.UnauthorizedException('Token không hợp lệ');
        }
        const expectedSignature = this.signValue(`${encodedHeader}.${encodedPayload}`);
        if (expectedSignature !== signature) {
            throw new common_1.UnauthorizedException('Token không hợp lệ');
        }
        const payload = JSON.parse(base64UrlDecode(encodedPayload));
        const now = Math.floor(Date.now() / 1000);
        if (payload.type !== expectedType) {
            throw new common_1.UnauthorizedException('Loại token không hợp lệ');
        }
        if (payload.exp <= now) {
            throw new common_1.UnauthorizedException('Token đã hết hạn');
        }
        return payload;
    }
    signValue(value) {
        return (0, crypto_1.createHmac)('sha256', this.secret)
            .update(value)
            .digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }
};
exports.AuthTokenService = AuthTokenService;
exports.AuthTokenService = AuthTokenService = __decorate([
    (0, common_1.Injectable)()
], AuthTokenService);

export { AuthTokenService };
