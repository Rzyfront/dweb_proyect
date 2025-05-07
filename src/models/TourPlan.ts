import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Modelo para la tabla tour_plans
export interface TourPlanAttributes {
  id: number;
  name: string;
  description?: string;
  totalDuration?: number;
  price: number;
}

export type TourPlanCreationAttributes = Optional<TourPlanAttributes, 'id'>;

export class TourPlan extends Model<TourPlanAttributes, TourPlanCreationAttributes> implements TourPlanAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public totalDuration?: number;
  public price!: number;
}

TourPlan.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: DataTypes.TEXT,
    totalDuration: {
      type: DataTypes.INTEGER,
      field: 'total_duration',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TourPlan',
    tableName: 'tour_plans',
    timestamps: false,
  }
);

export default TourPlan;