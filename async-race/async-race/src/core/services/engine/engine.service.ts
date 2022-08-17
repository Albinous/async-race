import { IDrive, IEngine, IEngineRequest } from '../models';
import { EngineRepository } from './engine.repository';

export class EngineService {
  private engineRepository: EngineRepository;

  constructor(engineRepository: EngineRepository) {
    this.engineRepository = engineRepository;
  }

  // accept argument of type IEngineRequest with id and status props and returns Promise of type IEngine

  public startStop(request: IEngineRequest): Promise<IEngine> {
    return this.engineRepository.startStop(this.getQuery(request));
  }

  // switches engine to drive mode of specified car

  public switchToDrive(request: IEngineRequest): Promise<IDrive> {
    return this.engineRepository.switchToDrive(this.getQuery(request));
  }

  // returns query converted to a string

  private getQuery(request: IEngineRequest): string {
    const { id, status } = request;

    return `id=${id}&status=${status}`;
  }
}
