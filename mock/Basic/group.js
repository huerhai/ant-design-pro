import mockjs from 'mockjs';

// mock tableListDataSource
let tableListDataSource = mockjs.mock({
  'list|1-30': [{
    key: '@id',
    团体名称: /\d{3}团体/,
    产品名称: /产品[1-3]/,
    团体编号: /\d{3}/,
    联系人: '@cname',
    联系电话: /1[3-8]\d{9}/,
    理赔时效: /[一二三]个工作日/,
    所属保险公司: /公司[1-3]/,
  }],
}).list;


export function get(req, res) {
  let dataSource = [...tableListDataSource];

  const { query } = req;
  const { pageSize = 10, page = 1, ...other } = query;

  for (const key in other) {
    if ({}.hasOwnProperty.call(other, key)) {
      dataSource = dataSource.filter((item) => {
        if ({}.hasOwnProperty.call(item, key)) {
          return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1;
        }
        return true;
      });
    }
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(page, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function post(req, res, _, b) {
  const body = (b && b.body) || req.body;
  const { method, ...obj } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => item.key !== obj.key);
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map((item) => {
        return item.key === obj.key ? obj : item;
      });
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift(Object.assign(obj, { key: i }));
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  get,
  post,
};
