"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function respondWithCreated(data, res) {
    res.status(201);
    res.json({ data: data });
}
exports.respondWithCreated = respondWithCreated;
function respondWithError(error, res) {
    res.status(400);
    res.json({ error: error.message });
}
exports.respondWithError = respondWithError;
function respondWithItem(data, res) {
    res.status(200);
    res.json({ data: data });
}
exports.respondWithItem = respondWithItem;
function respondDeleted(data, res) {
    res.status(200);
}
exports.respondDeleted = respondDeleted;
function respondWithPagination(data, res) {
    res.status(200);
    res.json({
        data: data.items,
        pagination: {
            cursor: data.cursor
        }
    });
}
exports.respondWithPagination = respondWithPagination;
//# sourceMappingURL=utils.js.map