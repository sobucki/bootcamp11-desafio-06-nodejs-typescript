import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import Category from '../models/Category';

interface ImportTransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(inputList: ImportTransactionDTO[]): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    let allCategories = await categoriesRepository.find();
    const toSaveCategories: Category[] = [];

    const categoriesInput = [
      ...Array.from(new Set(inputList.map(input => input.category))),
    ];

    const notFounded = categoriesInput.filter(
      categoryTitle =>
        allCategories.findIndex(category => category.title === categoryTitle) <
        0,
    );

    notFounded.forEach(title =>
      toSaveCategories.push(categoriesRepository.create({ title })),
    );

    await categoriesRepository.save(toSaveCategories);

    allCategories = await categoriesRepository.find();

    const transactionsList: Transaction[] = [];

    inputList.forEach(input => {
      const { category, title, type, value } = input;
      const findedCategory = allCategories.find(cat => cat.title === category);
      transactionsList.push(
        transactionsRepository.create({
          title,
          type,
          value,
          category: findedCategory,
        }),
      );
    });

    await transactionsRepository.save(transactionsList);

    return transactionsList;
  }
}

export default ImportTransactionsService;
