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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_token_service_1 = require("../auth-token.service");
const users_service_1 = require("../../users/users.service");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
let AuthGuard = class AuthGuard {
    authTokenService;
    usersService;
    constructor(authTokenService, usersService) {
        this.authTokenService = authTokenService;
        this.usersService = usersService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const token = authorization?.startsWith('Bearer ')
            ? authorization.slice(7).trim()
            : null;
        if (!token) {
            throw new common_1.UnauthorizedException('Thiếu access token');
        }
        const payload = this.authTokenService.verifyAccessToken(token);
        const user = await this.usersService.findOneEntity(payload.sub);
        if (user.status !== user_role_enum_1.UserStatus.Active) {
            throw new common_1.UnauthorizedException('Tài khoản không còn hoạt động');
        }
        request.user = user;
        return true;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_token_service_1.AuthTokenService,
        users_service_1.UsersService])
], AuthGuard);

export { AuthGuard };
