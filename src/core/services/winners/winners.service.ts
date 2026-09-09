import { IWinner } from '../models';
import { WinnersRepository } from './winners.repository';

export class WinnersService {
  private winnersRepository: WinnersRepository;

  constructor(winnersRepository: WinnersRepository) {
    this.winnersRepository = winnersRepository;
  }

  public getWinners(query?: string): Promise<Array<IWinner>> {
    return this.winnersRepository.getWinners(query);
  }

  public getCount(page: number): Promise<Response> {
    return this.winnersRepository.getCount(page);
  }

  public getWinner(id: number): Promise<IWinner> {
    return this.winnersRepository.getWinner(id);
  }

  public createWinner(request: IWinner): Promise<IWinner> {
    return this.winnersRepository.createWinner(request);
  }

  public deleteWinner(id: number): Promise<void> {
    return this.winnersRepository.deleteWinner(id);
  }

  public updateWinner(request: IWinner): Promise<IWinner> {
    return this.winnersRepository.updateWinner(request);
  }
}
