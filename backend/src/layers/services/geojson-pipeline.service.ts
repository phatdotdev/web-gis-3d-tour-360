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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoJsonPipelineService = void 0;
const common_1 = require("@nestjs/common");
const geojson_parser_service_1 = require("./geojson-parser.service");
const geometry_validator_service_1 = require("./geometry-validator.service");
const feature_processor_service_1 = require("./feature-processor.service");
const render_data_generator_service_1 = require("./render-data-generator.service");
let GeoJsonPipelineService = class GeoJsonPipelineService {
    parser;
    validator;
    processor;
    renderGenerator;
    constructor(parser, validator, processor, renderGenerator) {
        this.parser = parser;
        this.validator = validator;
        this.processor = processor;
        this.renderGenerator = renderGenerator;
    }
    process(geoJsonInput, layerConfig) {
        const rawCollection = this.parser.parse(geoJsonInput);
        const filteredFeatures = this.validator.validateAndFilter(rawCollection.features);
        const processedFeatures = this.processor.process(filteredFeatures, layerConfig);
        const extent = this.renderGenerator.calculateExtent(processedFeatures);
        const representative = processedFeatures[0];
        const geometryType = representative?.geometry?.type ?? 'Point';
        const representativeProperties = representative?.properties ?? {};
        const renderer = this.renderGenerator.buildRenderer(geometryType, representativeProperties);
        const popupTemplate = this.renderGenerator.buildPopupTemplate(processedFeatures);
        const featureCollection = {
            type: 'FeatureCollection',
            features: processedFeatures,
        };
        const result = {
            featureCollection,
            extent,
            renderer,
            popupTemplate,
        };
        if (geometryType.includes('Line')) {
            result.vertexFeatureCollection = this.renderGenerator.buildVertexCollection(processedFeatures);
        }
        return result;
    }
};
exports.GeoJsonPipelineService = GeoJsonPipelineService;
exports.GeoJsonPipelineService = GeoJsonPipelineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [geojson_parser_service_1.GeoJsonParserService,
        geometry_validator_service_1.GeometryValidatorService,
        feature_processor_service_1.FeatureProcessorService,
        render_data_generator_service_1.RenderDataGeneratorService])
], GeoJsonPipelineService);

export { GeoJsonPipelineService };
