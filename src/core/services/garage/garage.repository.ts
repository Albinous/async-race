import { Endpoints } from '../../constants';
import { ICar } from '../models';

export const headers: HeadersInit = {
  'Content-type': 'application/json'
};

function getResponse(response: Response, result?: Promise<unknown>): Promise<any> {
  const isNotSuccess = !response.ok;

  if (isNotSuccess) {
    throw new Error();
  }

  return result || response.json();
}

export class GarageRepository {
  // returns json data about cars in a garage.
  public getCars(page: number, limit = 7): Promise<Array<ICar>> {
    return fetch(`${Endpoints.AppHost}/garage?_page=${page}&_limit=${limit}`, {
      method: 'GET'
    }).then((res) => getResponse(res));
  }

  public getCount(page: number, limit = 7): Promise<Response> {
    return fetch(`${Endpoints.AppHost}/garage?_page=${page}&_limit=${limit}`, {
      method: 'GET'
    });
  }

  // returns json data about a specified car

  public getCar(id: number): Promise<ICar> {
    return fetch(`${Endpoints.AppHost}/garage/${id}`, {
      method: 'GET'
    }).then((res) => getResponse(res));
  }

  // creates a new car in garage

  public createCar(request: Omit<ICar, 'id'>): Promise<ICar> {
    return fetch(`${Endpoints.AppHost}/garage`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request)
    }).then((res) => getResponse(res));
  }

  // delete specified car from a garage

  public deleteCar(id: number): Promise<void> {
    return fetch(`${Endpoints.AppHost}/garage/${id}`, {
      method: 'DELETE'
    }).then((res) => getResponse(res));
  }

  // updates specified car in a garage

  public updateCar(request: ICar): Promise<ICar> {
    const { id, ...car } = request;
    return fetch(`${Endpoints.AppHost}/garage/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(car)
    }).then((res) => getResponse(res));
  }
}
