import { EngineService, GarageService, ICar, WinnersRepository, WinnersService } from '../../core';
import { generateRandomColor, generateRandomName } from '../../shared';
import { Car } from '../car';
import { Winners } from '../winners';
import { GarageView } from './garage.view';

export class Garage {
  private garageService: GarageService;

  private engineService: EngineService;

  public cars: Array<Car> = [];

  private car: ICar;

  public pageNumber = 1;

  private carsCount: number;

  constructor(garageService: GarageService, engineService: EngineService) {
    this.garageService = garageService;
    this.engineService = engineService;
  }

  public async init(): Promise<void> {
    await this.renderGarage();
    await this.createCars();
    await this.renderCars();
    await this.addEventListeners();
  }

  // create array of cars with info about engine
  private async createCars(): Promise<void> {
    const iCars: Array<ICar> = await this.garageService.getCars(this.pageNumber);
    const cars: Array<Car> = iCars.map((car) => new Car(this.engineService, car));
    this.cars = [...cars];
  }

  // create each car from cars and insert into garage
  public renderCars(): void {
    this.cars.forEach((car, index) => car.render(index + 1));
  }

  // create garage
  public async renderGarage(): Promise<void> {
    this.carsCount = await this.getCount(this.pageNumber);
    const root: HTMLElement | null = document.getElementById('root');
    const template: string = GarageView.getGarageImage(this.pageNumber, this.carsCount);

    root?.insertAdjacentHTML('beforeend', `<div class="app-garage">${template}</div>`);
  }

  private addEventListeners(): void {
    const root: HTMLElement | null = document.querySelector('.app-garage');

    const updateCarInputName: HTMLInputElement | null = document.querySelector('.app-garage__input-name__update');
    const updateCarInputColor: HTMLInputElement | null = document.querySelector('.app-garage__input-color__update');
    const updateCarBtn: HTMLButtonElement | null = document.querySelector('.app-car-item__update-button');

    updateCarBtn?.addEventListener('click', () => {
      this.updateCar({ id: this.car.id, name: (updateCarInputName as HTMLInputElement).value, color: (updateCarInputColor as HTMLInputElement).value });
    });

    root?.addEventListener('selectCar', (event): void => {
      this.car = (event as CustomEvent).detail.data;
      (updateCarInputName as HTMLInputElement).value = this.car.name;
      (updateCarInputColor as HTMLInputElement).value = this.car.color;
      (updateCarInputName as HTMLInputElement).disabled = false;
      (updateCarInputColor as HTMLInputElement).disabled = false;
      (updateCarBtn as HTMLButtonElement).disabled = false;
    });

    root?.addEventListener('updateCar', (event) => {
      // request gets data from event
      const request: ICar = (event as CustomEvent).detail.data;
      this.updateCar(request);
    });

    root?.addEventListener('deleteCar', this.deleteCarFromView.bind(this));

    const createCarButton: HTMLButtonElement | null = document.querySelector('.app-car-item__create-button');

    const createCarInputName: HTMLInputElement | null = document.querySelector('.app-garage__input-name');
    let inputValueName = '';

    createCarInputName?.addEventListener('input', () => {
      inputValueName = createCarInputName.value;
    });

    const createCarInputColor: HTMLInputElement | null = document.querySelector('.app-garage__input-color');
    let inputValueColor = '';

    createCarInputColor?.addEventListener('input', () => {
      inputValueColor = createCarInputColor.value;
    });

    // on click new car, creates a new car
    createCarButton?.addEventListener('click', () => {
      const request: Omit<ICar, 'id'> = { name: inputValueName, color: inputValueColor };
      this.createCar(request);
      this.updateCount();
      this.updateStateGarage();
    });

    const pagination: HTMLElement | null = document.querySelector('.app-garage__pagination');
    this.updateStateGarage();

    // render new page on click next or prev btn
    pagination?.addEventListener('click', this.renderPage.bind(this));

    const createRandomCarsBtn: HTMLButtonElement | null = document.querySelector('.app-car-item__generate-button');

    createRandomCarsBtn?.addEventListener('click', async () => {
      this.createRandomCars();
      setTimeout(() => {
        this.updateCount();
      }, 500);
      this.updateStateGarage();
    });

    const raceCarsBtn: HTMLButtonElement | null = document.querySelector('.app-car-item__race-button');

    raceCarsBtn?.addEventListener('click', this.raceCars.bind(this));

    const resetRaceBtn: HTMLButtonElement | null = document.querySelector('.app-car-item__reset-button');

    resetRaceBtn?.addEventListener('click', this.resetRaceCars.bind(this));
  }

  private async getCount(page: number): Promise<number> {
    const response: Response = await this.garageService.getCount(page);
    return Number(response.headers.get('X-Total-Count'));
  }

  private async updateCount(): Promise<void> {
    this.carsCount = await this.getCount(this.pageNumber);
    const countContainer: HTMLHeadElement | null = document.querySelector('.app-garage__count');
    (countContainer as HTMLHeadElement).innerHTML = `Garage ${this.carsCount}`;
  }

  private async updatePage(): Promise<void> {
    const countContainer: HTMLHeadElement | null = document.querySelector('.app-garage__page');
    (countContainer as HTMLHeadElement).innerHTML = `Page ${this.pageNumber}`;
  }

  private async renderPage(event: Event): Promise<void> {
    const isNext: boolean = (event.target as HTMLButtonElement).classList.contains('app-garage__pagination-next');
    const isPrev: boolean = (event.target as HTMLButtonElement).classList.contains('app-garage__pagination-prev');

    if (isNext) {
      this.pageNumber++;
    } else if (isPrev) {
      this.pageNumber--;
    }
    this.updatePage();
    this.cars.forEach((car, index) => car.destroy(index + 1));

    await this.createCars();
    this.cars.forEach((car, index) => car.render(index + 1));
    this.updateStateGarage();
  }

  // set btns for pagination disable or enable
  private async updateStateGarage(): Promise<void> {
    this.carsCount = await this.getCount(this.pageNumber);
    const nextButton: HTMLButtonElement | null = document.querySelector('.app-garage__pagination-next');
    const prevButton: HTMLButtonElement | null = document.querySelector('.app-garage__pagination-prev');

    if (this.pageNumber * 7 < this.carsCount) {
      (nextButton as HTMLButtonElement).disabled = false;
    } else {
      (nextButton as HTMLButtonElement).disabled = true;
    }

    if (this.pageNumber > 1) {
      (prevButton as HTMLButtonElement).disabled = false;
    } else {
      (prevButton as HTMLButtonElement).disabled = true;
    }
  }

  // creates 100 random cars
  private async createRandomCars(): Promise<void> {
    for (let i = 0; i < 100; i++) {
      const request: Omit<ICar, 'id'> = { name: generateRandomName(), color: generateRandomColor() };
      this.createCar(request);
    }
  }

  // starts race on each car
  private async raceCars(): Promise<void> {
    const raceCarsBtn: HTMLButtonElement | null = document.querySelector('.app-car-item__race-button');
    const resetCarsBtn: HTMLButtonElement | null = document.querySelector('.app-car-item__reset-button');
    (raceCarsBtn as HTMLButtonElement).disabled = true;
    (resetCarsBtn as HTMLButtonElement).disabled = false;
    const promises: Array<Promise<void>> = this.cars.map((car) => car.startRace());
    await Promise.all(promises);
  }

  // stop the race
  private async resetRaceCars(): Promise<void> {
    const raceCarsBtn: HTMLButtonElement | null = document.querySelector('.app-car-item__race-button');
    const resetCarsBtn: HTMLButtonElement | null = document.querySelector('.app-car-item__reset-button');
    (raceCarsBtn as HTMLButtonElement).disabled = false;
    (resetCarsBtn as HTMLButtonElement).disabled = true;
    const promises: Array<Promise<void>> = this.cars.map((car) => car.stop());
    await Promise.all(promises);

    const winnerText: HTMLElement | null = document.querySelector('.app-garage__winner');

    (winnerText as HTMLElement).classList.remove('app-garage__winner-show');
  }

  private async deleteCarFromView(event: Event): Promise<void> {
    const request: ICar = (event as CustomEvent).detail.data;
    await this.deleteCar(request);
    this.updateStateGarage();
    if (this.pageNumber * 7 < this.carsCount) {
      const carsContainer: HTMLElement | null = document.querySelector('.app-garage__cars');
      (carsContainer as HTMLElement).innerHTML = '';
      await this.createCars();
      this.cars.forEach((car, index) => car.render(index + 1));
    }
  }

  public async updateCar(request: ICar): Promise<void> {
    const response: ICar = await this.garageService.updateCar({ ...request });
    const index: number = this.cars.findIndex((car) => car.id === request.id);
    if (index > -1) {
      // returns current car
      const target: Car | undefined = this.cars[index];
      // add to an array of cars updated car
      this.cars = [...this.cars.slice(0, index), target.updateCar(response, index + 1), ...this.cars.slice(index + 1)];
    }
  }

  public async deleteCar(request: ICar): Promise<void> {
    await this.garageService.deleteCar(request.id);
    const index: number = this.cars.findIndex((car) => car.id === request.id);
    if (index > -1) {
      const winner = new Winners(new WinnersService(new WinnersRepository()));
      winner.deleteWinner(request.id);
      const target: Car | undefined = this.cars[index];
      this.cars = [...this.cars.slice(0, index), ...this.cars.slice(index + 1)];
      // delete car from array and destroy car from html
      target.destroy(index + 1);
      this.updateCount();
    }
  }

  // returns Promise response from the server with new created car
  public async createCar(request: Omit<ICar, 'id'>): Promise<void> {
    const response: ICar = await this.garageService.createCar(request);
    const car: Car = new Car(this.engineService, response);
    if (this.cars.length < 7) {
      car.render(this.cars.length + 1);
      this.cars = [...this.cars, car];
    }
  }
}
