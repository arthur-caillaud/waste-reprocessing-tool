/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var referentiel_dechet = sequelize.define('referentiel_dechet', {
        id: {
          type: DataTypes.INTEGER(8).UNSIGNED,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        id_dechet: {
            type: DataTypes.INTEGER(8).UNSIGNED,
            allowNull: true,
            references: {
                model: 'dechet',
                key: 'id'
            }
        },
        id_type_traitement: {
            type: DataTypes.INTEGER(8).UNSIGNED,
            allowNull: true,
            references: {
                model: 'type_traitement',
                key: 'id'
            }
        }
        },
        {
            tableName: 'referentiel_dechet',
            timestamps: false
        }
    );

    referentiel_dechet.associate = function(models){
        referentiel_dechet.belongsTo(models.dechet, {foreignKey: 'id_dechet', targetKey: 'id'});
        referentiel_dechet.belongsTo(models.type_traitement, {foreignKey: 'id_type_traitement', targetKey: 'id'});
    };

    return referentiel_dechet;
};
