"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIResponse = exports.Status = void 0;
var Status;
(function (Status) {
    Status["ERROR"] = "error";
    Status["SUCCESS"] = "success";
})(Status = exports.Status || (exports.Status = {}));
class APIResponse {
    constructor(status, data, message) {
        this.status = status;
        this.data = data;
        this.message = message;
    }
}
exports.APIResponse = APIResponse;
