import axios from 'axios';

const apikey = 'm1TPwIAyYWxRPloeOzD0Ol6u59yxZQab';
const rooturl = 'https://emea-poc15-test.apigee.net/v1/retail';

const state = {
    items: [
    ]
};

const getters = {
    allItems: (state) => state.items
};

const actions = {
    async fetchItems( {commit}) {
        console.log('about to call: %s', `${rooturl}/md`);
        const r = await axios.get(`${rooturl}/md`, {
            headers: {
                apikey
            }
        });
        console.log('the data: %j', r.data);
        commit('setItems', r.data);
    },
    async addItem({commit}, o) {
        const r = await axios({
            url: `${rooturl}/md`,
            method: 'post',
            headers: {
                apikey
            },
            data: {
                name: o.name,
                desc: o.desc,
                img: o.img
            }
         });
        commit('newItem', r.data);
    }
};

const mutations = {
    setItems: (state, items) => {
        state.items = items;
    },
    newItem: (state, item) => state.items.unshift(item)
};

export default {
    state,
    getters,
    actions,
    mutations
};