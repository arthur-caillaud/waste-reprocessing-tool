/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var type_traitement = sequelize.define('type_traitement', {
    code_dr: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    code_edf: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    qualification: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'type_traitement',
    timestamps: false
  });

  type_traitement.associate = function(models) {
      type_traitement.belongsToMany(models.bordereau, {through: 'bordereauxForTraitementPrevu', foreignKey: 'id', sourceKey: 'id_traitement_prevu'});
      type_traitement.hasMany(models.traitement, {foreignKey: 'id_type_traitement', sourceKey: 'id'});
      type_traitement.hasMany(models.referentiel_dechet, {foreignKey: 'id_type_traitement', sourceKey: 'id'})
  }
  return type_traitement;
};
