module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('indicators', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      }

    })

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('indicators');

  }
};
