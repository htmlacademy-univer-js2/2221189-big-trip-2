import { remove, render, replace } from "../framework/render";
import FiltersView from "../view/filters-view";
import { filtersList } from "../utils";
import { UpdateTypes, FilterTypes } from "../const";

class FilterPresenter {
    constructor(filterContainer, filtersModel, pointsModel) {
        this._filterContainer = filterContainer;
        this._filterComponent = null;
        this._filtersModel = filtersModel;
        this._pointsModel = pointsModel;

        this._pointsModel.addObserver(this._handleModelEvent);
        this._filtersModel.addObserver(this._handleModelEvent);
    }

    get filters() {
        const points = this._pointsModel.points;

        return [
            {
                type: FilterTypes.EVERYTHING,
                name: 'everything',
                count: filtersList[FilterTypes.EVERYTHING](points).length
            },
            {
                type: FilterTypes.FUTURE,
                name: 'future',
                count: filtersList[FilterTypes.FUTURE](points).length
            },
            {
                type: FilterTypes.PAST,
                name: 'past',
                count: filtersList[FilterTypes.PAST](points).length
            }
        ];
    }

    initialize = () => {
        const filters = this.filters;
        const prevFilterComponent = this._filterComponent;

        this._filterComponent = new FiltersView(filters, this._filtersModel.filter);
        this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

        if (prevFilterComponent === null) {
            render(this._filterComponent, this._filterContainer);
            return;
        }

        replace(this._filterComponent, prevFilterComponent);
        remove(prevFilterComponent);
    }

    _handleModelEvent = () => {
        this.initialize();
    }

    _handleFilterTypeChange = (filterType) => {
        if (this._filtersModel.filter === filterType) {
            return;
        }

        this._filtersModel.setFilter(UpdateTypes.MAJOR, filterType);
    }
}

export default FilterPresenter;
