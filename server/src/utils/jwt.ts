import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_do_not_use_in_production';

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '30d',
    });
};
