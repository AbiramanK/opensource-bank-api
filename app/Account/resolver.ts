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
import { UserModel } from "../User/model";
import {
  updateBankAccountStatus,
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

  @Field({ nullable: false })
  status: ACCOUNT_STATUS_TYPES;
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

  @Field({ nullable: false })
  user: UserModel;
}

@ObjectType()
class GetBankAccountBalanceOutput {
  @Field({ nullable: false })
  accountId: number;

  @Field({ nullable: false })
  balance: number;
}

@ObjectType()
class GetBankAccountOutput extends AccountOutput {
  @Field({ nullable: false })
  userId: number;

  @Field({ nullable: false })
  balance: number;

  @Field({ nullable: false })
  createdAt: Date;

  @Field({ nullable: false })
  updatedAt: Date;
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
      user: result?.user!,
    };
  }

  @Authorized("banker")
  @Mutation(() => Boolean)
  async update_bank_account_status(
    @Arg("input") input: ActivateBankAccountInput
  ): Promise<boolean> {
    const accountId = input?.account_id;
    const status = input?.status;

    const account = await getBankAccount(accountId);
    if (account?.status === status) {
      throw new Error(`Bank account already in ${status} status`);
    }

    if (status === "pre-active") {
      throw new Error(`Bank account status update to ${status} not possible`);
    }

    const updateStatus: boolean = await updateBankAccountStatus(
      accountId!,
      status!
    );

    return updateStatus;
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

  @Authorized("customer", "banker")
  @Query(() => [GetBankAccountOutput])
  async get_bank_accounts(
    @Ctx() ctx: AuthContext,
    @Arg("user_id", { nullable: true }) user_id?: number
  ): Promise<GetBankAccountOutput[]> {
    var userId = ctx?.user?.id!;
    if (ctx?.user?.type === "banker") {
      userId = user_id!;
    }
    const accounts = await getBankAccounts(userId);

    const accountsWithBalance = await Promise.all(
      accounts?.map(
        async (
          account: AccountModel,
          index: number
        ): Promise<GetBankAccountOutput> => {
          return {
            userId: account?.user_id!,
            id: account?.id!,
            accountNumber: account?.account_number!,
            status: account?.status!,
            dailyTransactionLimit: account?.daily_transaction_limit!,
            createdAt: account?.created_at!,
            updatedAt: account?.updated_at!,
            balance: await getBankAccountBalance(account?.id!)!,
            user: account?.user!,
          };
        }
      )
    );

    return accountsWithBalance;
  }
}
