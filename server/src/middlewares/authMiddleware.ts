import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

interface JwtPayload {
    userId: string;
}

export const protect = (req: Request, res: Response, next: NextFunction): void => {
    let token;

    // Check for token in cookies
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
