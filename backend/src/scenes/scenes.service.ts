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
exports.ScenesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const scene_entity_1 = require("./entities/scene.entity");
const scene_model_entity_1 = require("./entities/scene-model.entity");
const spatial_entity_entity_1 = require("../spatial-entities/entities/spatial-entity.entity");
let ScenesService = class ScenesService {
    sceneRepository;
    sceneModelRepository;
    spatialEntityRepository;
    constructor(sceneRepository, sceneModelRepository, spatialEntityRepository) {
        this.sceneRepository = sceneRepository;
        this.sceneModelRepository = sceneModelRepository;
        this.spatialEntityRepository = spatialEntityRepository;
    }
    toSummary(scene) {
        if (!scene)
            return null;
        return { id: scene.id, name: scene.name };
    }
    toResponse(scene) {
        return {
            id: scene.id,
            name: scene.name,
            description: scene.description ?? null,
            cameraView: scene.cameraView ?? null,
            environment: scene.environment ?? null,
            transitionPoints: scene.transitionPoints ?? [],
            parent: this.toSummary(scene.parent),
            children: (scene.children ?? []).map((child) => ({
                id: child.id,
                name: child.name,
            })),
            entityId: scene.entity?.id ?? null,
            models: (scene.models ?? []).map((model) => ({
                id: model.id,
                name: model.name,
                modelUrl: model.modelUrl,
                position: model.position,
                rotation: model.rotation,
                scale: model.scale,
                settings: model.settings ?? null,
            })),
        };
    }
    async createForEntity(dto) {
        const entity = await this.spatialEntityRepository.findOne({
            where: { id: dto.entityId },
            relations: { scene: true },
        });
        if (!entity) {
            throw new common_1.NotFoundException(`SpatialEntity ${dto.entityId} not found`);
        }
        if (entity.scene) {
            throw new common_1.BadRequestException(`SpatialEntity ${dto.entityId} already has a scene`);
        }
        const scene = this.sceneRepository.create();
        Object.assign(scene, {
            name: dto.name,
            description: dto.description ?? null,
            cameraView: dto.cameraView ?? null,
            environment: dto.environment ?? null,
            transitionPoints: dto.transitionPoints ?? [],
            parent: null,
            entity,
        });
        const saved = await this.sceneRepository.save(scene);
        return this.findOne(saved.id);
    }
    async createChild(parentId, dto) {
        const parent = await this.sceneRepository.findOne({
            where: { id: parentId },
        });
        if (!parent) {
            throw new common_1.NotFoundException(`Scene ${parentId} not found`);
        }
        const scene = this.sceneRepository.create();
        Object.assign(scene, {
            name: dto.name,
            description: dto.description ?? null,
            cameraView: dto.cameraView ?? null,
            environment: dto.environment ?? null,
            transitionPoints: dto.transitionPoints ?? [],
            parent,
        });
        if (dto.models) {
            scene.models = dto.models.map((m) => this.sceneModelRepository.create({
                name: m.name,
                modelUrl: m.modelUrl,
                position: m.position,
                rotation: m.rotation,
                scale: m.scale,
                settings: m.settings ?? undefined,
            }));
        }
        const saved = await this.sceneRepository.save(scene);
        return this.findOne(saved.id);
    }
    async findByEntity(entityId) {
        const scene = await this.sceneRepository.findOne({
            where: { entity: { id: entityId } },
            relations: { parent: true, children: true, entity: true, models: true },
        });
        if (!scene) {
            throw new common_1.NotFoundException(`Scene for entity ${entityId} not found`);
        }
        return this.toResponse(scene);
    }
    async findOne(id) {
        const scene = await this.sceneRepository.findOne({
            where: { id },
            relations: { parent: true, children: true, entity: true, models: true },
        });
        if (!scene) {
            throw new common_1.NotFoundException(`Scene ${id} not found`);
        }
        return this.toResponse(scene);
    }
    async update(id, dto) {
        const scene = await this.sceneRepository.findOne({
            where: { id },
            relations: { parent: true, children: true, entity: true, models: true },
        });
        if (!scene) {
            throw new common_1.NotFoundException(`Scene ${id} not found`);
        }
        if (dto.models) {
            await this.sceneModelRepository.delete({ scene: { id } });
            scene.models = dto.models.map((m) => this.sceneModelRepository.create({
                name: m.name,
                modelUrl: m.modelUrl,
                position: m.position,
                rotation: m.rotation,
                scale: m.scale,
                settings: m.settings ?? undefined,
                scene,
            }));
        }
        Object.assign(scene, {
            name: dto.name ?? scene.name,
            description: dto.description ?? scene.description,
            cameraView: dto.cameraView ?? scene.cameraView,
            environment: dto.environment ?? scene.environment,
            transitionPoints: dto.transitionPoints ?? scene.transitionPoints,
        });
        await this.sceneRepository.save(scene);
        return this.findOne(id);
    }
    async remove(id) {
        const scene = await this.sceneRepository.findOne({
            where: { id },
            relations: { parent: true, children: true, entity: true },
        });
        if (!scene) {
            throw new common_1.NotFoundException(`Scene ${id} not found`);
        }
        if (scene.entity) {
            throw new common_1.BadRequestException('The primary scene cannot be deleted. Rename it or delete the spatial entity instead.');
        }
        if (scene.children?.length) {
            for (const child of scene.children) {
                child.parent = scene.parent;
            }
            await this.sceneRepository.save(scene.children);
        }
        await this.sceneRepository.remove(scene);
        return { deleted: true };
    }
};
exports.ScenesService = ScenesService;
exports.ScenesService = ScenesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(scene_entity_1.Scene)),
    __param(1, (0, typeorm_1.InjectRepository)(scene_model_entity_1.SceneModel)),
    __param(2, (0, typeorm_1.InjectRepository)(spatial_entity_entity_1.SpatialEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ScenesService);

export { ScenesService };
