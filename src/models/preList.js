import { queryRreList, updatePreCase, freshRreList } from '../services/Basic';

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
    *publish({ payload, callback }, { call, put }) {
      const data = Object.assign({}, payload, { pretreatmentStatus: '1' });
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(updatePreCase, data);
      yield put({
        type: 'save',
        payload: data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      if (callback) callback(data, res);
    },
    *delete({ payload, callback }, { call, put }) {
      const data = Object.assign({}, payload, { active: false });
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(updatePreCase, data);
      yield put({
        type: 'deleteFromCase',
        payload: data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      if (callback) callback(data, res);
    },
    *fresh({ callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(freshRreList);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      if (callback) callback();
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
    deleteFromCase(state, { payload }) {
      const list = state.list.filter((item) => {
        return item.eventPretreatmentId !== payload.eventPretreatmentId;
      });
      return {
        ...state,
        list,
      };
    },
  },
};
