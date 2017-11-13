import mockjs from 'mockjs';

// mock tableListDataSource
let tableListDataSource = mockjs.mock({
  'list|1-30': [{
    key: '@id',
    编号: /\d{5}/,
    公司名: /\d{4}公司/,
    标示: /分公司|中支公司/,
    联系人: '@cname',
    联系电话: /1[34567]\d{9}/,
  }],
}).list;


export function getCompany(req, res) {
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

export function postCompany(req, res, _, b) {
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
  getCompany,
  postCompany,
};
