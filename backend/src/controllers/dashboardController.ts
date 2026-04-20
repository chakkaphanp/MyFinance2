import { Response } from 'express';
import { DashboardService } from '../services/dashboardService.js';
import { AuthRequest } from '../middleware/auth.js';

const dashboardService = new DashboardService();

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await dashboardService.getDashboardStats(req.userId!);
    res.json(stats);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCategoryBreakdown = async (req: AuthRequest, res: Response) => {
  try {
    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    
    const breakdown = await dashboardService.getCategoryBreakdown(
      req.userId!,
      month,
      year
    );
    res.json(breakdown);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMonthlyTrend = async (req: AuthRequest, res: Response) => {
  try {
    const months = req.query.months ? parseInt(req.query.months as string) : 6;
    
    const trend = await dashboardService.getMonthlyTrend(req.userId!, months);
    res.json(trend);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
