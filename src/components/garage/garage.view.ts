import './garage.scss';

export abstract class GarageView {
  public static getGarageImage(page: number, count: number): string {
    return `
    <div class="app-garage__top">
      <div class="app-garage__form-container">
        <form class="app-garage__form">
          <input type="text" class="app-garage__input-name">
          <input type="color" class="app-garage__input-color">
          <button class="app-car-item__create-button" type="button">create</button>
        </form>
        <form class="app-garage__form">
          <input type="text" class="app-garage__input-name__update" disabled>
          <input type="color" class="app-garage__input-color__update" value="#ff0000" disabled>
          <button class="app-car-item__update-button" type="button" disabled>update</button>
        </form>
      </div>
      <div class="app-garage__btns">
        <button class="app-car-item__generate-button" type="button">Add cars</button>
        <button class="app-car-item__race-button" type="button">Race cars</button>
        <button class="app-car-item__reset-button" type="button" disabled>Reset race</button>
      </div>
      <h2 class="app-garage__count">Garage ${count}</h2>
      <h2 class="app-garage__page">Page ${page}</h2>
      <div class="app-garage__cars"></div>
    </div>
    <div class="app-garage__pagination">
      <button type="button" class="app-garage__pagination-prev">prev</button>
      <button type="button" class="app-garage__pagination-next">next</button>
    </div>
    <div class="app-garage__winner">Won</div>
    `;
  }
}
