// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const users_service_1 = require("../users/users.service");
const auth_password_service_1 = require("./auth-password.service");
const auth_token_service_1 = require("./auth-token.service");
let AuthService = class AuthService {
    usersService;
    authPasswordService;
    authTokenService;
    constructor(usersService, authPasswordService, authTokenService) {
        this.usersService = usersService;
        this.authPasswordService = authPasswordService;
        this.authTokenService = authTokenService;
    }
    async register(dto) {
        const role = dto.role ?? user_role_enum_1.UserRole.Viewer;
        if (role === user_role_enum_1.UserRole.Admin) {
            throw new common_1.BadRequestException('Không thể tự đăng ký tài khoản quản trị viên');
        }
        const existing = await this.usersService.findOneByEmail(dto.email);
        if (existing) {
            throw new common_1.ConflictException(`Email ${dto.email.trim().toLowerCase()} đã được sử dụng`);
        }
        const passwordHash = await this.authPasswordService.hash(dto.password);
        const user = await this.usersService.createEntity({
            email: dto.email,
            displayName: dto.displayName,
            passwordHash,
            role,
            status: user_role_enum_1.UserStatus.Active,
        });
        return this.issueSession(user);
    }
    async login(dto) {
        const user = await this.usersService.findOneByEmailOrThrow(dto.email);
        if (user.status !== user_role_enum_1.UserStatus.Active || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Tài khoản của bạn đã bị khóa');
        }
        const isMatch = await this.authPasswordService.verify(dto.password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Email đăng nhập hoặc mật khẩu không chính xác');
        }
        return this.issueSession(user);
    }
    async refresh(dto) {
        const payload = this.authTokenService.verifyRefreshToken(dto.refreshToken);
        const user = await this.usersService.findOneEntity(payload.sub);
        if (user.status !== user_role_enum_1.UserStatus.Active || !user.refreshTokenHash) {
            throw new common_1.UnauthorizedException('Refresh token không còn hợp lệ');
        }
        const isMatch = await this.authPasswordService.verify(dto.refreshToken, user.refreshTokenHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Refresh token không còn hợp lệ');
        }
        return this.issueSession(user);
    }
    async logout(userId) {
        await this.usersService.updateRefreshTokenHash(userId, null);
        return { success: true };
    }
    async bootstrapAdmin() {
        const activeAdminCount = await this.usersService.countActiveAdmins();
        if (activeAdminCount > 0)
            return;
        const email = (process.env.AUTH_SEED_ADMIN_EMAIL || 'admin@ctu.edu.vn').trim().toLowerCase();
        const displayName = process.env.AUTH_SEED_ADMIN_NAME || 'Quản trị viên';
        const password = process.env.AUTH_SEED_ADMIN_PASSWORD || 'admin123';
        const existing = await this.usersService.findOneByEmail(email);
        const passwordHash = await this.authPasswordService.hash(password);
        if (existing) {
            existing.displayName = displayName;
            existing.role = user_role_enum_1.UserRole.Admin;
            existing.status = user_role_enum_1.UserStatus.Active;
            existing.passwordHash = passwordHash;
            existing.refreshTokenHash = null;
            await this.usersService.saveEntity(existing);
            return;
        }
        await this.usersService.createEntity({
            email,
            displayName,
            passwordHash,
            role: user_role_enum_1.UserRole.Admin,
            status: user_role_enum_1.UserStatus.Active,
        });
    }
    async issueSession(user) {
        const authUser = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.authTokenService.issueAccessToken(authUser);
        const refreshToken = this.authTokenService.issueRefreshToken(authUser);
        const refreshTokenHash = await this.authPasswordService.hash(refreshToken);
        await this.usersService.updateRefreshTokenHash(user.id, refreshTokenHash);
        return {
            accessToken,
            refreshToken,
            user: this.usersService.toPublicUser(user),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_password_service_1.AuthPasswordService,
        auth_token_service_1.AuthTokenService])
], AuthService);

export { AuthService };
