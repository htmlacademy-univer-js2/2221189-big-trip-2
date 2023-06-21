import AbstractView from '../framework/view/abstract-view';
import { SortTypes } from '../const';

const sortTemplate = (sortType) => {
  const checkSorting = (sorting) => sorting === sortType ? 'checked' : '';

  const createTabTemplate = (tab_id, sorting_name, sorting) => `
    <div class="trip-sort__item  trip-sort__item--${tab_id}">
      <input id="sort-${tab_id}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${tab_id}" ${checkSorting(sorting)}>
      <label class="trip-sort__btn" for="sort-${tab_id}" data-sort-type="${sorting}">${sorting_name}</label>
    </div>`;

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${createTabTemplate('day', 'Day', SortTypes.DAY)}
      ${createTabTemplate('event', 'Event', SortTypes.EVENT)}
      ${createTabTemplate('time', 'Time', SortTypes.TIME)}
      ${createTabTemplate('price', 'Price', SortTypes.PRICE)}
      ${createTabTemplate('offer', 'Offers', SortTypes.OFFERS)}
    </form>`
  )
};

class SortView extends AbstractView {
  constructor(sortType) {
    super();
    this._sortType = sortType;
  }

  get template() {
    return sortTemplate(this._sortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (!evt.target.dataset.sortType) {
      return;
    }
    
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}

export default SortView;
