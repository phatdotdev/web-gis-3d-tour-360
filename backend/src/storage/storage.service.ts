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
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const minio_1 = require("minio");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const crypto_1 = require("crypto");
const content_status_enum_1 = require("../common/enums/content-status.enum");
let StorageService = StorageService_1 = class StorageService {
    configService;
    logger = new common_1.Logger(StorageService_1.name);
    provider;
    minioBucket;
    minioPublicUrl;
    minioClient;
    bucketReadyPromise = null;
    constructor(configService) {
        this.configService = configService;
        this.provider = this.configService.get('storage.provider') ?? 'minio';
        this.minioBucket =
            this.configService.get('storage.minio.bucket') ?? 'arcgis-web-map';
        this.minioPublicUrl =
            (this.configService.get('storage.minio.publicUrl') ?? '').replace(/\/$/, '');
        if (this.provider === content_status_enum_1.StorageProvider.Minio) {
            this.minioClient = new minio_1.Client({
                endPoint: this.configService.get('storage.minio.endPoint') ?? 'localhost',
                port: this.configService.get('storage.minio.port') ?? 9000,
                useSSL: this.configService.get('storage.minio.useSSL') ?? false,
                accessKey: this.configService.get('storage.minio.accessKey') ?? '',
                secretKey: this.configService.get('storage.minio.secretKey') ?? '',
            });
            return;
        }
        this.minioClient = null;
    }
    async uploadMediaFile(file, options = {}) {
        if (!file?.buffer?.length) {
            throw new common_1.InternalServerErrorException('Upload file buffer is empty');
        }
        if (this.provider === content_status_enum_1.StorageProvider.Minio) {
            return this.uploadToMinio(file, options);
        }
        return this.uploadToLocal(file);
    }
    async uploadToMinio(file, options) {
        if (!this.minioClient) {
            throw new common_1.InternalServerErrorException('MinIO client is not configured');
        }
        const objectKey = this.buildObjectKey(file.originalname, options);
        try {
            await this.ensureMinioBucketReady();
            await this.minioClient.putObject(this.minioBucket, objectKey, file.buffer, file.size, {
                'Content-Type': file.mimetype,
            });
        }
        catch (error) {
            this.logger.error(`Failed to upload file ${file.originalname} to MinIO`, error instanceof Error ? error.stack : undefined);
            throw new common_1.InternalServerErrorException('Failed to upload file to MinIO');
        }
        return {
            fileUrl: this.buildMinioPublicUrl(objectKey),
            storagePath: objectKey,
            storageProvider: content_status_enum_1.StorageProvider.Minio,
            storedFileName: objectKey.split('/').pop() ?? objectKey,
        };
    }
    async ensureMinioBucketReady() {
        if (this.bucketReadyPromise) {
            return this.bucketReadyPromise;
        }
        this.bucketReadyPromise = (async () => {
            if (!this.minioClient) {
                throw new common_1.InternalServerErrorException('MinIO client is not configured');
            }
            const bucketExists = await this.minioClient.bucketExists(this.minioBucket);
            if (!bucketExists) {
                await this.minioClient.makeBucket(this.minioBucket);
            }
            await this.minioClient.setBucketPolicy(this.minioBucket, JSON.stringify({
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: { AWS: ['*'] },
                        Action: ['s3:GetObject'],
                        Resource: [`arn:aws:s3:::${this.minioBucket}/*`],
                    },
                ],
            }));
        })().catch((error) => {
            this.bucketReadyPromise = null;
            throw error;
        });
        return this.bucketReadyPromise;
    }
    async uploadToLocal(file) {
        const storedFileName = this.buildStoredFileName(file.originalname);
        const relativePath = `/uploads/media/${storedFileName}`;
        const absoluteDirectory = (0, path_1.join)(process.cwd(), 'uploads', 'media');
        const absolutePath = (0, path_1.join)(absoluteDirectory, storedFileName);
        await (0, promises_1.mkdir)(absoluteDirectory, { recursive: true });
        await (0, promises_1.writeFile)(absolutePath, file.buffer);
        return {
            fileUrl: relativePath,
            storagePath: absolutePath,
            storageProvider: content_status_enum_1.StorageProvider.Local,
            storedFileName,
        };
    }
    buildObjectKey(originalName, options) {
        const extension = (0, path_1.extname)(originalName).toLowerCase();
        const storedFileName = this.buildStoredFileName(originalName);
        const ownerSegment = this.sanitizeSegment(options.ownerType ?? 'shared');
        const mediaSegment = this.sanitizeSegment(options.mediaType ?? 'generic');
        return `${mediaSegment}/${ownerSegment}/${storedFileName}${extension && !storedFileName.endsWith(extension) ? '' : ''}`;
    }
    buildStoredFileName(originalName) {
        const extension = (0, path_1.extname)(originalName).toLowerCase();
        const baseName = originalName.slice(0, Math.max(0, originalName.length - extension.length));
        const safeBaseName = this.sanitizeSegment(baseName) || 'file';
        return `${Date.now()}-${(0, crypto_1.randomUUID)()}-${safeBaseName}${extension}`;
    }
    sanitizeSegment(value) {
        return value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-_]+/g, '-')
            .replace(/-{2,}/g, '-')
            .replace(/^-|-$/g, '');
    }
    buildMinioPublicUrl(objectKey) {
        if (this.minioPublicUrl) {
            return `${this.minioPublicUrl}/${objectKey}`;
        }
        const useSsl = this.configService.get('storage.minio.useSSL') ?? false;
        const protocol = useSsl ? 'https' : 'http';
        const endPoint = this.configService.get('storage.minio.endPoint') ?? 'localhost';
        const port = this.configService.get('storage.minio.port') ?? 9000;
        return `${protocol}://${endPoint}:${port}/${this.minioBucket}/${objectKey}`;
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);

export { StorageService };
