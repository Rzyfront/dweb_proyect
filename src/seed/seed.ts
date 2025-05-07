import { faker } from '@faker-js/faker';
import sequelize from '../config/database';
import Customer from '../models/Customer';
import TouristSite from '../models/TouristSite';
import TourPlan from '../models/TourPlan';
import TourRequest from '../models/TourRequest';
import ServiceRecord from '../models/ServiceRecord';
import TourPlanTouristSite from '../models/TourPlanTouristSite';

const seed = async () => {
  try {
    await sequelize.sync({ force: true });

    // Customers
    const customers = [];
    for (let i = 0; i < 10; i++) {
      customers.push(await Customer.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number().slice(0, 20),
        identityDocument: faker.string.alphanumeric(10),
        nationality: faker.location.country()
      }));
    }

    // Tourist Sites
    const siteTypes = ['natural', 'cultural', 'other'] as const;
    const touristSites = [];
    for (let i = 0; i < 10; i++) {
      touristSites.push(await TouristSite.create({
        name: faker.location.city() + ' Site',
        location: faker.location.city(),
        siteType: faker.helpers.arrayElement(siteTypes),
        description: faker.lorem.sentence()
      }));
    }

    // Tour Plans
    const tourPlans = [];
    for (let i = 0; i < 5; i++) {
      tourPlans.push(await TourPlan.create({
        name: faker.company.name() + ' Tour',
        description: faker.lorem.sentences(2),
        totalDuration: faker.number.int({ min: 1, max: 10 }),
        price: faker.number.float({ min: 100, max: 1000, fractionDigits: 2 })
      }));
    }

    // Tour Requests
    const tourRequests = [];
    for (let i = 0; i < 10; i++) {
      tourRequests.push(await TourRequest.create({
        customerId: faker.helpers.arrayElement(customers).id,
        tourPlanId: faker.helpers.arrayElement(tourPlans).id,
        requestDate: faker.date.past(),
        tourDate: faker.date.future(),
        peopleCount: faker.number.int({ min: 1, max: 10 }),
        notes: faker.lorem.sentence()
      }));
    }

    // Service Records
    for (let i = 0; i < 10; i++) {
      await ServiceRecord.create({
        tourRequestId: faker.helpers.arrayElement(tourRequests).id,
        status: faker.helpers.arrayElement(['confirmed', 'cancelled', 'completed']),
        recordDate: faker.date.recent(),
        comments: faker.lorem.sentence()
      });
    }

    // TourPlanTouristSite (pivot table)
    const usedCombinations = new Set<string>();
    let count = 0;
    while (count < 15) {
      const tourPlanId = faker.helpers.arrayElement(tourPlans).id;
      const touristSiteId = faker.helpers.arrayElement(touristSites).id;
      const key = `${tourPlanId}-${touristSiteId}`;
      if (usedCombinations.has(key)) continue; // Ya existe, intenta otra combinación
      usedCombinations.add(key);
      await TourPlanTouristSite.create({
        tourPlanId,
        touristSiteId,
        visitOrder: faker.number.int({ min: 1, max: 5 }),
        stayTime: faker.number.int({ min: 1, max: 8 })
      });
      count++;
    }

    console.log('Datos de ejemplo insertados');
    process.exit(0);
  } catch (error) {
    console.error('Error al insertar datos de ejemplo:', error);
    process.exit(1);
  }
};

seed();