import { updatePreCase, freshRreList } from '../services/Basic';
import { queryList, updateStatusCodes, getClaimById, getDutyByClaimId, updateDutyByClaimId, getPolicyById } from '../services/case';

export default {
  namespace: 'caseList',

  state: {
    list: [],
    currentItem: {},
    loading: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryList, payload);
      yield put({
        type: 'freshList',
        payload: Array.isArray(response.list) ? response : [],
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response1 = yield call(getClaimById, payload.claimDataId);
      const response2 = yield call(getDutyByClaimId, payload.claimId);
      const response3 = yield call(getPolicyById, {
        companyId: {
          ...payload.companyName,
        },
        id: response1.insuredPerson.id,
        idType: {
          ...response1.insuredPerson.idType,
        },
      });
      console.log(response3);
      const newItem = {
        ...payload,
        detail: response1,
        dutyList: response2,
        policyList: response3,
        insurancePlanList: response3.reduce((a, b) => a.concat(b.insurancePlanResponseList), []),
      };
      yield put({
        type: 'updatePorps',
        payload: {
          currentItem: newItem,
        },
      });
      if (callback) callback(newItem);
    },
    *updateDutyByClaimId({ payload, callback }, { call }) {
      const res = yield call(updateDutyByClaimId, payload);
      if (callback) callback(payload, res);
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
    *changeStatus({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(updateStatusCodes, payload);
      yield put({
        type: 'saveStatus',
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
    updatePorps(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    freshList(state, action) {
      return {
        ...state,
        list: action.payload.list,
        total: action.payload.totalElement,
        page: action.payload.current,
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
        if (item.claimDataId === payload.claimDataId) {
          return payload;
        }
        return item;
      });
      return {
        ...state,
        list,
      };
    },
    saveStatus(state, { payload: { items, to } }) {
      console.log(items, to);
      const list = state.list.map((item) => {
        if (items.indexOf(item.claimDataId) > -1) {
          return Object.assign({}, item, { status: to });
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
        return item.claimDataId !== payload.claimDataId;
      });
      return {
        ...state,
        list,
      };
    },
  },
};
