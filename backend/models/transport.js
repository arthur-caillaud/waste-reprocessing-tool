/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var transport = sequelize.define('transport', {
    id: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATEONLY,
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
    tableName: 'transport',
    timestamps: false
  });

  transport.associate = function(models) {
      transport.belongsTo(models.transporteur, {foreignKey: 'id_transporteur', targetKey: 'id'});
      transport.hasOne(models.bordereau, {as: 'transport1', foreignKey: 'id_transport_1', sourceKey: 'id'});
      transport.hasOne(models.bordereau, {as: 'transport2', foreignKey: 'id_transport_2', sourceKey: 'id'});
  };
  return transport;
};
