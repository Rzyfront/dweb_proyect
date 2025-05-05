import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SolicitudTourAttributes {
  id: number;
  cliente_id: number;
  plan_turistico_id: number;
  fecha_solicitud: Date;
  fecha_tour: Date;
  numero_personas: number;
  observaciones?: string;
}

type SolicitudTourCreationAttributes = Optional<SolicitudTourAttributes, 'id'>;

class solicitud_tour extends Model<SolicitudTourAttributes, SolicitudTourCreationAttributes> implements SolicitudTourAttributes {
  public id!: number;
  public cliente_id!: number;
  public plan_turistico_id!: number;
  public fecha_solicitud!: Date;
  public fecha_tour!: Date;
  public numero_personas!: number;
  public observaciones?: string;
}

solicitud_tour.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    cliente_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    plan_turistico_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    fecha_solicitud: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_tour: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    numero_personas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    observaciones: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: 'solicitud_tour',
    tableName: 'solicitudes_tour',
    timestamps: false,
  }
);

export default solicitud_tour;