import { Router } from 'express';

const RoomRoutes = Router();

// Creating my first public route for the Room route create flow
RoomRoutes.post('/create',(req,res) => {
    const user = req.body
    res.status(201).json(user)
}
);

export default RoomRoutes;
