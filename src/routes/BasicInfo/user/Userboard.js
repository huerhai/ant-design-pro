import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, message } from 'antd';
import ListTable from './list';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './Userboard.less';
import EditModal from './EditModal';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@Form.create()
@connect(state => ({
  group: state.group,
}))
export default class Userboard extends Component {
  state = {
    currentItem: {},
    modalVisible: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/fetch',
    });
  }

  handleListTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'group/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'group/fetch',
      payload: {},
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'group/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'group/fetch',
        payload: values,
      });
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAdd = (data) => {
    if (data.key) {
      this.props.dispatch({
        type: 'group/update',
        payload: data,
        callback: () => {
          message.success('修改成功');
        },
      });
    } else {
      this.props.dispatch({
        type: 'group/add',
        payload: data,
        callback: () => {
          message.success('添加成功');
        },
      });
    }
    this.setState({
      modalVisible: false,
    });
  }

  handleEdit = (data) => {
    this.setState({
      modalVisible: true,
      currentItem: data,
    });
  }

  handleDelete = (data) => {
    this.props.dispatch({
      type: 'group/remove',
      payload: data,
      callback: () => {
        message.success('删除成功');
      },
    });
  }

  handleTabChange = (key) => {
    const { dispatch } = this.props;
    switch (key) {
      case 'user':
        dispatch(routerRedux.push('/users'));
        break;
      case 'role':
        dispatch(routerRedux.push('/roles'));
        break;
      default:
        break;
    }
  }

  render() {
    const { group: { loading: groupLoading, data } } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const tabList = [
      {
        key: 'user',
        tab: '用户管理',
      },
      {
        key: 'role',
        tab: '角色管理',
      },
    ];

    return (
      <PageHeaderLayout
        title="用户管理"
        tabList={tabList}
        onTabChange={this.handleTabChange}
      >
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => {
                    this.setState({
                      currentItem: {},
                      modalVisible: true,
                    });
                }}
                >
                  新建
                </Button>
              </div>
              <ListTable
                selectedRows={selectedRows}
                loading={groupLoading}
                data={data}
                onEdit={this.handleEdit}
                onDelete={this.handleDelete}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleListTableChange}
              />
            </div>
          </Card>
          <EditModal
            title={this.state.currentItem.key ? '编辑用户' : '新建用户'}
            visible={modalVisible}
            item={this.state.currentItem}
            onOk={this.handleAdd}
            onCancel={() => this.handleModalVisible()}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
