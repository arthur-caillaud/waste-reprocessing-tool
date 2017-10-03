module.exports = function(sequelize, DataTypes) {
    var distance = sequelize.define('distance', {
        prestataire1: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model:'prestataire',
                key: 'id'
            }
        },
        prestataire2: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model:'prestataire',
                key: 'id'
            }
        },
        distance: {
            type: DataTypes.INTEGER(11),
            allowNull; false
        }

    }, {
        tableName: 'distance'
    });

    return distance;
};
