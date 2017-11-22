import { queryRreList } from '../services/Basic';

export default {
  namespace: 'preList',

  state: {
    list: [],
    loading: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryRreList, payload);
      yield put({
        type: 'freshList',
        payload: Array.isArray(response.list) ? response : [],
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    freshList(state, action) {
      return {
        ...state,
        list: action.payload.list,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
