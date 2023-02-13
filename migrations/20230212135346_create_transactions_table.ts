import { QueryInterface, DataTypes } from "sequelize";

const TABLE_NAME = "transactions";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      account_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { key: "id", model: "accounts" },
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM("deposit", "withdraw"),
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM("pending", "success", "cancelled"),
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
