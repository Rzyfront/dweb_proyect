import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Modelo para la tabla service_records
export interface ServiceRecordAttributes {
  id: number;
  tourRequestId: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  recordDate: Date;
  comments?: string;
}

export type ServiceRecordCreationAttributes = Optional<ServiceRecordAttributes, 'id'>;

export class ServiceRecord extends Model<ServiceRecordAttributes, ServiceRecordCreationAttributes> implements ServiceRecordAttributes {
  public id!: number;
  public tourRequestId!: number;
  public status!: 'confirmed' | 'cancelled' | 'completed';
  public recordDate!: Date;
  public comments?: string;
}

ServiceRecord.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    tourRequestId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'tour_request_id',
    },
    status: {
      type: DataTypes.ENUM('confirmed', 'cancelled', 'completed'),
      allowNull: false,
      field: 'status',
    },
    recordDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'record_date',
    },
    comments: {
      type: DataTypes.TEXT,
      field: 'comments',
    },
  },
  {
    sequelize,
    modelName: 'ServiceRecord',
    tableName: 'service_records',
    timestamps: false,
  }
);

export default ServiceRecord;