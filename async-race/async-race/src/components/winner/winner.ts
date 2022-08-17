import { GarageRepository, GarageService, ICar, IWinner } from '../../core';
import { WinnerView } from './winner.view';
import './winner.scss';

export class Winner {
  public winner: IWinner;

  private pageNumber = 1;

  constructor(winner: IWinner) {
    this.winner = winner;
  }

  public get id(): number {
    return this.winner.id;
  }

  public get wins(): number {
    return this.winner.wins;
  }

  public get time(): number {
    return this.winner.time;
  }

  public updateWinner(index: number, winner: IWinner): Winner {
    this.winner = winner;
    this.render(index, winner);
    return this;
  }

  public async render(index: number, winner?: IWinner): Promise<void> {
    const root: HTMLElement | null = document.querySelector('.app-winners__list');
    const garageService = new GarageService(new GarageRepository());
    const car: ICar | undefined = await garageService.getCar(this.winner.id);
    const template: string = WinnerView.getWinnerImage(this.winner, car, this.pageNumber, index);

    if (winner) {
      const container: HTMLElement | null = document.getElementById(`app-winner__${index}`);
      const updatedTemplate: string = WinnerView.getWinnerImage(winner, car, this.pageNumber, index);
      (container as HTMLElement).innerHTML = updatedTemplate;
    } else {
      root?.insertAdjacentHTML('beforeend', `<tr class="app-winner" id="app-winner__${index}">${template}</tr>`);
    }
  }

  public destroy(index: number): void {
    const container: HTMLElement | null = document.getElementById(`app-winner__${index}`);
    container?.parentNode?.removeChild(container);
  }
}
