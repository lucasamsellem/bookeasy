import { Request, Response } from 'express';
import { customerRepository } from '../repositories/customer.repository';

export const getProfessionalsController = async (req: Request, res: Response) => {
  try {
    const professionals = await customerRepository.getProfessionals();
    res.json(professionals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
