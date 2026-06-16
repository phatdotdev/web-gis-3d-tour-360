// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageConfig = void 0;
const config_1 = require("@nestjs/config");
exports.storageConfig = (0, config_1.registerAs)('storage', () => ({
    provider: process.env.STORAGE_PROVIDER ?? 'minio',
    minio: {
        endPoint: process.env.MINIO_ENDPOINT ?? 'localhost',
        port: Number(process.env.MINIO_PORT ?? 9000),
        useSSL: process.env.MINIO_USE_SSL === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY ?? '',
        secretKey: process.env.MINIO_SECRET_KEY ?? '',
        bucket: process.env.MINIO_BUCKET ?? 'arcgis-web-map',
        publicUrl: process.env.MINIO_PUBLIC_URL ?? '',
    },
}));

export { storageConfig };
