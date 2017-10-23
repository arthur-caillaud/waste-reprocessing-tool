/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('dashboard', {
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
        incoherences_filieres_norm: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
        filieres_interdites_norm: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
        retards_norm: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
        volume_total: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: '0'
        },
        volume_l_verte: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: '0'
        },
        valorisation_totale: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: '0'
        },
        valorisation_l_verte: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: '0'
        },
        date: {
            type: DataTypes.DATEONLY,
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
        },
        non_dates: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
        bordereaux: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        }
    }, {
        tableName: 'dashboard',
        timestamps: false
    });
};
