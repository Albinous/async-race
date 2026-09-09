import { Endpoints } from '../../constants';
import { IEngine, IDrive } from '../models';

export class EngineRepository {
  // returns velocity and distance of car by starting or stoping the specified car
  public startStop(query: string): Promise<IEngine> {
    return fetch(`${Endpoints.AppHost}/engine?${query}`, {
      method: 'PATCH'
    }).then((res) => res.json());
  }

  // switch specified car to drive mode

  public switchToDrive(query: string): Promise<IDrive> {
    return fetch(`${Endpoints.AppHost}/engine?${query}`, {
      method: 'PATCH'
    }).then((res) => res.json());
  }
}
