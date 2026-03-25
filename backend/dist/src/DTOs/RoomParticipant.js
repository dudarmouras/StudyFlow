"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomParticipant = void 0;
const zod_1 = require("zod");
// No Update because the User is either in the room or not
exports.CreateRoomParticipant = zod_1.z.object({
    userId: zod_1.z.uuid(),
    roomId: zod_1.z.uuid(),
});
