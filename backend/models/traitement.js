/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var traitement = sequelize.define('traitement', {
    id: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    date_priseencharge: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    date_traitement: {
      type: DataTypes.DATEONLY,
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
    tableName: 'traitement',
    timestamps: false
  });

  traitement.associate = function(models){
      traitement.belongsTo(models.prestataire, {foreignKey: 'id_prestataire', targetKey: 'id'});
      traitement.belongsTo(models.type_traitement, {foreignKey: 'id_type_traitement', targetKey: 'id'});
      traitement.hasOne(models.bordereau, {as: 'traitementInter', foreignKey: 'id_traitement_inter', sourceKey: 'id'});
      traitement.hasOne(models.bordereau, {as: 'traitementFinal', foreignKey: 'id_traitement_final', sourceKey: 'id'});
  }

  return traitement;
};
