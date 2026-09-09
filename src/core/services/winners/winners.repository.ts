import { Endpoints } from '../../constants';
import { IWinner } from '../models';
import { headers } from '../garage';

export class WinnersRepository {
  // returns promise from server with array of winners
  public getWinners(query?: string): Promise<Array<IWinner>> {
    return fetch(`${Endpoints.AppHost}/${query ? `winners/?${query}` : 'winners'}`, {
      method: 'GET',
    }).then((res) => res.json());
  }

  public getCount(page: number, limit = 10): Promise<Response> {
    return fetch(`${Endpoints.AppHost}/winners?_page=${page}&_limit=${limit}`, {
      method: 'GET'
    });
  }

  // returns promise from server with specified winner
  public getWinner(id: number): Promise<IWinner> {
    return fetch(`${Endpoints.AppHost}/winners/${id}`, {
      method: 'GET',
    }).then((res) => res.json());
  }

  // creates new winner in server
  public createWinner(request: Omit<IWinner, 'id'>): Promise<IWinner> {
    return fetch(`${Endpoints.AppHost}/winners`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request)
    }).then((res) => res.json());
  }

  // delete a specified winner from server
  public deleteWinner(id: number): Promise<void> {
    return fetch(`${Endpoints.AppHost}/winners/${id}`, {
      method: 'DELETE'
    }).then((res) => res.json());
  }

  // update a specified winner in server
  public updateWinner(request: IWinner): Promise<IWinner> {
    const { id, ...winner } = request;
    return fetch(`${Endpoints.AppHost}/winners/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(winner)
    }).then((res) => res.json());
  }
}
