import { RESTDataSource } from 'apollo-datasource-rest';

// grab our env vars or set them to defaults
/*
const ev = {
    mdURL: `http://${process.env.MD_HOST || 'localhost'}:${process.env.MD_PORT || 3000}/md`,
    whURL: `http://${process.env.WH_HOST || 'localhost'}:${process.env.WH_PORT || 3000}/warehouse`,
    priceURL: `http://${process.env.PRICE_HOST || 'localhost'}:${process.env.PRICE_PORT || 3000}/md`,
    cartURL: `http://${process.env.CART_HOST || 'localhost'}:${process.env.CART_PORT || 3000}/md`,
    KEY: `${process.env.APIKEY}`
}
*/

class MasterdataAPI extends RESTDataSource {

  constructor(DEBUG) {
    super();
    if (DEBUG) this.debug = true;
    this.baseURL = `http://${process.env.MD_HOST || 'localhost'}:${process.env.MD_PORT || 3000}/md`;
  }

  async getMasterdata() {
    console.log("about to call: %s", this.baseURL);
    const response = await this.get('')
      .then( r => {
        if (this.debug) console.log("I'm a little teapot: %j", r);
        return r;
      })
      .catch( e => {
        console.error({"error": e});
      });
      return Array.isArray(response)
        ? response.map(m => this.masterdataReducer(m))
        : [];
  }

  masterdataReducer(m) {
    return {
      id: m._id,
      img: m.img,
      name: m.name,
      desc: m.desc
    }
  }
}
  
//module.exports = MasterdataAPI;
export default MasterdataAPI;