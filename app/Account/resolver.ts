import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { AuthContext } from "../../middlewares/AuthMiddleware";
import { ACCOUNT_STATUS_TYPES } from "../../types";
import { getBankAccountBalance } from "../Transaction/doa";
import { updateCustomerBankAccountsCount } from "../User/doa";
import {
  activateBankAccount,
  createBankAccount,
  getBankAccount,
  getBankAccounts,
  isBankAccountBelongsToUser,
} from "./doa";
import { AccountModel } from "./model";

@InputType()
class ActivateBankAccountInput {
  @Field({ nullable: false })
  account_id: number;
}

@InputType()
class GetBankAccountBalanceInput {
  @Field({ nullable: false })
  account_id: number;
}

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

@ObjectType()
class GetBankAccountBalanceOutput {
  @Field({ nullable: false })
  accountId: number;

  @Field({ nullable: false })
  balance: number;
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

  @Authorized("banker")
  @Mutation(() => Boolean)
  async activate_bank_account(
    @Arg("input") input: ActivateBankAccountInput
  ): Promise<boolean> {
    const account = await getBankAccount(input?.account_id);

    if (account?.status === "active") {
      throw new Error("Bank account already activated");
    }

    const activate: boolean = await activateBankAccount(input?.account_id!);

    return activate;
  }

  @Authorized()
  @Query(() => [GetBankAccountBalanceOutput])
  async get_bank_account_balace(
    @Arg("accounts", (type) => [GetBankAccountBalanceInput])
    accounts: GetBankAccountBalanceInput[],
    @Ctx() ctx: AuthContext
  ) {
    if (ctx?.user?.type === "customer") {
      for (let account of accounts) {
        await isBankAccountBelongsToUser(account?.account_id!, ctx?.user?.id!);
      }
    }

    const result = await Promise.all(
      accounts?.map(
        async (account: GetBankAccountBalanceInput, index: number) => {
          return {
            accountId: account?.account_id!,
            balance: await getBankAccountBalance(account?.account_id),
          };
        }
      )
    );

    return result;
  }

  @Authorized("customer")
  @Query(() => [AccountModel])
  async get_bank_accounts(@Ctx() ctx: AuthContext): Promise<AccountModel[]> {
    const accounts = await getBankAccounts(ctx?.user?.id!);

    return accounts;
  }
}
