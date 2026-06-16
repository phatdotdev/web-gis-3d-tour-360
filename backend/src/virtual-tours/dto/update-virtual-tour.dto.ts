// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVirtualTourDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_virtual_tour_dto_1 = require("./create-virtual-tour.dto");
class UpdateVirtualTourDto extends (0, mapped_types_1.PartialType)(create_virtual_tour_dto_1.CreateVirtualTourDto) {
}
exports.UpdateVirtualTourDto = UpdateVirtualTourDto;

export { UpdateVirtualTourDto };
