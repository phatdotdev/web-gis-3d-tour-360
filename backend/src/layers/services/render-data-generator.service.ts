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
exports.RenderDataGeneratorService = void 0;
const common_1 = require("@nestjs/common");
let RenderDataGeneratorService = class RenderDataGeneratorService {
    clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }
    applyOpacity(color, opacity) {
        if (typeof opacity !== 'number' || !Number.isFinite(opacity))
            return color;
        return [color[0], color[1], color[2], this.clamp(opacity, 0, 1)];
    }
    parseHex(hex) {
        const value = hex.replace('#', '').trim();
        if (![3, 4, 6, 8].includes(value.length))
            return null;
        const expand = (chunk) => chunk.length === 1 ? `${chunk}${chunk}` : chunk;
        const r = expand(value.slice(0, value.length <= 4 ? 1 : 2));
        const g = expand(value.slice(value.length <= 4 ? 1 : 2, value.length <= 4 ? 2 : 4));
        const b = expand(value.slice(value.length <= 4 ? 2 : 4, value.length <= 4 ? 3 : 6));
        const a = value.length === 4 || value.length === 8 ? expand(value.slice(-2)) : 'ff';
        const toChannel = (input) => parseInt(input, 16);
        return [
            this.clamp(toChannel(r), 0, 255),
            this.clamp(toChannel(g), 0, 255),
            this.clamp(toChannel(b), 0, 255),
            this.clamp(toChannel(a) / 255, 0, 1),
        ];
    }
    parseRgb(input) {
        const match = input
            .replace(/\s+/g, '')
            .match(/^rgba?\((\d+),(\d+),(\d+)(?:,(\d*\.?\d+))?\)$/i);
        if (!match)
            return null;
        const r = this.clamp(Number(match[1]), 0, 255);
        const g = this.clamp(Number(match[2]), 0, 255);
        const b = this.clamp(Number(match[3]), 0, 255);
        const a = match[4] != null ? this.clamp(Number(match[4]), 0, 1) : 1;
        return [r, g, b, a];
    }
    resolveColor(color, opacity) {
        if (!color || typeof color !== 'string') {
            return this.applyOpacity([56, 189, 248, 0.9], opacity);
        }
        const normalized = color.trim();
        const hex = normalized.startsWith('#') ? this.parseHex(normalized) : null;
        const rgb = hex ? null : this.parseRgb(normalized);
        const resolved = hex ?? rgb ?? [56, 189, 248, 0.9];
        return this.applyOpacity(resolved, opacity);
    }
    calculateExtent(features) {
        if (features.length === 0)
            return null;
        let xmin = Infinity;
        let ymin = Infinity;
        let xmax = -Infinity;
        let ymax = -Infinity;
        const traverse = (item) => {
            if (Array.isArray(item)) {
                if (typeof item[0] === 'number' && typeof item[1] === 'number') {
                    const lng = item[0];
                    const lat = item[1];
                    if (lng < xmin)
                        xmin = lng;
                    if (lng > xmax)
                        xmax = lng;
                    if (lat < ymin)
                        ymin = lat;
                    if (lat > ymax)
                        ymax = lat;
                }
                else {
                    item.forEach(traverse);
                }
            }
        };
        features.forEach((feature) => {
            if (feature?.geometry?.coordinates) {
                traverse(feature.geometry.coordinates);
            }
        });
        if (xmin === Infinity || ymin === Infinity || xmax === -Infinity || ymax === -Infinity) {
            return null;
        }
        return { xmin, ymin, xmax, ymax };
    }
    buildVertexCollection(features) {
        let counter = 0;
        const vertexFeatures = [];
        features.forEach((feature) => {
            const geometry = feature.geometry;
            if (!geometry || !geometry.type || !geometry.coordinates)
                return;
            const properties = this.toVertexProperties(feature.properties);
            if (geometry.type === 'LineString') {
                geometry.coordinates.forEach((coord) => {
                    vertexFeatures.push({
                        type: 'Feature',
                        id: `v-${counter++}`,
                        geometry: { type: 'Point', coordinates: coord },
                        properties,
                    });
                });
            }
            else if (geometry.type === 'MultiLineString') {
                geometry.coordinates.forEach((line) => {
                    line.forEach((coord) => {
                        vertexFeatures.push({
                            type: 'Feature',
                            id: `v-${counter++}`,
                            geometry: { type: 'Point', coordinates: coord },
                            properties,
                        });
                    });
                });
            }
        });
        return {
            type: 'FeatureCollection',
            features: vertexFeatures,
        };
    }
    toVertexProperties(properties) {
        if (!properties)
            return {};
        return {
            name: properties.name,
            type: properties.type,
            elevation: properties.elevation,
            height: properties.height,
            width: properties.width,
        };
    }
    toPointSymbol(properties, color) {
        const symbolLayers = [];
        if (properties.assetUrl) {
            symbolLayers.push({
                type: 'object',
                resource: { href: properties.assetUrl },
                height: Math.max(properties.height ?? 1, 1),
                width: Math.max(properties.width ?? 1, 1),
                depth: Math.max(properties.height ?? 1, 1),
                anchor: 'bottom',
            });
        }
        if (properties.iconUrl) {
            symbolLayers.push({
                type: 'icon',
                resource: { href: properties.iconUrl },
                size: Math.max(properties.width ?? 12, 8),
            });
        }
        else if (!properties.assetUrl) {
            symbolLayers.push({
                type: 'icon',
                resource: { primitive: 'circle' },
                size: Math.max(properties.width ?? 8, 6),
                material: { color },
                outline: { color: [255, 255, 255, 0.7], size: 1 },
            });
        }
        return {
            type: 'point-3d',
            symbolLayers,
        };
    }
    toLineSymbol(properties, color) {
        const width = Math.max(properties.width ?? 0.4, 0.2);
        const height = Math.max(properties.height ?? width, 0.2);
        return {
            type: 'line-3d',
            symbolLayers: [
                {
                    type: 'path',
                    profile: 'circle',
                    material: { color },
                    width,
                    height,
                    cap: 'round',
                    join: 'round',
                },
            ],
        };
    }
    toPolygonSymbol(color) {
        return {
            type: 'polygon-3d',
            symbolLayers: [
                {
                    type: 'fill',
                    material: { color },
                    outline: { color: [255, 255, 255, 0.2], size: 1 },
                },
            ],
        };
    }
    buildRenderer(geometryType, representativeProperties) {
        const color = this.resolveColor(representativeProperties.color, representativeProperties.opacity);
        if (geometryType.includes('Point')) {
            return {
                type: 'simple',
                symbol: this.toPointSymbol(representativeProperties, color),
            };
        }
        if (geometryType.includes('Line')) {
            return {
                type: 'simple',
                symbol: this.toLineSymbol(representativeProperties, color),
            };
        }
        return {
            type: 'simple',
            symbol: this.toPolygonSymbol(color),
        };
    }
    buildPopupTemplate(features) {
        const metadataKeys = new Set();
        features.forEach((feature) => {
            const properties = feature.properties;
            if (properties) {
                Object.keys(properties).forEach((key) => {
                    metadataKeys.add(key);
                });
            }
        });
        const fieldInfos = [
            { fieldName: 'type', label: 'Loại đối tượng' },
            { fieldName: 'renderType', label: 'Kiểu hiển thị' },
            { fieldName: 'elevation', label: 'Cao độ (m)' },
            { fieldName: 'height', label: 'Chiều cao (m)' },
            { fieldName: 'width', label: 'Độ rộng (m)' },
        ];
        const excludedKeys = new Set([
            'name',
            'type',
            'renderType',
            'elevation',
            'height',
            'width',
            'assetUrl',
            'iconUrl',
            'color',
            'opacity',
        ]);
        metadataKeys.forEach((key) => {
            if (!excludedKeys.has(key)) {
                fieldInfos.push({
                    fieldName: key,
                    label: key,
                });
            }
        });
        return {
            title: '{name}',
            content: [
                {
                    type: 'fields',
                    fieldInfos,
                },
            ],
            actions: [
                {
                    id: 'view-3d-model',
                    title: 'Xem mô hình 3D',
                    className: 'esri-icon-3d-glasses'
                }
            ]
        };
    }
};
exports.RenderDataGeneratorService = RenderDataGeneratorService;
exports.RenderDataGeneratorService = RenderDataGeneratorService = __decorate([
    (0, common_1.Injectable)()
], RenderDataGeneratorService);

export { RenderDataGeneratorService };
