module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('distance', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      prestataire1: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          references: {
              model:'prestataire',
              key: 'id'
          }
      },
      prestataire2: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          references: {
              model:'prestataire',
              key: 'id'
          }
      },
      distance: {
          type: Sequelize.INTEGER(11),
          allowNull: false
      }
    })

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');

  }
};
