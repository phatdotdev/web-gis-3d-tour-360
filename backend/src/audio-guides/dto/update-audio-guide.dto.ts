// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAudioGuideDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_audio_guide_dto_1 = require("./create-audio-guide.dto");
class UpdateAudioGuideDto extends (0, mapped_types_1.PartialType)(create_audio_guide_dto_1.CreateAudioGuideDto) {
}
exports.UpdateAudioGuideDto = UpdateAudioGuideDto;

export { UpdateAudioGuideDto };
