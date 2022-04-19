import ContentManager from './assets/javascript/modules/ContentManager.js';

const contentManagerData = {
  searchPanel: document.querySelector('.js-search-panel'),
  searchLine: document.querySelector('.js-search-line'),
  paginator: document.querySelector('.js-paginator'),
  previousButton: document.querySelector('.js-previous-page'),
  nextButton: document.querySelector('.js-next-page'),
  screenCapacity: 6,
};
const contentManager = new ContentManager(contentManagerData);
