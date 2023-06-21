import AbstractView from '../framework/view/abstract-view.js';

const loadingTemplate = () => (
  `<p class="board__no-tasks">
    Loading...
  </p>`
);

class LoadingView extends AbstractView {
  get template() {
    return loadingTemplate();
  }
}

export default LoadingView;
