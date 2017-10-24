/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var site = sequelize.define('site', {
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    site_production: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    unite_dependance: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    up_dependance: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    metier_dependance: {
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
    tableName: 'site',
    timestamps: false
  });

  site.associate = function(models){
      site.hasMany(models.bordereau, {foreignKey: 'id_site', sourceKey: 'id'});
      site.hasMany(models.dashboard, {foreignKey: 'id_site', sourceKey: 'id'});
      site.belongsTo(models.localisation, {foreignKey: 'id', targetKey: 'id_site'});
  };

  return site;
};
