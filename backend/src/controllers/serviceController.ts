import { Request, Response } from 'express';
import { ServiceService } from '../services/serviceService';
import { ApiResponse, ServiceQueryParams, UpdateStatusRequest } from '../types';

const serviceService = new ServiceService();

const createResponse = <T>(success: boolean, data?: T, error?: string): ApiResponse<T> => ({
  success,
  data,
  error,
  timestamp: new Date().toISOString()
});

export const getAllServices = (req: Request, res: Response): void => {
  try {
    const query: ServiceQueryParams = {
      status: req.query.status as any,
      category: req.query.category as any,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10
    };

    const services = serviceService.getAllServices(query);
    const total = serviceService.countServices(query);

    res.json(createResponse(true, {
      services,
      pagination: {
        total,
        page: query.page || 1,
        limit: query.limit || 10,
        totalPages: Math.ceil(total / (query.limit || 10))
      }
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json(createResponse(false, undefined, 'Erro ao buscar serviços'));
  }
};

export const getServiceById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const service = serviceService.getServiceById(id);

    if (!service) {
      res.status(404).json(createResponse(false, undefined, 'Serviço não encontrado'));
      return;
    }

    res.json(createResponse(true, service));
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json(createResponse(false, undefined, 'Erro ao buscar serviço'));
  }
};

export const updateServiceStatus = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { status, message }: UpdateStatusRequest = req.body;

    if (!status) {
      res.status(400).json(createResponse(false, undefined, 'Status é obrigatório'));
      return;
    }

    const service = serviceService.updateServiceStatus(id, status, message);

    if (!service) {
      res.status(404).json(createResponse(false, undefined, 'Serviço não encontrado'));
      return;
    }

    res.json(createResponse(true, service));
  } catch (error) {
    if (error instanceof Error && error.message === 'Status inválido') {
      res.status(400).json(createResponse(false, undefined, 'Status inválido'));
      return;
    }

    console.error('Error updating service status:', error);
    res.status(500).json(createResponse(false, undefined, 'Erro ao atualizar status'));
  }
};

export const refreshMonitoring = (req: Request, res: Response): void => {
  try {
    const services = serviceService.refreshMonitoring();
    res.json(createResponse(true, services));
  } catch (error) {
    console.error('Error refreshing monitoring:', error);
    res.status(500).json(createResponse(false, undefined, 'Erro ao atualizar monitoramento'));
  }
};

export const getDashboardMetrics = (req: Request, res: Response): void => {
  try {
    const metrics = serviceService.getDashboardMetrics();
    res.json(createResponse(true, metrics));
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json(createResponse(false, undefined, 'Erro ao buscar métricas'));
  }
};

export const getServiceHistory = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    const service = serviceService.getServiceById(id);
    if (!service) {
      res.status(404).json(createResponse(false, undefined, 'Serviço não encontrado'));
      return;
    }

    const history = serviceService.getServiceHistory(id, limit);
    res.json(createResponse(true, history));
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json(createResponse(false, undefined, 'Erro ao buscar histórico'));
  }
};
