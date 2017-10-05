/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var prestataire = sequelize.define('prestataire', {
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
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'prestataire',
    timestamps: false
  });

  prestataire.associate = function(models){
      prestataire.hasMany(models.traitement, {foreignKey: 'id_prestataire', sourceKey: 'id'});
  }

  return prestataire;
};
