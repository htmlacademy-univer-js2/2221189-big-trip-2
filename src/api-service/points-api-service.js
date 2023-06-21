import ApiService from '../framework/api-service.js';
import { Method } from '../const.js';

class PointsApiService extends ApiService {
    get points() {
        return this._load({ url: 'points' })
            .then(ApiService.parseResponse);
    }

    addPoint = async (point) => {
        const response = await this._load({
          url: 'points',
          method: Method.POST,
          body: JSON.stringify(this._adaptToServer(point)),
          headers: new Headers({'Content-Type': 'application/json'}),
        });
    
        const result = await ApiService.parseResponse(response);
        return result;
      };
    
    deletePoint = async (point) => {
        const response = await this._load({
            url: `points/${point.id}`,
            method: Method.DELETE,
        });

        return response;
    };

    _adaptToServer = (point) => {
        const adaptedPoint = { ...point };
        adaptedPoint.base_price = point.basePrice;
        adaptedPoint.date_from = point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null;
        adaptedPoint.date_to = point.dateTo instanceof Date ? point.dateTo.toISOString() : null;
        adaptedPoint.is_favorite = point.isFavorite;
    
        delete adaptedPoint.basePrice;
        delete adaptedPoint.dateFrom;
        delete adaptedPoint.dateTo;
        delete adaptedPoint.isFavorite;
    
        return adaptedPoint;
      };
}

export default PointsApiService;
