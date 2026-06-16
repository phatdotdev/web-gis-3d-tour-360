// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "admin";
    UserRole["Viewer"] = "viewer";
    UserRole["LocationManager"] = "location_manager";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["Active"] = "active";
    UserStatus["Inactive"] = "inactive";
})(UserStatus || (exports.UserStatus = UserStatus = {}));

export { UserRole, UserStatus };
