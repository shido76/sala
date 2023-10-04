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
    const location = new Location(this.data);
    const newLocation = await location.create();
    expect(newLocation).toBeTruthy();
  }),

  it('should not save if name not present', async () => {
    const data = {
      name: "",
      capacity: 100
    }

    const location = new Location(data);
    await location.isValid();
    expect(location.error['base']['name']['_errors']).toContain('Required Name');
  }),

  it('should not save if name already exists', async () => {
    const location = new Location(this.data);
    await location.create();

    await location.isValid();
    expect(location.error['name']).toMatch(/Name already in use/);
  }),

  it('should not save if capacity is less than 1', async () => {
    const data = {
      name: "Anfiteatro X",
      capacity: -1
    }

    const location = new Location(data);
    await location.isValid();
    expect(location.error['base']['capacity']['_errors']).toContain('Capacity must be greater than 0');
  }),

  it('should not save if capacity is not a number', async () => {
    const data = {
      name: "Anfiteatro X",
      capacity: "xxx"
    }

    const location = new Location(data);
    await location.isValid();
    expect(location.error['base']['capacity']['_errors']).toContain('Capacity must be a number');
  }),

  it('should throw exception if name is invalid', async () => {
    const data = {
      name: "",
      capacity: 100
    };

    const location = new Location(data);
    await expect(() => location.create(data)).rejects.toThrowError('Required Name');
  }),

  it('should retrieve all locations', async () => {
    let locations = await Location.findAll();
    expect(locations.length).toEqual(0);

    const location = new Location(this.data);
    await location.create();

    locations = await Location.findAll();
    expect(locations.length).toEqual(1);
  }),

  it('should delete a location', async () => {
    const location = await new Location(this.data).create();
    await Location.destroy(location.id);
    const locations = await Location.findAll();
    expect(locations.length).toEqual(0);
  }),

  it('should retrieve a location', async () => {
    const location = await new Location(this.data).create();
    const locationRetrieved = await Location.find(location.id);
    expect(locationRetrieved.id).toEqual(location.id);
  }),

  it('should update a location', async () => {
    const location = await new Location(this.data).create();
    const locationRetrieved = await new Location({ name: "Sala 12" }).update(location.id);
    expect(locationRetrieved.name).toEqual("Sala 12");
  }),

  it('should not update if name not present', async () => {
    const location = await new Location(this.data).create();
    await expect(() => new Location({ name: "" }).update(location.id)).rejects.toThrowError('Required Name');
  })
})
