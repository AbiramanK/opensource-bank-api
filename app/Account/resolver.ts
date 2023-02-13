import {
  Authorized,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { AuthContext } from "../../middlewares/AuthMiddleware";
import { ACCOUNT_STATUS_TYPES } from "../../types";
import { updateCustomerBankAccountsCount } from "../User/doa";
import { createBankAccount } from "./doa";

@ObjectType()
class AccountOutput {
  @Field({ nullable: false })
  id: number;

  @Field({ nullable: false })
  accountNumber: string;

  @Field({ nullable: false })
  status: ACCOUNT_STATUS_TYPES;

  @Field({ nullable: false })
  dailyTransactionLimit: number;
}

@Resolver()
export class AccountResolver {
  @Authorized("customer")
  @Mutation(() => AccountOutput)
  async create_bank_account(@Ctx() ctx: AuthContext): Promise<AccountOutput> {
    const { result, count } = await createBankAccount(ctx?.user?.id!);

    const account: number = await updateCustomerBankAccountsCount(
      ctx?.user?.id!,
      count + 1
    );

    return {
      id: result?.id!,
      accountNumber: result?.account_number!,
      status: result?.status!,
      dailyTransactionLimit: result?.daily_transaction_limit!,
    };
  }
}
