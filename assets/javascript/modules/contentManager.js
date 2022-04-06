app.modules.contentManager = (function(self = {}) {
  const _searchPanel = document.querySelector('.js-search-panel');
  const _searchLine =  document.querySelector('.js-search-line');
  const _paginator = document.querySelector('.js-paginator');
  const _paginatorData = _paginator.dataset;
  const _previousButton = document.querySelector('.js-previous-page');
  const _nextButton = document.querySelector('.js-next-page');
  const _screenCapacity = 6;
  let _submitTimerId;
  let _request;

  function _listeners() {
    _searchPanel.addEventListener('input', _handleInput);
    _searchPanel.addEventListener('submit', _submitForm);
    _paginator.addEventListener('click', _turnPage);
  }
  
  function _init() {
    _clickSubmitButton();
  }

  function _handleInput() {
    _managePanelAppearance();
    clearTimeout(_submitTimerId);
    _submitTimerId = setTimeout(_clickSubmitButton, 500);
  }

  function _managePanelAppearance() {
    _searchPanel
      .classList
      .toggle('search-panel_focused', _searchLine.value !== '');
  }

  function _clickSubmitButton() {
    document.querySelector('.js-submit-button').click();
  }
  
  function _resetPageNumber() {
    _paginatorData.pageNumber = 0;
  }

  function _submitForm(event) {
    event.preventDefault();

    _resetPageNumber();
    _sendRequest();
  }

  function _sendRequest() {
    _toggleLoadingMode();

    _request = (
      server.sendRequest(_searchLine.value, _paginatorData.pageNumber)
    );
    _request.then(_handleAnswer)
  }

  function _handleAnswer(answer) {
    _insertContent(answer.users);
    _updateCounter(answer.resultsNumber);
    _updatePaginatorData(answer.resultsNumber);
  }

  function _insertContent(users) {
    const container = document.querySelector('.js-list-content');
    let content = '';

    users.forEach(user => {
      content +=
      `
      <div class="user-card">
        <img
          class="user-card__image"
          src="${user.avatarUrl}"
          width="300px"
          alt="${user.name}'s avatar"
        >
        <section class="user-card__info">
          <h3 class="user-card__name">${user.name}</h3>
          <p class="user-card__id">${user.id}</p>
        </section>          
      </div>
      `;
    });
  
    container.innerHTML = content;
  }

  function _updateCounter(resultsNumber) {
    const counter = document.querySelector('.js-results-counter');

    counter.innerHTML = (
      `${resultsNumber} result${resultsNumber == 1 ? '' : 's'}`
    );
  }

  function _turnPage(event) {
    const target = event.target;

    if (target == _previousButton) {
      _paginatorData.pageNumber--;
      _sendRequest();
    } else if (target == _nextButton) {
      _paginatorData.pageNumber++;
      _sendRequest();
    }
  }

  function _updatePaginatorData(resultsNumber) {
    _toggleLoadingMode();

    const pageNumber = Number(_paginatorData.pageNumber);

    _paginatorData.previousPage = pageNumber - 1;
    _paginatorData.nextPage = pageNumber + 1;

    const hasReachedMaxPage = (
      pageNumber >= (resultsNumber / _screenCapacity) - 1
    );

    _previousButton
      .classList
      .toggle('paginator__button_disabled', pageNumber <= 0);
    _nextButton
      .classList
      .toggle('paginator__button_disabled', hasReachedMaxPage);
  }

  function _toggleLoadingMode() {
    const loadingImage = document.querySelector('.js-loading');

    loadingImage.classList.toggle('dn');
    _previousButton.classList.add('paginator__button_disabled');
    _nextButton.classList.add('paginator__button_disabled');
  }
  
  self.load = () => {
    _listeners();
    _init();
  };

  return self;
})(app.modules.contentManager);
