import { PrismaClient } from '@prisma/client';
import { expect, describe, it, beforeEach } from 'vitest';
import Location from '../../models/location.js';

const prisma = new PrismaClient();

describe ('location', () => {
  beforeEach(async () => {
    this.data = {
      name: "Anfiteatro X",
      capacity: 100
    };

    await prisma.$transaction([
      prisma.location.deleteMany({})
    ]);
    await prisma.$disconnect();
  });

  it('should save', async () => {
    const location = new Location();
    const newLocation = await location.create(this.data);
    expect(newLocation).toBeTruthy();
  }),

  it('should not save if name not present', async () => {
    const data = {
      name: "",
      capacity: 100
    }

    const location = new Location();
    await location.isValid(data);
    expect(location.error['base']['name']['_errors']).toContain('Required Name');
  }),

  it('should not save if name already exists', async () => {
    const location = new Location();
    await location.create(this.data);

    await location.isValid(this.data);
    expect(location.error['name']).toMatch(/Name already in use/);
  }),

  it('should not save if capacity is less than 1', async () => {
    const data = {
      name: "Anfiteatro X",
      capacity: -1
    }

    const location = new Location();
    await location.isValid(data);
    expect(location.error['base']['capacity']['_errors']).toContain('Capacity must be greater than 0');
  }),

  it('should not save if capacity is not a number', async () => {
    const data = {
      name: "Anfiteatro X",
      capacity: "xxx"
    }

    const location = new Location();
    await location.isValid(data);
    expect(location.error['base']['capacity']['_errors']).toContain('Capacity must be a number');
  }),

  it('should throw exception if data is invalid', async () => {
    const data = {
      name: "",
      capacity: 100
    };

    const location = new Location();
    await expect(() => location.create(data)).rejects.toThrowError('Required Name');
  }),

  it('should retrieve all locations', async () => {
    let locations = await Location.findAll();
    expect(locations.length).toEqual(0);

    const location = new Location();
    await location.create(this.data);

    locations = await Location.findAll();
    expect(locations.length).toEqual(1);
  })
})
