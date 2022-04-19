import MockApi from './MockApi.js';

const pseudoServer = new MockApi();

export default class ContentManager {
  #searchPanel;
  #searchLine;
  #paginator;
  #paginatorData;
  #previousButton;
  #nextButton;
  #screenCapacity;
  #submitTimerId;

  constructor({
    searchPanel,
    searchLine,
    paginator,
    previousButton,
    nextButton,
    screenCapacity,
  }) {
    this.#searchPanel = searchPanel;
    this.#searchLine = searchLine;
    this.#paginator = paginator;
    this.#paginatorData = paginator.dataset;
    this.#previousButton = previousButton;
    this.#nextButton = nextButton;
    this.#screenCapacity = screenCapacity;
    this.#searchPanel.addEventListener('input', (event) => { this.#handleInput(event) });
    this.#searchPanel.addEventListener('submit', (event) => { this.#submitForm(event) });
    this.#paginator.addEventListener('click', (event) => { this.#turnPage(event) });
    this.#clickSubmitButton();
  }

  #handleInput() {
    this.#managePanelAppearance();
    clearTimeout(this.#submitTimerId);
    this.#submitTimerId = setTimeout(this.#clickSubmitButton, 500);
  }

  #managePanelAppearance() {
    this.#searchPanel
      .classList
      .toggle('search-panel_focused', this.#searchLine.value !== '');
  }

  #clickSubmitButton() {
    document.querySelector('.js-submit-button').click();
  }

  #resetPageNumber() {
    this.#paginatorData.pageNumber = 0;
  }

  #submitForm(event) {
    event.preventDefault();
    this.#resetPageNumber();
    this.#sendRequest();
  }

  #sendRequest() {
    this.#toggleLoadingMode();

    this.request = (
      pseudoServer
        .sendRequest(this.#searchLine.value, this.#paginatorData.pageNumber)
        .then((response) => this.#handleAnswer(response))
    );
  }

  #handleAnswer(response) {
    const { users, resultsNumber } = response;
    this.#insertContent(users);
    this.#updateCounter(resultsNumber);
    this.#updatePaginatorData(resultsNumber);
  }

  #insertContent(users) {
    const container = document.querySelector('.js-list-content');
    let content = '';

    users.forEach((user) => {
      const { avatarUrl, name, id } = user;
      content +=
      `
      <div class="user-card">
        <img
          class="user-card__image"
          src="${avatarUrl}"
          width="300px"
          alt="${name}'s avatar"
        >
        <section class="user-card__info">
          <h3 class="user-card__name">${name}</h3>
          <p class="user-card__id">${id}</p>
        </section>          
      </div>
      `;
    });

    container.innerHTML = content;
  }

  #updateCounter(resultsNumber) {
    const counter = document.querySelector('.js-results-counter');

    counter.innerHTML = (
      `${resultsNumber} result${resultsNumber == 1 ? '' : 's'}`
    );
  }

  #turnPage(event) {
    const { target } = event;

    if (target === this.#previousButton) {
      this.#paginatorData.pageNumber--;
      this.#sendRequest();
    } else if (target === this.#nextButton) {
      this.#paginatorData.pageNumber++;
      this.#sendRequest();
    }
  }

  #updatePaginatorData(resultsNumber) {
    this.#toggleLoadingMode();

    const pageNumber = Number(this.#paginatorData.pageNumber);

    this.#paginatorData.previousPage = pageNumber - 1;
    this.#paginatorData.nextPage = pageNumber + 1;

    const hasReachedMaxPage = (
      pageNumber >= (resultsNumber / this.#screenCapacity) - 1
    );

    this.#previousButton
      .classList
      .toggle('paginator__button_disabled', pageNumber <= 0);
    this.#nextButton
      .classList
      .toggle('paginator__button_disabled', hasReachedMaxPage);
  }

  #toggleLoadingMode() {
    const loadingImage = document.querySelector('.js-loading');

    loadingImage.classList.toggle('dn');
    this.#previousButton.classList.add('paginator__button_disabled');
    this.#nextButton.classList.add('paginator__button_disabled');
  }
};
