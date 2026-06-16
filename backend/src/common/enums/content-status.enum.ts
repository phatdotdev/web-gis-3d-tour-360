// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioTargetType = exports.HotspotType = exports.StorageProvider = exports.MediaType = exports.CategoryStatus = exports.ContentStatus = void 0;
var ContentStatus;
(function (ContentStatus) {
    ContentStatus["Draft"] = "draft";
    ContentStatus["Published"] = "published";
    ContentStatus["Archived"] = "archived";
})(ContentStatus || (exports.ContentStatus = ContentStatus = {}));
var CategoryStatus;
(function (CategoryStatus) {
    CategoryStatus["Active"] = "active";
    CategoryStatus["Inactive"] = "inactive";
})(CategoryStatus || (exports.CategoryStatus = CategoryStatus = {}));
var MediaType;
(function (MediaType) {
    MediaType["Image"] = "image";
    MediaType["Panorama"] = "panorama";
    MediaType["Video"] = "video";
    MediaType["Audio"] = "audio";
    MediaType["Model3d"] = "model3d";
    MediaType["Document"] = "document";
    MediaType["Thumbnail"] = "thumbnail";
})(MediaType || (exports.MediaType = MediaType = {}));
var StorageProvider;
(function (StorageProvider) {
    StorageProvider["Local"] = "local";
    StorageProvider["Minio"] = "minio";
    StorageProvider["S3"] = "s3";
    StorageProvider["R2"] = "r2";
})(StorageProvider || (exports.StorageProvider = StorageProvider = {}));
var HotspotType;
(function (HotspotType) {
    HotspotType["Info"] = "info";
    HotspotType["Navigation"] = "navigation";
    HotspotType["Audio"] = "audio";
    HotspotType["Video"] = "video";
    HotspotType["Image"] = "image";
    HotspotType["Model3d"] = "model3d";
    HotspotType["ExternalLink"] = "external_link";
})(HotspotType || (exports.HotspotType = HotspotType = {}));
var AudioTargetType;
(function (AudioTargetType) {
    AudioTargetType["SpatialEntity"] = "spatial_entity";
    AudioTargetType["VirtualTour"] = "virtual_tour";
    AudioTargetType["Panorama"] = "panorama";
    AudioTargetType["Hotspot"] = "hotspot";
})(AudioTargetType || (exports.AudioTargetType = AudioTargetType = {}));

export { AudioTargetType, CategoryStatus, ContentStatus, HotspotType, MediaType, StorageProvider };
