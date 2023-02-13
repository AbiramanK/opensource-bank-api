import { sequelize } from "../../server/dbconfig";

import { QueryTypes } from "sequelize";
import { TRANSACTION_STATUS_TYPES, TRANSACTION_TYPES } from "../../types";
import { TransactionModel } from "./model";

export const getBankAccountBalance = async (account_id: number) => {
  try {
    const [{ balance }] = (await sequelize.query(
      `SELECT
      (
          SELECT
              SUM(transaction.amount)
          FROM
              transactions as transaction
          WHERE
              transaction.type = "deposit"
              AND transaction.status = :status
              AND transaction.account_id = :account_id
              AND transaction.deleted_at is :deleted_at
      ) - (
          SELECT
              SUM(transaction.amount)
          FROM
              transactions as transaction
          WHERE
              transaction.type = "withdraw"
              AND transaction.status = :status
              AND transaction.account_id = :account_id
              AND transaction.deleted_at is :deleted_at
      ) as balance`,
      {
        replacements: { account_id, status: "success", deleted_at: null },
        logging: console.log,
        raw: true,
        type: QueryTypes.SELECT,
      }
    )) as [{ balance: string }];

    return parseInt(balance ?? "0");
  } catch (error: any) {
    console.error(
      "Transaction",
      "DOA",
      "Get bank account balance",
      error?.message
    );
    throw new Error(error?.message);
  }
};

export const processTransaction = async (
  account_id: number,
  type: TRANSACTION_TYPES,
  amount: number,
  status: TRANSACTION_STATUS_TYPES
): Promise<TransactionModel> => {
  try {
    const transaction = await TransactionModel.create({
      account_id,
      type,
      amount,
      status,
    });

    if (!transaction) {
      throw new Error("Transaction process failed");
    }

    return transaction;
  } catch (error: any) {
    console.error("Transaction", "DOA", "Process transaction", error?.message);
    throw new Error(error?.message);
  }
};

export const getTransactions = async (
  account_id: number
): Promise<TransactionModel[]> => {
  try {
    const transactions = await TransactionModel.findAll({
      where: { account_id },
    });

    if (transactions?.length === 0) {
      throw new Error("No transactions available to this bank account");
    }

    return transactions;
  } catch (error: any) {
    console.error("Transaction", "DOA", "Get transactions", error?.message);
    throw new Error(error?.message);
  }
};
