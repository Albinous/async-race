import { ICar } from '../models';
import { GarageRepository } from './garage.repository';

export class GarageService {
  private garageRepository: GarageRepository;

  constructor(garageRepository: GarageRepository) {
    this.garageRepository = garageRepository;
  }

  // returns cars

  public getCars(page: number): Promise<Array<ICar>> {
    return this.garageRepository.getCars(page);
  }

  public getCount(page: number): Promise<Response> {
    return this.garageRepository.getCount(page);
  }

  // returns a car

  public getCar(id: number): Promise<ICar> {
    return this.garageRepository.getCar(id);
  }

  // creates a car

  public createCar(request: Omit<ICar, 'id'>): Promise<ICar> {
    return this.garageRepository.createCar(request);
  }

  // delete a car

  public deleteCar(id: number): Promise<void> {
    return this.garageRepository.deleteCar(id);
  }

  // updates a car

  public updateCar(request: ICar): Promise<ICar> {
    return this.garageRepository.updateCar(request);
  }
}
