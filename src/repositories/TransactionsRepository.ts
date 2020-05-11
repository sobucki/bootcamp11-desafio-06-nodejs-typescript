import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeList = await this.find({ where: { type: 'income' } });
    const outcomeList = await this.find({ where: { type: 'outcome' } });

    const balance = {
      income: incomeList.reduce((acc, trans) => acc + trans.value, 0),
      outcome: outcomeList.reduce((acc, trans) => acc + trans.value, 0),
      total: 0,
    };

    balance.total = balance.income - balance.outcome;

    return balance;
  }
}

export default TransactionsRepository;
