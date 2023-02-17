import { Op, where } from "sequelize";

import { USER_TYPES } from "../../types";
import { AccountModel } from "../Account/model";
import { UserModel } from "./model";

export const isUserExist = async (
  email: string,
  user_name?: string
): Promise<UserModel | false> => {
  try {
    const result = await UserModel?.findOne({
      where: { [Op?.or]: [{ email }, { user_name: user_name ?? email }] },
    });

    if (!!result) {
      return result;
    }

    return false;
  } catch (error: any) {
    console.error("user exist check error: ", error?.message);
    throw new Error(error?.message);
  }
};

export const createUser = async (
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  user_name: string,
  type: USER_TYPES,
  address?: string,
  mobile_number?: string
) => {
  try {
    const result = await UserModel.create({
      first_name,
      last_name,
      email,
      password,
      user_name,
      type,
      address,
      mobile_number,
    });

    if (!!result) {
      return result;
    }

    throw new Error("Somthing went wrong, Please try again later!");
  } catch (error: any) {
    console.error("Create user: ", error?.message);
    throw new Error(error?.message);
  }
};

export const updateCustomerBankAccountsCount = async (
  id: number,
  count: number
): Promise<number> => {
  try {
    const result = await UserModel.update(
      {
        number_of_accounts: count,
      },
      {
        where: {
          id,
        },
      }
    );

    if (!!result) {
      return result?.[0]!;
    }

    throw new Error("Account update failed");
  } catch (error: any) {
    console.error("Update customer accounts count: ", error?.message);
    throw new Error(error?.message);
  }
};

export const getAllUsersWithBankAccounts = async (): Promise<UserModel[]> => {
  try {
    const users = await UserModel.findAll({
      include: [{ model: AccountModel, as: "accounts" }],
    });

    return users;
  } catch (error: any) {
    console.error(
      "User",
      "Resolver",
      "Get all users with bank accounts",
      error?.message
    );
    throw new Error(error?.message);
  }
};

export const getAllUsers = async (): Promise<UserModel[]> => {
  try {
    const users = await UserModel.findAll({});

    return users;
  } catch (error: any) {
    console.error("User", "Resolver", "Get all users", error?.message);
    throw new Error(error?.message);
  }
};
