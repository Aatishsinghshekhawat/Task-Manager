import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/db';
import { generateToken } from '../utils/jwt';
import { registerSchema, loginSchema, RegisterInput, LoginInput } from '../dtos/auth.dto';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const body: RegisterInput = registerSchema.parse(req.body); // Validate input

        const existingUser = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hashedPassword,
            },
        });

        const token = generateToken(user.id);

        // Send token in cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ errors: error.errors });
            return;
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const body: LoginInput = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return; // Generic message for security
        }

        const isMatch = await bcrypt.compare(body.password, user.password);

        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = generateToken(user.id);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ errors: error.errors });
            return;
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ message: 'Logged out successfully' });
};
