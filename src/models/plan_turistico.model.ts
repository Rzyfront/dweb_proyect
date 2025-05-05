import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PlanTuristicoAttributes {
  id: number;
  nombre: string;
  descripcion?: string;
  duracion_total?: number;
  precio: number;
}

type PlanTuristicoCreationAttributes = Optional<PlanTuristicoAttributes, 'id'>;

class plan_turistico extends Model<PlanTuristicoAttributes, PlanTuristicoCreationAttributes> implements PlanTuristicoAttributes {
  public id!: number;
  public nombre!: string;
  public descripcion?: string;
  public duracion_total?: number;
  public precio!: number;
}

plan_turistico.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descripcion: DataTypes.TEXT,
    duracion_total: DataTypes.INTEGER,
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'plan_turistico',
    tableName: 'planes_turisticos',
    timestamps: false,
  }
);

export default plan_turistico;