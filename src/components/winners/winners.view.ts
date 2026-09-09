import './winners.scss';

export abstract class WinnersView {
  public static getWinnersImage(page: number, count: number): string {
    return `
      <div class="container">
        <h2 class="app-winners__count">Winners ${count}</h2>
        <div class="app-winners__page">Page ${page}</div>
        <div class="app-winners__container">
          <table class="app-winners__table">
            <tr class="app-winners__head">
              <th>Number</th>
              <th>Car</th>
              <th>Name</th>
              <th class="app-winners__wins">Wins</th>
              <th class="app-winners__time">Best time (seconds)</th>
            </tr>
            <tbody class="app-winners__list"></tbody>
          </table>
        </div>
        <div class="app-winners__pagination">
          <button type="button" class="app-winners__pagination-prev">prev</button>
          <button type="button" class="app-winners__pagination-next">next</button>
        </div>
      </div>
    `;
  }
}
