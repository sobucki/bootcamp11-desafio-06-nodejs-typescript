// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    try {
      await transactionsRepository.delete(id);
    } catch (error) {
      throw new AppError('It was not possible to delete the record');
    }
  }
}

export default DeleteTransactionService;
