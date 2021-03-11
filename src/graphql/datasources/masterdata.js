import { RESTDataSource } from 'apollo-datasource-rest';
const KEY = process.env.API_KEY || 'key';

class MasterdataAPI extends RESTDataSource {

  constructor(DEBUG) {
    super();
    if (DEBUG) this.debug = true;
    this.baseURL = `http://${process.env.MD_HOST || 'localhost'}:${process.env.MD_PORT || 3000}/md`;
  }

  willSendRequest(request) {
    if (this.debug) console.log('Setting x-api-key header to: %s', KEY);
    request.headers.set('x-api-key', KEY);
  }

  async getMasterdata() {
    const response = await this.get('')
      .then( r => {
        if (this.debug) console.log("I'm a little md teapot: %j", r);
        return r;
      })
      .catch( e => {
        console.error({"error": e});
      });
      return Array.isArray(response)
        ? response.map(m => this.masterdataReducer(m))
        : [];
  }

  async getMasterdataById(id) {
    const response = await this.get(`/${id}`)
      .then( r => {
        if (this.debug) console.log("I'm a little md teapot: %j", r);
        return r;
      })
      .catch( e => {
        console.error({"error": e});
      });
      return this.masterdataReducer(response);
  }

  async getMasterdataByName(name) {
    const response = await this.get(`?name=${name}`)
      .then( r => {
        if (this.debug) console.log("I'm a little md teapot: %j", r);
        return r;
      })
      .catch( e => {
        console.error({"error": e});
      });
      return this.masterdataReducer(response);
  }

  masterdataReducer(m) {
    return {
      md_id: m._id,
      img: m.img,
      name: m.name,
      desc: m.desc
    }
  }
}
  
//module.exports = MasterdataAPI;
export default MasterdataAPI;
