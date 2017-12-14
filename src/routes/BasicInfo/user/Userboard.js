import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, message } from 'antd';
import ListTable from './list';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './Userboard.less';
import EditModal from './modle';

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

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="帐号">
              {getFieldDecorator('帐号')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('姓名')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="公司属性">
              {getFieldDecorator('公司属性')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="类型1">类型1</Option>
                  <Option value="类型2">类型2</Option>
                  <Option value="类型3">类型3</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属公司">
              {getFieldDecorator('所属公司')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="公司1">公司1</Option>
                  <Option value="公司2">公司2</Option>
                  <Option value="公司3">公司3</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
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

    const pageHeaderContent = (
      <div style={{ textAlign: 'center' }}>
        {/* <Input.Search
          placeholder="请输入"
          enterButton="搜索"
          size="large"
          onSearch={this.handleFormSubmit}
          style={{ width: 522 }}
        /> */}
      </div>
    );

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout
        title="用户管理"
        content={pageHeaderContent}
        tabList={tabList}
        onTabChange={this.handleTabChange}
      >
        <div>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                {this.renderSimpleForm()}
              </div>
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
                {
                  selectedRows.length > 0 && (
                    <span>
                      <Button>批量操作</Button>
                      <Dropdown overlay={menu}>
                        <Button>
                          更多操作 <Icon type="down" />
                        </Button>
                      </Dropdown>
                    </span>
                  )
                }
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
