/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var site = sequelize.define('site', {
    nom: {
      type: DataTypes.STRING(255),
      allowNull: true
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
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'site'
  });

  site.associate = function(models){
      site.hasMany(models.bordereau, {foreignKey: 'id_site', sourceKey: 'id'});
  };

  return site;
};
