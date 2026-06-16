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
exports.GeoJsonParserService = void 0;
const common_1 = require("@nestjs/common");
let GeoJsonParserService = class GeoJsonParserService {
    parse(input) {
        let parsed;
        if (typeof input === 'string') {
            try {
                parsed = JSON.parse(input);
            }
            catch {
                throw new common_1.BadRequestException('Invalid JSON format');
            }
        }
        else if (Buffer.isBuffer(input)) {
            try {
                parsed = JSON.parse(input.toString('utf-8'));
            }
            catch {
                throw new common_1.BadRequestException('Invalid JSON format in file buffer');
            }
        }
        else {
            parsed = input;
        }
        if (!parsed || parsed.type !== 'FeatureCollection' || !Array.isArray(parsed.features)) {
            throw new common_1.BadRequestException('Invalid GeoJSON: must be a FeatureCollection');
        }
        return parsed;
    }
};
exports.GeoJsonParserService = GeoJsonParserService;
exports.GeoJsonParserService = GeoJsonParserService = __decorate([
    (0, common_1.Injectable)()
], GeoJsonParserService);

export { GeoJsonParserService };
