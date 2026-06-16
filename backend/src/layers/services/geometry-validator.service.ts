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
exports.GeometryValidatorService = void 0;
const common_1 = require("@nestjs/common");
const geojson_limits_1 = require("../constants/geojson-limits");
let GeometryValidatorService = class GeometryValidatorService {
    allowedTypes = new Set([
        'Point',
        'LineString',
        'Polygon',
        'MultiPoint',
        'MultiLineString',
        'MultiPolygon',
    ]);
    validateAndFilter(features) {
        if (features.length > geojson_limits_1.GEOJSON_LIMITS.maxFeatures) {
            throw new common_1.PayloadTooLargeException(`GeoJSON exceeds the ${geojson_limits_1.GEOJSON_LIMITS.maxFeatures} feature limit`);
        }
        let coordinatePairCount = 0;
        const validFeatures = features.filter((feature) => {
            const geometry = feature?.geometry;
            if (!geometry || !geometry.type || !geometry.coordinates) {
                return false;
            }
            if (!this.allowedTypes.has(geometry.type)) {
                return false;
            }
            coordinatePairCount += this.countCoordinatePairs(geometry.coordinates);
            if (coordinatePairCount > geojson_limits_1.GEOJSON_LIMITS.maxCoordinatePairs) {
                throw new common_1.PayloadTooLargeException(`GeoJSON exceeds the ${geojson_limits_1.GEOJSON_LIMITS.maxCoordinatePairs} coordinate-pair limit`);
            }
            return true;
        });
        return validFeatures;
    }
    countCoordinatePairs(coordinates) {
        let count = 0;
        const pending = [coordinates];
        while (pending.length > 0) {
            const current = pending.pop();
            if (!Array.isArray(current))
                continue;
            if (current.length >= 2 &&
                typeof current[0] === 'number' &&
                typeof current[1] === 'number') {
                count += 1;
                continue;
            }
            for (const child of current) {
                pending.push(child);
            }
        }
        return count;
    }
};
exports.GeometryValidatorService = GeometryValidatorService;
exports.GeometryValidatorService = GeometryValidatorService = __decorate([
    (0, common_1.Injectable)()
], GeometryValidatorService);

export { GeometryValidatorService };
