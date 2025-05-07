import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Modelo para la tabla tour_requests
export interface TourRequestAttributes {
  id: number;
  customerId: number;
  tourPlanId: number;
  requestDate: Date;
  tourDate: Date;
  peopleCount: number;
  notes?: string;
}

export type TourRequestCreationAttributes = Optional<TourRequestAttributes, 'id'>;

export class TourRequest extends Model<TourRequestAttributes, TourRequestCreationAttributes> implements TourRequestAttributes {
  public id!: number;
  public customerId!: number;
  public tourPlanId!: number;
  public requestDate!: Date;
  public tourDate!: Date;
  public peopleCount!: number;
  public notes?: string;
}

TourRequest.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'customer_id',
    },
    tourPlanId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'tour_plan_id',
    },
    requestDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'request_date',
    },
    tourDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'tour_date',
    },
    peopleCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'people_count',
    },
    notes: {
      type: DataTypes.TEXT,
      field: 'notes',
    },
  },
  {
    sequelize,
    modelName: 'TourRequest',
    tableName: 'tour_requests',
    timestamps: false,
  }
);

export default TourRequest;