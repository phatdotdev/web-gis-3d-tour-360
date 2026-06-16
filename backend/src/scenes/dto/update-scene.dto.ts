// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSceneDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_scene_child_dto_1 = require("./create-scene-child.dto");
class UpdateSceneDto extends (0, mapped_types_1.PartialType)(create_scene_child_dto_1.CreateSceneChildDto) {
    models;
}
exports.UpdateSceneDto = UpdateSceneDto;

export { UpdateSceneDto };
