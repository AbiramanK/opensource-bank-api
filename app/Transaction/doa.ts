import { sequelize } from "../../server/dbconfig";

import { QueryTypes } from "sequelize";

export const getBankAccountBalance = async (account_id: number) => {
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
};
