import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Req.user exists
declare global {
    namespace Express {
        interface Request {
            user?: { id: string };
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    // Gets the Bearer Token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token not informed' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        // Valid token?
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        
        req.user = { id: payload.id }; // userId now in the req for controller functions
        return next();
    } 

    catch {
        res.status(401).json({ 
            message: 'Invalid Token' 
        });
        return;
    }
}