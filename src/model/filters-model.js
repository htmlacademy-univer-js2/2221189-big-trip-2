import Observable from "../framework/observable";
import { FilterTypes } from "../const";

class FiltersModel extends Observable {
    constructor() {
        super();
        this._filter = FilterTypes.EVERYTHING;
    }

    get filter() {
        return this._filter;
    }

    setFilter = (updateType, filter) => {
        this._filter = filter;
        this._notify(updateType, filter)
    }
}

export default FiltersModel;
