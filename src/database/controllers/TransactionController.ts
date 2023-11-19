import { Transaction, ITransaction } from '../models/Transaction';

class TransactionController {
  async createTransaction(newTransaction: ITransaction): Promise<ITransaction> {
    try {

      const transaction = await Transaction.create(newTransaction);
      return transaction;
    
    } catch (error) {
    console.log(error);
      return null;
    }
  }

  async getAllTransactions(userId: string): Promise<ITransaction[]> {
    try {

      const transactions = await Transaction.find({ "$or": [{ from: userId}, { to: userId }]}).sort({ createdAt: -1 });
      return transactions;

    } catch (error) {
      return [];
    }

  }

}

export default new TransactionController();