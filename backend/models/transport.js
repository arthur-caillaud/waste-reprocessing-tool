/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transport', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    mode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_transporteur: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'transporteur',
        key: 'id'
      }
    },
    recepisse: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    immatriculation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    adr: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'transport'
  });
};
