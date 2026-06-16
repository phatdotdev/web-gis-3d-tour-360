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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_password_service_1 = require("../auth/auth-password.service");
const user_entity_1 = require("./entities/user.entity");
const user_role_enum_1 = require("./enums/user-role.enum");
const ROLE_DETAILS = [
    {
        code: user_role_enum_1.UserRole.Admin,
        name: 'Quản trị viên',
        description: 'Quản lý toàn bộ dữ liệu, người dùng và cấu hình hệ thống.',
    },
    {
        code: user_role_enum_1.UserRole.LocationManager,
        name: 'Quản lý địa điểm',
        description: 'Nền tảng cho quyền quản lý khu vực, bài viết và sản phẩm thuộc sở hữu.',
    },
    {
        code: user_role_enum_1.UserRole.Viewer,
        name: 'Người xem',
        description: 'Truy cập và xem nội dung công khai của nền tảng.',
    },
];
let UsersService = class UsersService {
    userRepository;
    authPasswordService;
    constructor(userRepository, authPasswordService) {
        this.userRepository = userRepository;
        this.authPasswordService = authPasswordService;
    }
    getRoles() {
        return ROLE_DETAILS;
    }
    async create(dto) {
        this.assertPassword(dto.password);
        const created = await this.createEntity({
            email: dto.email,
            displayName: dto.displayName,
            passwordHash: await this.authPasswordService.hash(dto.password),
            role: dto.role ?? user_role_enum_1.UserRole.Viewer,
            status: dto.status ?? user_role_enum_1.UserStatus.Active,
        });
        return this.toPublicUser(created);
    }
    async findAll(query) {
        if (query.role)
            this.assertRole(query.role);
        if (query.status)
            this.assertStatus(query.status);
        const baseWhere = {
            ...(query.role ? { role: query.role } : {}),
            ...(query.status ? { status: query.status } : {}),
        };
        const search = query.search?.trim();
        const where = search
            ? [
                { ...baseWhere, displayName: (0, typeorm_2.ILike)(`%${search}%`) },
                { ...baseWhere, email: (0, typeorm_2.ILike)(`%${search}%`) },
            ]
            : baseWhere;
        const users = await this.userRepository.find({
            where,
            order: { createdAt: 'DESC' },
        });
        return users.map((user) => this.toPublicUser(user));
    }
    async findOne(id) {
        return this.toPublicUser(await this.findOneEntity(id));
    }
    async update(id, dto) {
        const user = await this.findOneEntity(id);
        const nextRole = dto.role ?? user.role;
        const nextStatus = dto.status ?? user.status;
        this.assertRole(nextRole);
        this.assertStatus(nextStatus);
        if (dto.displayName !== undefined)
            this.assertDisplayName(dto.displayName);
        await this.assertAdminContinuity(user, nextRole, nextStatus);
        if (dto.email !== undefined) {
            const email = this.normalizeEmail(dto.email);
            const duplicate = await this.userRepository.findOne({ where: { email } });
            if (duplicate && duplicate.id !== id) {
                throw new common_1.ConflictException(`Email ${email} đã được sử dụng`);
            }
            user.email = email;
        }
        if (dto.displayName !== undefined) {
            user.displayName = dto.displayName.trim();
        }
        if (dto.password !== undefined) {
            this.assertPassword(dto.password);
            user.passwordHash = await this.authPasswordService.hash(dto.password);
            user.refreshTokenHash = null;
        }
        user.role = nextRole;
        user.status = nextStatus;
        return this.toPublicUser(await this.userRepository.save(user));
    }
    updateRole(id, role) {
        return this.update(id, { role });
    }
    updateStatus(id, status) {
        return this.update(id, { status });
    }
    async remove(id) {
        const user = await this.findOneEntity(id);
        await this.assertAdminContinuity(user, user_role_enum_1.UserRole.Viewer, user_role_enum_1.UserStatus.Inactive);
        await this.userRepository.remove(user);
        return { deleted: true };
    }
    async findOneEntity(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Không tìm thấy người dùng ${id}`);
        }
        return user;
    }
    async findOneByEmail(email) {
        return this.userRepository.findOne({
            where: { email: this.normalizeEmail(email) },
        });
    }
    async findOneByEmailOrThrow(email) {
        const user = await this.findOneByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Email đăng nhập hoặc mật khẩu không chính xác');
        }
        return user;
    }
    async createEntity(input) {
        const email = this.normalizeEmail(input.email);
        this.assertDisplayName(input.displayName);
        this.assertRole(input.role);
        this.assertStatus(input.status);
        const duplicate = await this.userRepository.findOne({ where: { email } });
        if (duplicate) {
            throw new common_1.ConflictException(`Email ${email} đã được sử dụng`);
        }
        return this.userRepository.save(this.userRepository.create({
            email,
            displayName: input.displayName.trim(),
            passwordHash: input.passwordHash,
            refreshTokenHash: null,
            role: input.role,
            status: input.status,
        }));
    }
    saveEntity(user) {
        return this.userRepository.save(user);
    }
    updateRefreshTokenHash(id, refreshTokenHash) {
        return this.userRepository.update(id, { refreshTokenHash });
    }
    countActiveAdmins() {
        return this.userRepository.count({
            where: { role: user_role_enum_1.UserRole.Admin, status: user_role_enum_1.UserStatus.Active },
        });
    }
    toPublicUser(user) {
        return {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    normalizeEmail(value) {
        const email = value?.trim().toLowerCase();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new common_1.BadRequestException('Email không hợp lệ');
        }
        return email;
    }
    assertDisplayName(value) {
        if (!value?.trim() || value.trim().length < 2) {
            throw new common_1.BadRequestException('Tên hiển thị phải có ít nhất 2 ký tự');
        }
    }
    assertPassword(value) {
        if (!value || value.trim().length < 6) {
            throw new common_1.BadRequestException('Mật khẩu phải có ít nhất 6 ký tự');
        }
    }
    assertRole(role) {
        if (!Object.values(user_role_enum_1.UserRole).includes(role)) {
            throw new common_1.BadRequestException('Vai trò người dùng không hợp lệ');
        }
    }
    assertStatus(status) {
        if (!Object.values(user_role_enum_1.UserStatus).includes(status)) {
            throw new common_1.BadRequestException('Trạng thái người dùng không hợp lệ');
        }
    }
    async assertAdminContinuity(user, nextRole, nextStatus) {
        const removesActiveAdmin = user.role === user_role_enum_1.UserRole.Admin &&
            user.status === user_role_enum_1.UserStatus.Active &&
            (nextRole !== user_role_enum_1.UserRole.Admin || nextStatus !== user_role_enum_1.UserStatus.Active);
        if (!removesActiveAdmin)
            return;
        const activeAdminCount = await this.userRepository.count({
            where: { role: user_role_enum_1.UserRole.Admin, status: user_role_enum_1.UserStatus.Active },
        });
        if (activeAdminCount <= 1) {
            throw new common_1.BadRequestException('Hệ thống phải luôn có ít nhất một quản trị viên đang hoạt động');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_password_service_1.AuthPasswordService])
], UsersService);

export { UsersService };
