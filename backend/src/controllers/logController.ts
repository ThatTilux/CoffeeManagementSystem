// src/controllers/logController.ts
import { Request, Response } from 'express';
import { Log, User } from '../models';

export const getLogs = async (req: Request, res: Response): Promise<void> => {
    const logs = await Log.findAll({
        include: [
            { model: User, as: 'user', attributes: ['name'] }, // For createUser logs
            { model: User, as: 'sender', attributes: ['name'] }, // For sender in logCoffee
            { model: User, as: 'receiver', attributes: ['name'] }, // For receiver in logCoffee
        ],
        order: [['createdAt', 'DESC']],
    });

    // Format the logs into string messages
    const formattedLogs = logs.map(log => {
        if (log.type === 'createUser') {
            return {
                message: `User ${log.user?.name} was created.`,
                createdAt: log.createdAt,
            };
        } else if (log.type === 'logCoffee') {
            return {
                message: `${log.sender?.name} bought a coffee for ${log.receiver?.name}.`,
                createdAt: log.createdAt,
            };
        } else {
            return {
                message: 'Unknown log type.',
                createdAt: log.createdAt,
            };
        }
    });

    res.json(formattedLogs);
};