// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLayerDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_layer_dto_1 = require("./create-layer.dto");
class UpdateLayerDto extends (0, mapped_types_1.PartialType)(create_layer_dto_1.CreateLayerDto) {
}
exports.UpdateLayerDto = UpdateLayerDto;

export { UpdateLayerDto };
