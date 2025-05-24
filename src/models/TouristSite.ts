import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Modelo para la tabla tourist_sites
export interface TouristSiteAttributes {
  id: number;
  name: string;
  location?: string;
  siteType: 'natural' | 'cultural' | 'other';
  description?: string;
}

export type TouristSiteCreationAttributes = Optional<TouristSiteAttributes, 'id' | 'siteType'>;

export class TouristSite extends Model<TouristSiteAttributes, TouristSiteCreationAttributes> implements TouristSiteAttributes {
  public id!: number;
  public name!: string;
  public location?: string;
  public siteType!: 'natural' | 'cultural' | 'other';
  public description?: string;

  // Asociaciones
  public readonly tourPlans?: any[];
  public readonly tourPlanTouristSites?: any[];
}

TouristSite.init(
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
    location: {
      type: DataTypes.STRING(150),
      field: 'location',
    },
    siteType: {
      type: DataTypes.ENUM('natural', 'cultural', 'other'),
      defaultValue: 'other',
      field: 'site_type',
    },
    description: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: 'TouristSite',
    tableName: 'tourist_sites',
    timestamps: false,
  }
);

export default TouristSite;