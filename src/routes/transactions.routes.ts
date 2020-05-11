import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import parsess from 'csv-parse/lib/sync';

import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/uploaderConfig';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

const uploader = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });

  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, type, value, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    type,
    value,
    category,
  });

  response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  response.sendStatus(204);
});

transactionsRouter.post(
  '/import',
  uploader.single('file'),
  async (request, response) => {
    const { path } = request.file;

    const content = fs.readFileSync(path, { encoding: 'utf-8' });

    const records = parsess(content, {
      columns: true,
      ltrim: true,
      skip_empty_lines: true,
      delimiter: ',',
    });

    const importTransactionsService = new ImportTransactionsService();

    const transactionsList = await importTransactionsService.execute(records);

    return response.json(transactionsList);
    // TODO
  },
);

export default transactionsRouter;
