// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePanoramaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_panorama_dto_1 = require("./create-panorama.dto");
class UpdatePanoramaDto extends (0, mapped_types_1.PartialType)(create_panorama_dto_1.CreatePanoramaDto) {
}
exports.UpdatePanoramaDto = UpdatePanoramaDto;

export { UpdatePanoramaDto };
