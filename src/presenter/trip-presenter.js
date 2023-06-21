import { render, remove, RenderPosition } from '../framework/render';
import { sortingsList, sortByPrice, filtersList } from '../utils';
import { SortTypes, FilterTypes, UserActions, UpdateTypes, FilterMessages } from '../const';
import SortView from '../view/sort-view';
import TripListView from '../view/trip-list-view';
import FirstMessageView from '../view/first-message-view';
import PointPresenter from './point-presenter';
import NewPointPresenter from './new-point-presenter';
import LoadingView from '../view/loading-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimits = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

class TripPresenter {
  constructor(container, pointsModel, offersModel, destinationsModel, filtersModel) {
    this._tripListComponent = new TripListView();
    this._container = container;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._filtersModel = filtersModel;
    this._points_list = [];
    this._pointPresenter = new Map();

    this._sortComponent = null;
    this._firstMessageComponent = null;
    this._currentSortType = SortTypes.DAY;
    this._newPointPresenter = new NewPointPresenter(this._tripListComponent.element, this._handleViewAction);

    this._loadingComponent = new LoadingView();
    this._loading = true;
    this._uiBlocker = new UiBlocker(TimeLimits.LOWER_LIMIT, TimeLimits.UPPER_LIMIT);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  get points() {
    const points = this._pointsModel.points;
    const filterType = this._filtersModel.filter;
    const filteredPoints = filtersList[filterType](points);

    switch (this._currentSortType) {
      case SortTypes.TIME:
        return sortingsList[SortTypes.TIME]([...filteredPoints]);
      case SortTypes.PRICE:
        return sortByPrice([...filteredPoints], this._offersModel.offers);
      default:
        return sortingsList[SortTypes.DAY]([...filteredPoints]);
    }
  }

  initialize() {
    this._renderTrip();
  }

  createPoint = (callback) => {
    this._currentSortType = SortTypes.DAY;
    this._filtersModel.setFilter(UpdateTypes.MAJOR, FilterTypes.EVERYTHING);
    this._newPointPresenter.init(callback, this._offersModel.offers,
      this._destinationsModel.destinations, this._destinationsModel.cities);
  }

  _handleSortTypeChange = (sortType) => {
    if (sortType === this._currentSortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearList();
    this._renderTrip(this.points);
  }

  _renderFirstMessage() {
    const filterType = this._filtersModel.filter;
    const message = FilterMessages[filterType];
    this._firstMessageComponent = new FirstMessageView(message);
    render(this._firstMessageComponent, this._container);
  }

  _renderSort = () => {
    this._sortComponent = new SortView(this._currentSortType);
    render(this._sortComponent, this._container, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoints = (points) => {
    points.forEach(p => this._renderPoint(p));
  }

  _renderTrip() {
    render(this._tripListComponent, this._container);

    if (this._loading) {
      this._renderLoading();
      return;
    }
    
    this._renderSort();

    if (this.points.length === 0) {
      this._renderFirstMessage();
      return;
    }
    
    render(this._tripListComponent, this._container);
    this._renderPoints(this.points);
  }

  _handleModeChange = () => {
    this._newPointPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction = async (action_type, updateType, point) => {
    this._uiBlocker.block();
    switch (action_type) {
      case UserActions.UPDATE_POINT:
        this._pointPresenter.get(point.id).setSaving();
        try {
          await this._pointsModel.updatePoint(updateType, point);
        } catch(err) {
          this._pointPresenter.get(point.id).setAborting();
        }
        break;
      case UserActions.ADD_POINT:
        this._newPointPresenter.setSaving();
        try {
          await this._pointsModel.addPoint(updateType, point);
        } catch(err) {
          this._newPointPresenter.setAborting();
        }
        break;
      case UserActions.DELETE_POINT:
        this._pointPresenter.get(point.id).setDeleting();
        try {
          await this._pointsModel.deletePoint(updateType, point);
        } catch(err) {
          this._pointPresenter.get(point.id).setAborting();
        }
        break;
    }
    this._uiBlocker.unblock();
  };

  _handleModelEvent = (updateType, point) => {
    point; // unused
    switch (updateType) {
      case UpdateTypes.PATCH:
        this._pointPresenter.get(point.id).init(point);
        break;
      case UpdateTypes.MINOR:
        this._clearList();
        this._renderTrip();
        break;
      case UpdateTypes.MAJOR:
        this._clearList({ resetSortType: true });
        this._renderTrip();
        break;
      case UpdateTypes.INIT:
        this._loading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  };

  _renderLoading = () => {
    render(this._loadingComponent, this._container);
  }

  _renderPoint = (point) => {
    const offers = this._offersModel.offers;
    const destinations = this._destinationsModel.destinations;
    const cities = this._destinationsModel.cities;
    
    const pointPresenter = new PointPresenter(this._tripListComponent.element, this._pointsModel,
      offers, destinations, cities,
      this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _clearList = ({resetSortType: resetSortType = false} = {}) => {
    this._newPointPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
    
    remove(this._sortComponent);
    remove(this._firstMessageComponent);
    remove(this._loadingComponent);

    if (resetSortType) {
      this._currentSortType = SortTypes.DAY
    }
  }
}
export default TripPresenter;
