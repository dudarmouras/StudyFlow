import { z } from 'zod';

// No Update because the User is either in the room or not
export const CreateRoomParticipant = z.object({
    userId: z.uuid(),
    roomId: z.uuid(),
});