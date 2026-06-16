// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpatialEntityDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_spatial_entity_dto_1 = require("./create-spatial-entity.dto");
class UpdateSpatialEntityDto extends (0, mapped_types_1.PartialType)(create_spatial_entity_dto_1.CreateSpatialEntityDto) {
}
exports.UpdateSpatialEntityDto = UpdateSpatialEntityDto;

export { UpdateSpatialEntityDto };
