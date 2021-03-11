import { RESTDataSource } from 'apollo-datasource-rest';
import PricesAPI from './prices';
import WarehouseAPI from './warehouse';

const KEY = process.env.API_KEY || 'key';

class CatalogAPI extends RESTDataSource {

  constructor(DEBUG) {
    super();
    if (DEBUG) this.debug = true;
    this.baseURL = `http://${process.env.MD_HOST || 'localhost'}:${process.env.MD_PORT || 3000}/md`;
    this.price = new PricesAPI(DEBUG);
    this.stock = new WarehouseAPI(DEBUG);
  }

  willSendRequest(request) {
    if (this.debug) console.log('Setting x-api-key header to: %s', KEY);
    request.headers.set('x-api-key', KEY);
  }

  async getCatalog() {
    const response = await this.get('')
      .then( r => {
        if (this.debug) console.log("I'm a catalog teapot: %j", r);
        return r;
      })
      .catch( e => {
        console.error({"error": e});
      });
      return Array.isArray(response)
        ? response.map(m => this.catalogReducer(m))
        : [];
  }

  async getCatalogItemById(id) {
    const response = await this.get(`/${id}`)
      .then( r => {
        if (this.debug) console.log("I'm a little catalog teapot: %j", r);
        return r;
      })
      .catch( e => {
        console.error({"error": e});
      });
      return this.catalogReducer(response);
  }

  async getCatalogItemByName(name) {
    if (this.debug) console.log("Entereing getCatalogByName and calling url: %s", `${this.baseURL}?name=${name}`);
    const response = await this.get(`?name=${name}`)
      .then( r => {
        if (this.debug) console.log("I'm a little catalog teapot: %j", r); return r; })
      .catch( e => {
        console.error({"error": e});
      });
      return this.catalogReducer(response);
  }

  async catalogReducer(m) {
    if (this.debug) console.log("Entering the catalogReducer with: %j", m);
    this.stock.initialize({});
    this.price.initialize({});
    let s = await this.stock.getStockByMdRef(m._id) || null;
    let p = await this.price.getPriceByMdRef(m._id) || null;

    let stock = (s!=null) ? s.amount : null;
    let price = (p!=null) ? p.price : null;
    let reduced = {
      id: m._id,
      name: m.name,
      desc: m.desc,
      img: m.img,
      price: price,
      stock: stock,
    };
    if (this.debug) console.log("catalog reduced: %j", reduced);
    return reduced;
  }
}
  
export default CatalogAPI;
