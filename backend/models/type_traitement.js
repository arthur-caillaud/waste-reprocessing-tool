/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('type_traitement', {
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
};
