import { queryBasicProfile, queryAdvancedProfile } from '../services/api';
import { getClaimById, getDutyByClaimId, getPolicyById } from '../services/case';

export default {
  namespace: 'claim',

  state: {
    currentItem: {},
    basicGoods: [],
    basicLoading: true,
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation3: [],
    advancedLoading: true,
  },

  effects: {
    *fetchDetail({ payload, callback }, { call, put }) {
      const response1 = yield call(getClaimById, payload.claimDataId);
      const response2 = yield call(getDutyByClaimId, payload.claimId);
      const response3 = yield call(getPolicyById, {
        companyId: {
          ...response1.companyId,
        },
        id: response1.insuredPerson.id,
        idType: {
          ...response1.insuredPerson.idType,
        },
      });
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
    *fetchBasic(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { basicLoading: true },
      });
      const response = yield call(queryBasicProfile);
      yield put({
        type: 'show',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: { basicLoading: false },
      });
    },
    *fetchAdvanced(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { advancedLoading: true },
      });
      const response = yield call(queryAdvancedProfile);
      yield put({
        type: 'show',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: { advancedLoading: false },
      });
    },
  },

  reducers: {
    updatePorps(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
