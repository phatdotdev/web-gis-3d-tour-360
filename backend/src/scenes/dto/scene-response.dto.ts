// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneResponseDto = exports.SceneModelDto = exports.SceneSummaryDto = void 0;
class SceneSummaryDto {
    id;
    name;
}
exports.SceneSummaryDto = SceneSummaryDto;
class SceneModelDto {
    id;
    name;
    modelUrl;
    position;
    rotation;
    scale;
    settings;
}
exports.SceneModelDto = SceneModelDto;
class SceneResponseDto {
    id;
    name;
    description;
    cameraView;
    environment;
    transitionPoints;
    parent;
    children;
    entityId;
    models;
}
exports.SceneResponseDto = SceneResponseDto;

export { SceneModelDto, SceneResponseDto, SceneSummaryDto };
