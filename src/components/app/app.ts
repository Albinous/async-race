import { EngineRepository, EngineService, GarageRepository, GarageService, WinnersRepository, WinnersService } from '../../core';
import { Garage } from '../garage';
import { Winners } from '../winners';
import { AppView } from './app.view';
import './app.scss';

export class App {
  private garageService: GarageService;

  private engineService: EngineService;

  private winnersService: WinnersService;

  private garage: Garage;

  private winners: Winners;

  public init(): void {
    this.renderApp();
    this.addGarageAndWinners();
    this.addEventListeners();
  }

  private renderApp(): void {
    const root: HTMLElement | null = document.getElementById('root');
    const template = AppView.getAppImage();
    (root as HTMLElement).innerHTML = template;
  }

  private addGarageAndWinners(): void {
    this.garageService = new GarageService(new GarageRepository());
    this.engineService = new EngineService(new EngineRepository());
    this.garage = new Garage(this.garageService, this.engineService);

    this.winnersService = new WinnersService(new WinnersRepository());
    this.winners = new Winners(this.winnersService);
    this.garage.init();
    this.winners.init();
  }

  private addEventListeners(): void {
    const container: HTMLElement | null = document.querySelector('.app-btns');

    container?.addEventListener('click', (event) => {
      const isGarage: boolean = (event.target as HTMLButtonElement).classList.contains('app-garage__btn');
      const isWinners: boolean = (event.target as HTMLButtonElement).classList.contains('app-winners__btn');

      if (isGarage) {
        const winnersShow: HTMLElement | null = document.querySelector('.app-winners');
        const garageHide: HTMLElement | null = document.querySelector('.app-garage');
        (winnersShow as HTMLElement).classList.remove('app-winners__show');
        (garageHide as HTMLElement).classList.remove('app-garage__hide');
      } else if (isWinners) {
        const winnersShow: HTMLElement | null = document.querySelector('.app-winners');
        const garageHide: HTMLElement | null = document.querySelector('.app-garage');
        (winnersShow as HTMLElement).classList.add('app-winners__show');
        (garageHide as HTMLElement).classList.add('app-garage__hide');
      }
    });
  }
}
