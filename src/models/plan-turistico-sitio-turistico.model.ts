import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class PlanTuristicoSitioTuristico extends Model {
  public plan_turistico_id!: number;
  public sitio_turistico_id!: number;
  public orden_visita!: number;
  public tiempo_estancia?: number;
}

PlanTuristicoSitioTuristico.init(
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
    modelName: 'PlanTuristicoSitioTuristico',
    tableName: 'planes_turisticos_sitios_turisticos',
    timestamps: false,
  }
);

export default PlanTuristicoSitioTuristico;