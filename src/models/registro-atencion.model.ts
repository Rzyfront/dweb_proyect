import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface RegistroAtencionAttributes {
  id: number;
  solicitud_tour_id: number;
  estado: 'confirmado' | 'cancelado' | 'realizado';
  fecha_registro: Date;
  comentarios?: string;
}

type RegistroAtencionCreationAttributes = Optional<RegistroAtencionAttributes, 'id'>;

class RegistroAtencion extends Model<RegistroAtencionAttributes, RegistroAtencionCreationAttributes> implements RegistroAtencionAttributes {
  public id!: number;
  public solicitud_tour_id!: number;
  public estado!: 'confirmado' | 'cancelado' | 'realizado';
  public fecha_registro!: Date;
  public comentarios?: string;
}

RegistroAtencion.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    solicitud_tour_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('confirmado', 'cancelado', 'realizado'),
      allowNull: false,
    },
    fecha_registro: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    comentarios: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: 'RegistroAtencion',
    tableName: 'registros_atencion',
    timestamps: false,
  }
);

export default RegistroAtencion;