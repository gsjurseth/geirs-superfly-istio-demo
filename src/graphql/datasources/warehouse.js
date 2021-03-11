import { RESTDataSource } from 'apollo-datasource-rest';
import MasterdataAPI from './masterdata';
const KEY = process.env.API_KEY || 'key';


class WarehouseAPI extends RESTDataSource {

  constructor(DEBUG) {
    super();
    if (DEBUG) this.debug = true;
    this.baseURL = `http://${process.env.WH_HOST || 'localhost'}:${process.env.WH_PORT || 3000}/warehouse`;
    this.md = new MasterdataAPI();
  }

  willSendRequest(request) {
    if (this.debug) console.log('Setting x-api-key header to: %s', KEY);
    request.headers.set('x-api-key', KEY);
  }

  async getStock() {
    const response = await this.get('')
      .then( r => {
        if (this.debug) console.log("I'm a wh teapot: %j", r);
        return r;
      })
      .catch( e => {
        console.error({"error": e});
      });
      return Array.isArray(response)
        ? response.map(m => this.whReducer(m))
        : [];
  }

  async getStockById(id) {
    if (this.debug) console.log("Entering get stock by id. Going to call: %s", `${this.baseURL}/${id}`);
    const response = await this.get(`/${id}`)
      .then( r => {
        if (this.debug) console.log("I'm a little wh teapot: %j", r);
        return r;
      })
      .catch( e => {
        console.error({"error": e});
      });
      return this.whReducer(response);
  }

  async getStockByMdRef(ref) {
    if (this.debug) console.log("Entering get stock by MD Ref. Going to call: %s", `${this.baseURL}?md_ref=${ref}`);
    const response = await this.get(`?md_ref=${ref}`)
      .then( r => {
        if (this.debug) console.log("I'm a little wh teapot: %j", r);
        return r;
      })
      .catch( e => {
        console.error({"error": e});
      });
      if (response != null) return this.whReducerNoMD(response);
      return null;
  }

  whReducerNoMD(m) {
    if (this.debug) console.log("In warehouse reducer no MD: %j", m);
    let reduced = {
      id: m._id,
      amount: m.number
    };
    if (this.debug) console.log("wh reduced no MD: %j", reduced);
    return reduced;
  }

  async whReducer(m) {
    if (this.debug) console.log("In warehouse reducer: %j", m);
    this.md.initialize({});
    let md = await this.md.getMasterdataById(m.md_ref);
    let reduced = {
      id: m._id,
      name: md.name,
      md: md,
      amount: m.number
    };
    if (this.debug) console.log("wh reduced: %j", reduced);
    return reduced;
  }
}
  
export default WarehouseAPI;
