// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var GeoJsonDownloaderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoJsonDownloaderService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let GeoJsonDownloaderService = GeoJsonDownloaderService_1 = class GeoJsonDownloaderService {
    logger = new common_1.Logger(GeoJsonDownloaderService_1.name);
    async download(url) {
        if (!url || !url.trim()) {
            return null;
        }
        try {
            const response = await axios_1.default.get(url, { timeout: 5000 });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to download GeoJSON from ${url}: ${error.message}`);
            return null;
        }
    }
};
exports.GeoJsonDownloaderService = GeoJsonDownloaderService;
exports.GeoJsonDownloaderService = GeoJsonDownloaderService = GeoJsonDownloaderService_1 = __decorate([
    (0, common_1.Injectable)()
], GeoJsonDownloaderService);

export { GeoJsonDownloaderService };
