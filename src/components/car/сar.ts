import { EngineService, ICar, IEngineRequest, IWinner, WinnersRepository, WinnersService } from '../../core';
import { Winners } from '../winners';
import { CarView } from './car.view';

// custom event on select car
export const selectCarEvent = new CustomEvent('selectCar', {
  detail: { data: {} as ICar },
  bubbles: true,
  cancelable: true
});

// custon event on delete car
const deleteCarEvent = new CustomEvent('deleteCar', {
  detail: { data: {} as ICar },
  bubbles: true,
  cancelable: true
});

export class Car {
  private engineService: EngineService;

  private animationFrameId: number;

  private svgElement: SVGSVGElement;

  public car: ICar;

  private duration: number;

  private static isWinner = false;

  private startBtn: HTMLButtonElement;

  private stopBtn: HTMLButtonElement;

  constructor(engineService: EngineService, car: ICar) {
    this.engineService = engineService;
    this.car = car;
  }

  // returns car id
  public get id(): number {
    return this.car.id;
  }

  // update an existing car
  public updateCar(car: ICar, index: number): Car {
    this.car = car;
    this.render(index, car);
    return this; // returns this for simple using with Garage.updateCar()
  }

  public async start(): Promise<void> {
    const request: IEngineRequest = {
      id: this.car.id,
      status: 'started'
    };
    const { velocity, distance } = await this.engineService.startStop(request);
    this.duration = distance / velocity;
    this.disableStartBtn();
    await this.runCar(this.duration);
    await this.switchToDrive();
  }

  public async startRace(): Promise<void> {
    Car.isWinner = false;
    const request: IEngineRequest = {
      id: this.car.id,
      status: 'started'
    };
    const { velocity, distance } = await this.engineService.startStop(request);
    this.duration = distance / velocity;
    this.disableStartBtn();
    await this.runCar(this.duration);
    await this.switchToDriveRace();
  }

  public async stop(): Promise<void> {
    const request: IEngineRequest = {
      id: this.car.id,
      status: 'stopped'
    };
    this.disableStopBtn();
    this.stopCar();
    await this.engineService.startStop(request);
    this.svgElement.style.transform = 'translateX(0px)';
  }

  public async switchToDrive(): Promise<void> {
    try {
      const request: IEngineRequest = {
        id: this.car.id,
        status: 'drive'
      };
      await this.engineService.switchToDrive(request);
    } catch {
      this.stopCar();
    }
  }

  public async switchToDriveRace(): Promise<void> {
    try {
      const request: IEngineRequest = {
        id: this.car.id,
        status: 'drive'
      };
      await this.engineService.switchToDrive(request);
      if (Car.isWinner === false) {
        Car.isWinner = true;
        this.duration = +(this.duration / 1000).toFixed(2);
        await this.createWinner(this.duration, this.car.id);
        this.showTextForWinner(this.car.name, this.duration);
      }
    } catch {
      this.stopCar();
    }
  }

  private async createWinner(duration: number, idC: number): Promise<void> {
    const request = { id: idC, wins: 1, time: duration };
    const winners: Winners = new Winners(new WinnersService(new WinnersRepository()));
    const winnersArr: Array<IWinner> = await winners.getWinners();
    const carWon: IWinner | undefined = winnersArr.find((winner) => winner.id === idC);

    if (carWon) {
      await winners.updateWinner({ id: idC, wins: carWon.wins + 1, time: Math.min(carWon.time, duration) });
    } else {
      await winners.createWinner(request);
    }
  }

  private showTextForWinner(name: string, duration: number): void {
    const winnerText: HTMLElement | null = document.querySelector('.app-garage__winner');

    (winnerText as HTMLElement).classList.add('app-garage__winner-show');

    (winnerText as HTMLElement).innerHTML = `${name} wont first [${duration}s]`;
  }

  // render car and add listeners
  public render(index: number, car?: ICar): void {
    const root: HTMLElement | null = document.querySelector('.app-garage__cars');
    const template: string = CarView.getCarImage(this.car);

    if (car) {
      // re-render the car
      const container: HTMLElement | null = document.querySelector(`[data-index="${index}"]`);
      const updatedTemplate: string = CarView.getCarImage(this.car);
      (container as HTMLElement).innerHTML = updatedTemplate;
      (container as HTMLElement).id = `${this.car.id}`;
      this.addEventListeners();
    } else {
      // or create a new one
      root?.insertAdjacentHTML('beforeend', `<div class="app-car" id="${this.car.id}" data-index="${index}">${template}</div>`);
      this.addEventListeners();
    }

    const [element] = (document.getElementById(`${this.car.id}`) as HTMLElement).getElementsByTagName('svg');
    this.svgElement = element;

    const [start] = (document.getElementById(`${this.car.id}`) as HTMLElement).getElementsByClassName('app-car-item__start-button') as HTMLCollectionOf<HTMLButtonElement>;
    this.startBtn = start;

    const [stop] = (document.getElementById(`${this.car.id}`) as HTMLElement).getElementsByClassName('app-car-item__stop-button') as HTMLCollectionOf<HTMLButtonElement>;
    this.stopBtn = stop;
  }

  // detach car from view
  public destroy(index: number): void {
    const container: HTMLElement | null = document.querySelector(`[data-index="${index}"]`);
    container?.parentNode?.removeChild(container);
  }

  public addEventListeners(): void {
    const container: HTMLElement | null = document.getElementById(`${this.car.id}`);

    container?.addEventListener('click', (event) => {
      const isSelect: boolean = (event.target as HTMLElement).classList.contains('app-car-item__select-button');
      const isDelete: boolean = (event.target as HTMLElement).classList.contains('app-car-item__delete-button');
      const isStart: boolean = (event.target as HTMLElement)?.classList.contains('app-car-item__start-button');
      const isStop: boolean = (event.target as HTMLElement)?.classList.contains('app-car-item__stop-button');

      // if clicked to select
      if (isSelect) {
        selectCarEvent.detail.data = this.car;
        container.dispatchEvent(selectCarEvent);
      } else if (isDelete) {
        deleteCarEvent.detail.data = this.car;
        container.dispatchEvent(deleteCarEvent);
      } else if (isStart) {
        this.start();
      } else if (isStop) {
        this.stop();
      }
    });
  }

  public disableStartBtn(): void {
    this.startBtn.disabled = true;
    this.stopBtn.disabled = false;
  }

  public disableStopBtn(): void {
    this.startBtn.disabled = false;
    this.stopBtn.disabled = true;
  }

  private runCar(duration: number): void {
    const [{ clientWidth }] = document.getElementsByClassName('app-car');
    const distance: number = clientWidth - this.svgElement.clientWidth;

    const start = performance.now();
    const draw = (progress: number) => {
      this.svgElement.style.transform = `translateX(${progress * distance}px)`;
    };
    const timing = (timeFraction: number) => timeFraction;
    const animate = (time: number): void => {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) {
        timeFraction = 1;
      }
      const progress = timing(timeFraction);
      draw(progress);
      if (timeFraction < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      }
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  private stopCar() {
    cancelAnimationFrame(this.animationFrameId);
  }
}
