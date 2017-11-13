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
  company: state.company,
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
      type: 'company/fetch',
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
      type: 'company/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'company/fetch',
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
          type: 'company/remove',
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
        type: 'company/fetch',
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
        type: 'company/update',
        payload: data,
        callback: () => {
          message.success('修改成功');
        },
      });
    } else {
      this.props.dispatch({
        type: 'company/add',
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
      type: 'company/remove',
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
            <FormItem label="公司名">
              {getFieldDecorator('公司名')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="公司编号">
              {getFieldDecorator('编号')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="总分公司标示">
              {getFieldDecorator('标示')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="分公司">分公司</Option>
                  <Option value="中支公司">中支公司</Option>
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
    const { company: { loading: companyLoading, data } } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout title="保险公司管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>新建</Button>
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
              loading={companyLoading}
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
