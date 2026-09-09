import { IWinner, WinnersService } from '../../core';
import { Winner } from '../winner';
import { WinnersView } from './winners.view';

export class Winners {
  public winnersService: WinnersService;

  private winners: Array<Winner> = [];

  private winnersCount: number;

  private totalWinners: Array<IWinner> = [];

  private query: string;

  private limit = 10;

  private pageNumber = 1;

  private sort = 'id';

  private order = 'ASC';

  private counter = 1;

  constructor(winnersService: WinnersService) {
    this.winnersService = winnersService;
  }

  public async init(): Promise<void> {
    await this.renderWinners();
    await this.createWinners();
    await this.renderWinner();
    this.addEventListeners();
  }

  public async createWinners(): Promise<void> {
    this.query = `_page=${this.pageNumber}&_limit=${this.limit}&_sort=${this.sort}&_order=${this.order}`;
    const iWinners: Array<IWinner> = await this.winnersService.getWinners(this.query);
    const winners: Array<Winner> = iWinners.map((winner) => new Winner(winner));
    this.winners = [...winners];
  }

  public renderWinner(winners?: Array<Winner>): void {
    if (winners) {
      winners.forEach((updatedWinner, index) => updatedWinner.render(index + 1, updatedWinner.winner));
    } else {
      this.winners.forEach((winner, index) => winner.render(index + 1));
    }
  }

  public async renderWinners(): Promise<void> {
    this.winnersCount = await this.getCount(this.pageNumber);
    const root: HTMLElement | null = document.getElementById('root');
    const template: string = WinnersView.getWinnersImage(this.pageNumber, this.winnersCount);

    root?.insertAdjacentHTML('afterend', `<div class="app-winners">${template}</div>`);
  }

  private addEventListeners(): void {
    const sortWinnersContainer: HTMLTableRowElement | null = document.querySelector('.app-winners__head');

    (sortWinnersContainer as HTMLTableRowElement).addEventListener('click', this.sortWinners.bind(this));

    const pagination: HTMLElement | null = document.querySelector('.app-winners__pagination');
    this.updateStateWinners();

    // render new page on click next or prev btn
    pagination?.addEventListener('click', this.renderPage.bind(this));
  }

  private async getCount(page: number): Promise<number> {
    const response: Response = await this.winnersService.getCount(page);
    return Number(response.headers.get('X-Total-Count'));
  }

  private async updateCount(): Promise<void> {
    this.winnersCount = await this.getCount(this.pageNumber);
    const countContainer: HTMLHeadElement | null = document.querySelector('.app-winners__count');
    (countContainer as HTMLHeadElement).innerHTML = `Winners ${this.winnersCount}`;
  }

  private async updatePage(): Promise<void> {
    const countContainer: HTMLHeadElement | null = document.querySelector('.app-winners__page');
    (countContainer as HTMLHeadElement).innerHTML = `Page ${this.pageNumber}`;
  }

  private sortWinners(event: Event): void {
    const wins: HTMLTableCaptionElement | null = document.querySelector('.app-winners__wins');
    const time: HTMLTableCaptionElement | null = document.querySelector('.app-winners__time');

    this.counter++;

    const isWins: boolean = (event.target as HTMLTableRowElement).classList.contains('app-winners__wins');
    const isTime: boolean = (event.target as HTMLTableRowElement).classList.contains('app-winners__time');

    this.winners = [];

    if (isWins) {
      this.sort = 'wins';
      if (this.counter % 2 !== 0) {
        (time as HTMLTableCaptionElement).innerHTML = 'Best time (seconds)';
        (event.target as HTMLTableCellElement).innerHTML = 'Wins↓';
        this.order = 'DESC';
        this.getSortedWinners();
      } else {
        (event.target as HTMLTableCellElement).innerHTML = 'Wins↑';
        this.order = 'ASC';
        this.getSortedWinners();
      }
    } else if (isTime) {
      (wins as HTMLTableCaptionElement).innerHTML = 'Wins';
      this.sort = 'time';
      if (this.counter % 2 !== 0) {
        (event.target as HTMLTableCellElement).innerHTML = 'Best time (seconds)↓';
        this.order = 'DESC';
        this.getSortedWinners();
      } else {
        (event.target as HTMLTableCellElement).innerHTML = 'Best time (seconds)↑';
        this.order = 'ASC';
        this.getSortedWinners();
      }
    }
  }

  private async renderPage(event: Event): Promise<void> {
    const isNext: boolean = (event.target as HTMLButtonElement).classList.contains('app-winners__pagination-next');
    const isPrev: boolean = (event.target as HTMLButtonElement).classList.contains('app-winners__pagination-prev');

    if (isNext) {
      this.pageNumber++;
    } else if (isPrev) {
      this.pageNumber--;
    }
    this.updatePage();
    const winnersContainer: HTMLElement | null = document.querySelector('.app-winners__list');
    (winnersContainer as HTMLElement).innerHTML = '';
    await this.createWinners();
    this.winners.forEach((winner, index) => winner.render(index + 1));
    this.updateStateWinners();
  }

  // set btns for pagination disable or enable
  private async updateStateWinners(): Promise<void> {
    this.winnersCount = await this.getCount(this.pageNumber);
    const nextButton: HTMLButtonElement | null = document.querySelector('.app-winners__pagination-next');
    const prevButton: HTMLButtonElement | null = document.querySelector('.app-winners__pagination-prev');

    if (this.pageNumber * 10 < this.winnersCount) {
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

  public async getWinners(): Promise<Array<IWinner>> {
    this.query = `_page=${this.pageNumber}&_limit=${this.limit}&_sort=${this.sort}&_order=${this.order}`;
    const iWinners: Array<IWinner> = await this.winnersService.getWinners(this.query);
    return iWinners;
  }

  // returns sorted winners from server and render them
  private async getSortedWinners(): Promise<void> {
    this.query = `_sort=${this.sort}&_order=${this.order}&_limit=${this.limit}`;
    const iWinners: Array<IWinner> = await this.winnersService.getWinners(this.query);
    this.winners = iWinners.map((winner) => new Winner(winner));
    this.renderWinner(this.winners);
  }

  private async getTotalWinners(): Promise<Array<IWinner>> {
    this.query = `_sort=${this.sort}&_order=${this.order}`;
    const iWinners: Array<IWinner> = await this.winnersService.getWinners(this.query);
    return iWinners;
  }

  public async createWinner(request: IWinner): Promise<void> {
    await this.winnersService.createWinner(request);
    await this.createWinners();
    if (this.winners.length <= 10) {
      this.winners.forEach((winner, i) => winner.destroy(i + 1));
      this.renderWinner();
    }
    this.updateCount();
    this.updateStateWinners();
  }

  public async updateWinner(request: IWinner): Promise<void> {
    const response: IWinner = await this.winnersService.updateWinner({ ...request });
    this.totalWinners = await this.getTotalWinners();
    const index: number = this.totalWinners.findIndex((winner) => winner.id === request.id);
    if (index > -1) {
      // returns current car
      const target: Winner | undefined = this.winners[index];
      // add to an array of cars updated car
      this.winners = [...this.winners.slice(0, index), target.updateWinner(index + 1, response), ...this.winners.slice(index + 1)];
    }
  }

  public async deleteWinner(id: number): Promise<void> {
    this.totalWinners = await this.getTotalWinners();
    const index: number = this.totalWinners.findIndex((winner) => winner.id === id);
    if (index > -1) {
      await this.winnersService.deleteWinner(id);
      const winnersContainer: HTMLElement | null = document.querySelector('.app-winners__list');
      (winnersContainer as HTMLElement).innerHTML = '';
      await this.createWinners();
      this.renderWinner();
      this.updateCount();
      this.updateStateWinners();
    }
  }
}
