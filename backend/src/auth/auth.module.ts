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
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("../users/users.module");
const auth_bootstrap_service_1 = require("./auth-bootstrap.service");
const auth_controller_1 = require("./auth.controller");
const auth_password_service_1 = require("./auth-password.service");
const auth_service_1 = require("./auth.service");
const auth_token_service_1 = require("./auth-token.service");
const auth_guard_1 = require("./guards/auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => users_module_1.UsersModule)],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            auth_password_service_1.AuthPasswordService,
            auth_token_service_1.AuthTokenService,
            auth_bootstrap_service_1.AuthBootstrapService,
            auth_guard_1.AuthGuard,
            roles_guard_1.RolesGuard,
        ],
        exports: [
            auth_service_1.AuthService,
            auth_password_service_1.AuthPasswordService,
            auth_token_service_1.AuthTokenService,
            auth_guard_1.AuthGuard,
            roles_guard_1.RolesGuard,
            users_module_1.UsersModule,
        ],
    })
], AuthModule);

export { AuthModule };
