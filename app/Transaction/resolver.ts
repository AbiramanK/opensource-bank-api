import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { AuthContext } from "../../middlewares/AuthMiddleware";
import { TRANSACTION_STATUS_TYPES } from "../../types";
import { isBankAccountBelongsToUser } from "../Account/doa";
import {
  getBankAccountBalance,
  getTransactions,
  processTransaction,
} from "./doa";
import { TransactionModel } from "./model";

@InputType()
class TransactionInput {
  @Field({ nullable: false })
  accountId: number;

  @Field({ nullable: false })
  amount: number;
}

@Resolver()
export class TransactionResolver {
  @Authorized("customer")
  @Mutation(() => TransactionModel)
  async deposit(
    @Arg("input") input: TransactionInput,
    @Ctx() ctx: AuthContext
  ): Promise<TransactionModel> {
    const { accountId, amount } = input;
    await isBankAccountBelongsToUser(accountId!, ctx?.user?.id!);

    const transaction = await processTransaction(
      accountId,
      "deposit",
      amount,
      "success"
    );

    return transaction;
  }

  @Authorized("customer")
  @Mutation(() => TransactionModel)
  async withdraw(
    @Arg("input") input: TransactionInput,
    @Ctx() ctx: AuthContext
  ): Promise<TransactionModel> {
    const { accountId, amount } = input;
    await isBankAccountBelongsToUser(accountId!, ctx?.user?.id!);

    const balance: number = await getBankAccountBalance(accountId);

    const status: TRANSACTION_STATUS_TYPES =
      balance < amount ? "cancelled" : "success";

    const transaction = await processTransaction(
      accountId,
      "withdraw",
      amount,
      status
    );

    if (status === "cancelled") {
      throw new Error("Insufficient Funds");
    }

    return transaction;
  }

  @Authorized(["customer", "banker"])
  @Query(() => [TransactionModel])
  async get_transactions(
    @Arg("accountId") accountId: number,
    @Ctx() ctx: AuthContext
  ): Promise<TransactionModel[]> {
    if (ctx?.user?.type === "customer") {
      await isBankAccountBelongsToUser(accountId, ctx?.user?.id!);
    }

    const transactions = await getTransactions(accountId);

    return transactions;
  }
}
