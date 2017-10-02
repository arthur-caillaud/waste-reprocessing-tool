/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('traitement', {
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
};
