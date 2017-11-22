import { queryRreList, updatePreCase } from '../services/Basic';

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
    *update({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(updatePreCase, payload);
      yield put({
        type: 'save',
        payload,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      if (callback) callback(payload, res);
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
    save(state, { payload }) {
      const list = state.list.map((item) => {
        if (item.eventPretreatmentId === payload.eventPretreatmentId) {
          return payload;
        }
        return item;
      });
      return {
        ...state,
        list,
      };
    },
  },
};
