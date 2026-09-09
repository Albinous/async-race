export abstract class AppView {
  public static getAppImage(): string {
    return `
      <div id="app">
        <div class="container">
          <div class="app-btns">
            <button type="button" class="app-garage__btn">Garage</button>
            <button type="button" class="app-winners__btn">Winners</button>
          </div>
        </div>
      </div>
    `;
  }
}
