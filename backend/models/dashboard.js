/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var dashboard = sequelize.define('dashboard', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ecarts_pesee: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    incoherences_filieres: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    filieres_interdites: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    retards: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    volume_total: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    taux_valorisation_total: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    taux_valorisation_l_verte: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '2016-01-01'
    },
    incoherences_filieres_dd: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    filieres_interdites_dd: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    retards_dd: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    details: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    id_site: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'dashboard'
  });

  dashboard.associate = function(models) {
      dashboard.belongsTo(models.site, {foreignKey: 'id_site', targetKey: 'id'});
  }

  return dashboard;
};
