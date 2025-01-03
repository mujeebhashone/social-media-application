import { Request, Response } from 'express';

export const logger = (req?: Request | null, res?: Response | null, message?: string) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message || ''}`);
};