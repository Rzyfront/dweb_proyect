import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

// Modelo para la tabla tour_plan_tourist_site (tabla pivote)
export class TourPlanTouristSite extends Model {
  public tourPlanId!: number;
  public touristSiteId!: number;
  public visitOrder!: number;
  public stayTime?: number;

  // Asociaciones
  public readonly tourPlan?: any;
  public readonly touristSite?: any;
}

TourPlanTouristSite.init(
  {
    tourPlanId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      field: 'tour_plan_id',
      references: {
        model: 'tour_plans',
        key: 'id',
      },
    },
    touristSiteId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      field: 'tourist_site_id',
      references: {
        model: 'tourist_sites',
        key: 'id',
      },
    },
    visitOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'visit_order',
    },
    stayTime: {
      type: DataTypes.INTEGER,
      field: 'stay_time',
    },
  },
  {
    sequelize,
    modelName: 'TourPlanTouristSite',
    tableName: 'tour_plan_tourist_site',
    timestamps: false,
  }
);

export default TourPlanTouristSite;