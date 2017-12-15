/* eslint-disable no-param-reassign */
import { getPolicyById } from '../services/case';

export default {
  namespace: 'entry',

  state: {
    currentItem: {},
  },

  effects: {
    *fetchPolicy({ payload, callback }, { call, put }) {
      const { id } = payload;
      const res = yield call(getPolicyById, {
        companyId: {
          referenceCode: '000205',
          type: 20,
        },
        id,
        idType: {
          referenceCode: '111',
          type: 2,
        },
      });
      yield put({
        type: 'updatePorps',
        payload: {
          currentItem: res,
        },
      });
      if (callback) callback(res);
    },
  },

  reducers: {
    updatePorps(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
