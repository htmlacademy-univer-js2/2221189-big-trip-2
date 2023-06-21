import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizeDate, humanizeTime, getFinalPrice } from '../utils';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';
import he from 'he';

const BlankPoint = {
  type: 'taxi',
  basePrice: 100,
  destination: 19,
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  offers: []
};

const BlankOffersList = [
  { id: 1, title: 'Upgrade to a business class', price: 190 },
  { id: 2, title: 'Choose the radio station', price: 30 },
  { id: 3, title: 'Choose temperature', price: 170 },
  { id: 4, title: "Drive quickly, I'm in a hurry", price: 100 },
  { id: 5, title: 'Drive slowly', price: 110 }
];

const BlankDestination = {
  description: "Vien, with crowded streets, with an embankment of a mighty river as a centre of attraction.",
  id: 19,
  name: "Vien",
  pictures: [
    { src: 'https://18.ecmascript.pages.academy/static/destinations/15.jpg', description: 'Vien city centre' },
    { src: 'https://18.ecmascript.pages.academy/static/destinations/16.jpg', description: 'Vien biggest supermarket' },
    { src: 'https://18.ecmascript.pages.academy/static/destinations/11.jpg', description: 'Vien park' },
    { src: 'https://18.ecmascript.pages.academy/static/destinations/12.jpg', description: 'Vien street market' },
    { src: 'https://18.ecmascript.pages.academy/static/destinations/13.jpg', description: 'Vien city centre' }
  ]
};

const editPointTemplate = (point, currentOffers, currentDestination, city) => {
  const {
    type,
    dateFrom,
    dateTo,
    offers,
    isDisabled,
    isSaving,
    isDeleting
  } = point;

  const disabledText = isDisabled ? 'disabled' : '';

  const checkPointType = (current_type) => current_type === type ? 'checked' : '';

  const getOption = (option) => {
    return(
      `<option value="${option.name}"></option>`
    )
  }

  const createOption = () => {
    const options = city.map(getOption)

    return options.join('')
  }

  const getOfferTemplate = (offer) => {
    return(
      `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-${offer['id']}"
        type="checkbox" name="event-offer-comfort"
        ${offers.find((x) => x === offer['id']) ? 'checked' : '' } ${disabledText}>
      <label class="event__offer-label" for="event-offer-comfort-${offer['id']}">
      <span class="event__offer-title">${offer['title']}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer['price']}</span>
      </label>
    </div>`);
  };


  const createOffersElement = () => currentOffers.map(getOfferTemplate).join(' ');

  const getPhotoTemplate = (photo) => (
    `<img class="event__photo" src="${photo['src']}" alt="Event photo">`
  );

  const createPhotosElement = () => currentDestination['pictures'].map(getPhotoTemplate).join(' ');

  const createEventType = (type_id, event_name) =>
    `<div class="event__type-item">
    <input id="event-type-${type_id}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type_id}" ${checkPointType(type_id)}>
    <label class="event__type-label  event__type-label--${type_id}" for="event-type-${type_id}-1">${event_name}</label>
    </div>`;

  return(
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
          <header class="event__header">
          <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${disabledText}>

              <div class="event__type-list">
              <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>

                  ${createEventType('taxi', 'Taxi')}
                  ${createEventType('bus', 'Bus')}
                  ${createEventType('train', 'Train')}
                  ${createEventType('ship', 'Ship')}
                  ${createEventType('drive', 'Drive')}
                  ${createEventType('flight', 'Flight')}
                  ${createEventType('check-in', 'Check-in')}
                  ${createEventType('sightseeing', 'Sightseeing')}
                  ${createEventType('restaurant', 'Restaurant')}

              </fieldset>
              </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-1"
                type="text" name="event-destination" value="${he.encode(currentDestination['name'])}"
                list="destination-list-1" ${disabledText}>
              <datalist id="destination-list-1">
              ${createOption()}
              </datalist>
          </div>

          <div class="event__field-group  event__field-group--time" ${disabledText}>
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input  event__input--time" id="event-start-time-1"
                type="text" name="event-start-time" value="${humanizeDate(dateFrom, 'DD/MM/YY')}
                ${humanizeTime(dateFrom)}" ${disabledText}>
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1"
                type="text" name="event-end-time" value="${humanizeDate(dateTo, 'DD/MM/YY')}
                ${humanizeTime(dateTo)}" ${disabledText}>
          </div>

          <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1"
              type="text" name="event-price" value="${getFinalPrice(currentOffers, point)}" ${disabledText}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${disabledText}>
            ${isSaving ? 'saving...' : 'save'}
          </button>
          <button class="event__reset-btn" type="reset" ${disabledText}>
            ${isDeleting ? 'deleting...' : 'delete'}
          </button>
          <button class="event__rollup-btn" type="button" ${disabledText}>
              <span class="visually-hidden">Open event</span>
          </button>
          </header>
          <section class="event__details">
          <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              ${createOffersElement()}
          </section>

          <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${currentDestination['description']}</p>

              <div class="event__photos-container">
              <div class="event__photos-tape">
                ${createPhotosElement()}
              </div>
              </div>
          </section>
          </section>
      </form>
    </li>`
  );
};

class EditPointView extends AbstractStatefulView {
  constructor(city, allOffers, allDestinations, point = BlankPoint, offers = BlankOffersList, destination = BlankDestination) {
	  super();
    this._state = EditPointView.parsePointToState(point);
	  this._offers = offers;
    this._destination = destination;
    this._allOffers = allOffers;
    this._allDestinations = allDestinations;
    this._city = city;
    this._prevOffers = offers;
    this._prevDestination = destination;
    this._datepicker = null;
    this._setInnerHandlers();
    this._setDatepickerTo();
    this._setDatepickerFrom();
  }

  get template() {
    return editPointTemplate(this._state, this._offers, this._destination, this._city);
  }
  
  setFormSubmitHandler = (callback) => {
    this._callback.submit = callback
    this.element.querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setButtonClickHandler = (callback) => {
    this._callback.click = callback
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this._buttonClickHandler);
  }

  setDeleteClickHandler = (callback) => {
    this._callback.delete = callback
    this.element.querySelector('.event__reset-btn').addEventListener('click', this._deleteClickHandler)
  }

  reset = (point) => {
    this._offers = this._prevOffers;
    this._destination = this._prevDestination;
    this.updateElement(EditPointView.parsePointToState(point));
  }

  removeElement = () => {
    super.removeElement();
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  };
  
  _formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit(EditPointView.parseStateToPoint(this._state));
  }
  
  _pointDateFromChangeHandler = ([userDate]) => {
    this.updateElement({ dateFrom: userDate });
  };

  _pointDateToChangeHandler = ([userDate]) => {
    this.updateElement({ dateTo: userDate });
  };

  _setDatepickerFrom = () => {
    if (this._state.dateFrom) {
      this._datepicker = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateFrom,
          minDate: this._state.dateFrom,
          maxDate: this._state.dateTo,
          onChange: this._pointDateFromChangeHandler,
        },
      );
    }
  };

  _setDatepickerTo = () => {
    if (this._state.dateTo) {
      this._datepicker = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateTo,
          minDate: this._state.dateFrom,
          onChange: this._pointDateToChangeHandler,
        },
      );
    }
  }

  _deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.delete(EditPointView.parseStateToPoint(this._state));
  }

  _restoreHandlers = () => {
    this._setInnerHandlers();
    this._setDatepickerTo();
    this._setDatepickerFrom();
    this.setFormSubmitHandler(this._callback.submit);
    this.setButtonClickHandler(this._callback.click);
    this.setDeleteClickHandler(this._callback.delete);
  };

  _setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change',  this._typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this._destinationChangeHandler);
    this.element.querySelector('.event__section--offers').addEventListener('change', this._offersChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this._priceChangeHandler);
  }
  

  _buttonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  _priceChangeHandler = (evt) => {
    evt.preventDefault();
    
    if (isNaN(Number(evt.target.value))) {
      return this._state;
    }

    this._setState({
      basePrice: Number(evt.target.value),
    });
  }

  _offersChangeHandler = (evt) => {
    const checkedOfferId = Number(evt.target.id.slice(-1));
    if (this._state.offers.includes(checkedOfferId)) {
      this._state.offers = this._state.offers.filter((x) => x !== checkedOfferId);
    }
    else {
      this._state.offers.push(checkedOfferId);
    }
    this.updateElement({
      offers: this._state.offers,
    });
  };

  _destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const currentCity = evt.target.value;
    const foundCity = this._city.find((x) => x.name === currentCity);
    if (foundCity) {
      this._destination = this._allDestinations.find((x) => x.id === currentId);
      this.updateElement({ destination: currentId });
    }
    else
      throw new Error("City not found");
  }

  _typeChangeHandler = (evt) => {
    this._offers = this._allOffers.find((x) => x.type === evt.target.value)['offers'];
    this.updateElement({ type: evt.target.value, offers: [] });
  }
  
  static parsePointToState = (point) => ({...point,
    dateTo: dayjs(point.dateTo).toDate(),
    dateFrom: dayjs(point.dateFrom).toDate(),
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToPoint = (state) => {
    const point = { ...state };
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }
}

export default EditPointView;
