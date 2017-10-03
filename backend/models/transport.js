/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var transport = sequelize.define('transport', {
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

  transport.associate = function(models) {
      transport.belongsTo(models.transporteur, {foreignKey: 'id_transporteur', targetKey: 'id'});
      transport.belongsTo(models.bordereau, {foreignKey: 'id_transport_1', targetKey: 'id'});
  });
  return transport;
};
