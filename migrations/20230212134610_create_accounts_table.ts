import { QueryInterface, DataTypes, QueryTypes } from "sequelize";

const TABLE_NAME = "accounts";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { key: "id", model: "users" },
      },
      account_number: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(17),
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM("pre-active", "active", "suspended", "closed"),
        defaultValue: "pre-active",
      },
      daily_transaction_limit: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 10000,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    }),

  down: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.dropTable(TABLE_NAME),
};
