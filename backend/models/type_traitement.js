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
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'type_traitement'
  });

  type_traitement.associate = function(models) {
      type_traitement.hasMany(models.bordereau, {foreignKey: 'id_traitement_final', sourceKey: 'id'});
      type_traitement.hasMany(model.traitement, {foreignKey: 'id_type_traitemen', sourceKey: 'id'});
  }
  return type_traitement;
};
