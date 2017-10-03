/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var traitement = sequelize.define('traitement', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    date_priseencharge: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_traitement: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id_prestataire: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'prestataire',
        key: 'id'
      }
    },
    id_type_traitement: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'type_traitement',
        key: 'id'
      }
    }
  }, {
    tableName: 'traitement'
  });

  traitement.associate = function(models){
      traitement.hasOne(models.prestataire, {foreignKey: 'id_prestataire', targetKey: 'id'});
      traitement.hasOne(models.type_traitement, {foreignKey: 'id_type_traitement', targetKey: 'id'});
  }

  return traitement;
};
