// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMediaFileDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_media_file_dto_1 = require("./create-media-file.dto");
class UpdateMediaFileDto extends (0, mapped_types_1.PartialType)(create_media_file_dto_1.CreateMediaFileDto) {
}
exports.UpdateMediaFileDto = UpdateMediaFileDto;

export { UpdateMediaFileDto };
