import { BANK_ACCOUNT_ROUTING_NUMBER } from "../../constants";
import { generateBankAccountNumber } from "../../utilities";
import { AccountModel } from "./model";

export const existingAccounts = async (user_id: number) => {
  try {
    const accounts = await AccountModel?.findAll({
      where: {
        user_id,
      },
    });

    return accounts;
  } catch (error: any) {
    console.error("Existing accounts: ", error?.message);
    throw new Error(error?.message);
  }
};

export const createBankAccount = async (user_id: number) => {
  try {
    const accounts = await existingAccounts(user_id);

    const account_number =
      BANK_ACCOUNT_ROUTING_NUMBER + generateBankAccountNumber();

    const result = await AccountModel?.create({
      user_id,
      account_number,
    });

    if (!!result) {
      return { result, count: accounts?.length ?? 0 };
    }

    throw new Error("Bank account creation failed, Please try again later!");
  } catch (error: any) {
    console.error("Create Bank account: ", error?.message);
    throw new Error(error?.message);
  }
};
