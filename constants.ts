require("dotenv").config();

// Authentication
export const AUTH_TOKEN_SECRET =
  process.env.NODE_APP_AUTH_TOKEN_SECRET ?? "secret";
export const AUTH_TOKEN_EXP = process.env.NODE_APP_AUTH_TOKEN_EXP ?? "1h";
export const PASSWORD_ENCRYPTION_SALT_ROUNDS =
  parseInt(process.env.NODE_APP_PASSWORD_ENCRYPTION_SALT_ROUNDS!) ?? 10;

// Bank Account
export const BANK_ACCOUNT_ROUTING_NUMBER =
  process.env.NODE_APP_BANK_ACCOUNT_ROUTING_NUMBER ?? "12345789";
