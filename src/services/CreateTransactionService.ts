import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    category,
    title,
    type,
    value,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError("You don't have balance to operation");
    }

    const categoryLoaded = await categoriesRepository.findOrCreate({
      title: category,
    });

    const trasaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: categoryLoaded.id,
    });

    await transactionsRepository.save(trasaction);

    return trasaction;
  }
}

export default CreateTransactionService;
