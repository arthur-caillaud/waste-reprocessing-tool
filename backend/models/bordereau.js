/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var bordereau = sequelize.define('bordereau', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    num_bordereau: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cas: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    nom_emetteur: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bordereau_finished: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    mode_suivi: {
      type: DataTypes.CHAR(4),
      allowNull: true
    },
    id_traitement_prevu: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'type_traitement',
        key: 'id'
      }
    },
    id_dechet: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'dechet',
        key: 'id'
      }
    },
    ref_dossier: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_site: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'site',
        key: 'id'
      }
    },
    id_transport_1: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'transport',
        key: 'id'
      }
    },
    quantitee_transportee: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    quantitee_finale: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    quantitee_estimee: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    id_traitement_inter: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'traitement',
        key: 'id'
      }
    },
    id_transport_2: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'transport',
        key: 'id'
      }
    },
    id_traitement_final: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'traitement',
        key: 'id'
      }
    }
  }, {
    tableName: 'bordereau'
  });

  bordereau.associate = function(models){
      bordereau.hasOne(models.dechet, {foreignKey: 'id_dechet', targetKey: 'id'});
      bordereau.hasOne(models.type_traitement, {foreignKey: 'id_traitement_prevu', targetKey: 'id'});
      bordereau.hasOne(models.site, {foreignKey: 'id_site', targetKey: 'id'});
      bordereau.hasOne(models.transport, {foreignKey: 'id_transport_1', targetKey: 'id'});
      bordereau.hasOne(models.transport, {foreignKey: 'id_transport_2', targetKey: 'id'});
      bordereau.hasOne(models.traitement, {foreignKey: 'id_traitement_inter', targetKey: 'id'});
      bordereau.hasOne(models.traitement, {foreignKey: 'id_traitement_final', targetKey: 'id'});
  }

  return borderau;
};
