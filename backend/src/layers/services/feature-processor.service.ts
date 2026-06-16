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
exports.FeatureProcessorService = void 0;
const common_1 = require("@nestjs/common");
let FeatureProcessorService = class FeatureProcessorService {
    mapRenderType(geometryType) {
        if (geometryType === 'Point' || geometryType === 'MultiPoint') {
            return 'point';
        }
        if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
            return 'line';
        }
        return 'polygon';
    }
    process(features, layerConfig) {
        return features.map((feature, index) => {
            const properties = feature.properties ?? {};
            const geometryType = feature.geometry.type;
            const renderType = properties.renderType ?? this.mapRenderType(geometryType);
            const elevation = Number(properties.elevation ?? layerConfig.elevation ?? 0);
            const height = Number(properties.height ?? layerConfig.height ?? 0);
            const width = Number(properties.width ?? 1);
            const scale = Number(properties.scale ?? layerConfig.scale ?? 1);
            const opacity = Number(properties.opacity ?? 1);
            const color = properties.color ?? null;
            const assetUrl = properties.assetUrl ?? layerConfig.modelUrl ?? null;
            const iconUrl = properties.iconUrl ?? layerConfig.iconUrl ?? null;
            const processedProperties = {
                ...properties,
                name: properties.name ?? `feature_${index + 1}`,
                type: properties.type ?? geometryType.toLowerCase(),
                renderType,
                elevation,
                height,
                width,
                scale,
                opacity,
                color,
                assetUrl,
                iconUrl,
            };
            return {
                ...feature,
                id: feature.id ?? index + 1,
                properties: processedProperties,
            };
        });
    }
};
exports.FeatureProcessorService = FeatureProcessorService;
exports.FeatureProcessorService = FeatureProcessorService = __decorate([
    (0, common_1.Injectable)()
], FeatureProcessorService);

export { FeatureProcessorService };
