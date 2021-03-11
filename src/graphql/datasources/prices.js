import { RESTDataSource } from 'apollo-datasource-rest';
import MasterdataAPI from './masterdata';
const KEY = process.env.API_KEY || 'key';

class PricesAPI extends RESTDataSource {

  constructor(DEBUG) {
    super();
    if (DEBUG) this.debug = true;
    this.baseURL = `http://${process.env.PRICE_HOST || 'localhost'}:${process.env.PRICE_PORT || 3000}/price`;
    this.md = new MasterdataAPI();
  }

  willSendRequest(request) {
    if (this.debug) console.log('Setting x-api-key header to: %s', KEY);
    request.headers.set('x-api-key', KEY);
  }

  async getPrices() {
    const response = await this.get('')
      .then( r => {
        if (this.debug) console.log("I'm a little teapot: %j", r);
        return r;
      })
      .catch( e => {
        console.error({"error": e});
      });
      return Array.isArray(response)
        ? response.map(m => this.priceReducer(m))
        : [];
  }

  async getPriceById(id) {
    if (this.debug) console.log("Entery get price by id with id: %s", id);
    const response = await this.get(`/${id}`)
      .then( r => {
        if (this.debug) console.log("I'm a little teapot: %j", r);
        return r;
      })
      .catch( e => {
        console.error({"error": e});
      });
      return this.priceReducer(response);
  }

  async getPriceByMdRef(ref) {
    if (this.debug) console.log("Entery get price by id with id: %s", `${this.baseURL}?md_ref=${ref}`);
    const response = await this.get(`?md_ref=${ref}`)
      .then( r => {
        if (this.debug) console.log("I'm a little teapot: %j", r);
        return r;
      })
      .catch( e => {
        console.error({"error": e});
      });
      if (response != null) return this.priceReducerNoMD(response);
      return null;
  }

  async priceReducerNoMD(m) {
    if (this.debug) console.log("In prices reducer No MD: %j", m);
    let reduced = {
      id: m._id,
      price: m.price
    };
    if (this.debug) console.log("price reduced No MD: %j", reduced);
    return reduced;
  }

  async priceReducer(m) {
    if (this.debug) console.log("In prices reducer: %j", m);
    //this.md.initialize({});
    //let md = await this.md.getMasterdataById(m.md_ref);
    let reduced = {
      id: m._id,
      //name: md.name,
      //md: md,
      price: m.price
    };
    if (this.debug) console.log("price reduced: %j", reduced);
    return reduced;
  }
}
  
export default PricesAPI;
