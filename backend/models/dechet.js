/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var dechet = sequelize.define('dechet', {
    codeinterne: {
      type: DataTypes.CHAR(4),
      allowNull: true
    },
    libelle: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    code_europeen: {
      type: DataTypes.CHAR(9),
      allowNull: true
    },
    categorie: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    indicateur_national_valorisation: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    famille: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    }
    }, {
    tableName: 'dechet'
    });

    dechet.associate = function(models){
         dechet.hasMany(models.bordereau, {foreignKey: 'id_dechet', sourceKey: 'id'});
    }

    return dechet
};
