/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var transporteur = sequelize.define('transporteur', {
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    localisation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    siret: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'transporteur'
  });

  transporteur.associate = function(models) {
      transporteur.hasMany(models.transport, {foreignKey: 'id_transporteur', sourceKey: 'id'});
  };
  return transporteur;
};
