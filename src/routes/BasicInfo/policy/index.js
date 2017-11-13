import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, message } from 'antd';
import ListTable from './list';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import EditModal from './modle';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  policy: state.policy,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    currentItem: {},
    modalVisible: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'policy/fetch',
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
      type: 'policy/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'policy/fetch',
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
          type: 'policy/remove',
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
        type: 'policy/fetch',
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
        type: 'policy/update',
        payload: data,
        callback: () => {
          message.success('修改成功');
        },
      });
    } else {
      this.props.dispatch({
        type: 'policy/add',
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
      type: 'policy/remove',
      payload: data,
      callback: () => {
        message.success('删除成功');
      },
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="被保人姓名">
              {getFieldDecorator('被保人姓名')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="被保人身份证">
              {getFieldDecorator('被保人身份证')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="团体名称">
              {getFieldDecorator('团体名称')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="保险公司">
              {getFieldDecorator('保险公司')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="公司1">公司1</Option>
                  <Option value="公司2">公司2</Option>
                  <Option value="公司3">公司3</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="产品名称">
              {getFieldDecorator('产品名称')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="产品1">产品1</Option>
                  <Option value="产品2">产品2</Option>
                  <Option value="产品3">产品3</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属团体">
              {getFieldDecorator('所属团体')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="团体1">团体1</Option>
                  <Option value="团体2">团体2</Option>
                  <Option value="团体3">团体3</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="医保类型">
              {getFieldDecorator('医保类型')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="城镇">城镇</Option>
                  <Option value="农村">农村</Option>
                  <Option value="新农合">新农合</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
    const { policy: { loading: policyLoading, data } } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout title="保单管理">
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
              loading={policyLoading}
              data={data}
              onEdit={this.handleEdit}
              onDelete={this.handleDelete}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleListTableChange}
            />
          </div>
        </Card>
        <EditModal
          title={this.state.currentItem.key ? '编辑保险公司' : '新建保险公司'}
          visible={modalVisible}
          item={this.state.currentItem}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible()}
        />
      </PageHeaderLayout>
    );
  }
}
