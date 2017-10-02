/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('prestataire', {
    nom: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    localisation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    siret: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'prestataire'
  });
};
