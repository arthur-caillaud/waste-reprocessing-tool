module.exports = function(sequelize, DataTypes) {
    var localisation = sequelize.define('localisation', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        id_site: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'site',
                key: 'id'
            }
        },
        latitude: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: '0'
        },
        longitude: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: '0'
        }
    }, {
        tableName: 'localisation',
        timestamps: false
    });

    localisation.associate = function(models) {
        localisation.hasOne(models.site, {foreignKey: 'id', sourceKey: 'id_site'});
    };

    return localisation
}
