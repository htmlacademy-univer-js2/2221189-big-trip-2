import { remove, render, RenderPosition } from "../framework/render";
import EditPointView from "../view/edit-point-view";
import { UserActions, UpdateTypes } from "../const";

class NewPointPresenter {
  constructor(pointListContainer, changeDataCallback) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeDataCallback;
    this._destroyCallback = null
    this._pointEditComponent = null;
  }

  init(callback, offers, destinations, cities) {
    this._destroyCallback = callback;

    if (this._pointEditComponent !== null) {
      return;
    }

    this._pointEditComponent = new EditPointView(offers, destinations, cities);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointEditComponent, this._pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  };

  destroy = () => {
    if (this._pointEditComponent === null) {
      return;
    }

    this._destroyCallback?.();

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  };
  
  setSaving = () => {
    this._pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    this._pointEditComponent.shake(this._resetFormState);
  };

  _resetFormState = () => {
    this._pointEditComponent.updateElement({
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  };

  _handleFormSubmit = (point) => {
    this._changeData(UserActions.ADD_POINT, UpdateTypes.MINOR, point);
    this.destroy();
  };

  _handleDeleteClick = () => {
    this.destroy();
  };

  _escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}

export default NewPointPresenter;