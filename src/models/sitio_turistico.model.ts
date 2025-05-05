import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SitioTuristicoAttributes {
  id: number;
  nombre: string;
  ubicacion?: string;
  tipo_sitio: 'natural' | 'cultural' | 'otro';
  descripcion?: string;
}

type SitioTuristicoCreationAttributes = Optional<SitioTuristicoAttributes, 'id' | 'tipo_sitio'>;

class sitio_turistico extends Model<SitioTuristicoAttributes, SitioTuristicoCreationAttributes> implements SitioTuristicoAttributes {
  public id!: number;
  public nombre!: string;
  public ubicacion?: string;
  public tipo_sitio!: 'natural' | 'cultural' | 'otro';
  public descripcion?: string;
}

sitio_turistico.init(
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
    ubicacion: DataTypes.STRING(150),
    tipo_sitio: {
      type: DataTypes.ENUM('natural', 'cultural', 'otro'),
      defaultValue: 'otro',
    },
    descripcion: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: 'sitio_turistico',
    tableName: 'sitios_turisticos',
    timestamps: false,
  }
);

export default sitio_turistico;