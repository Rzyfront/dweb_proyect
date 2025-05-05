import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class plan_turistico_sitio_turistico extends Model {
  public plan_turistico_id!: number;
  public sitio_turistico_id!: number;
  public orden_visita!: number;
  public tiempo_estancia?: number;
}

plan_turistico_sitio_turistico.init(
  {
    plan_turistico_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    sitio_turistico_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    orden_visita: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tiempo_estancia: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: 'plan_turistico_sitio_turistico',
    tableName: 'planes_turisticos_sitios_turisticos',
    timestamps: false,
  }
);

export default plan_turistico_sitio_turistico;