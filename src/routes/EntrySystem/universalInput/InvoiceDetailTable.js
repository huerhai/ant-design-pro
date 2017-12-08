/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider } from 'antd';

import styles from './invoiceStyle.less';

export default class TableForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
      });
      if (!nextProps.value) {
        this.newMember();
      }
    } else if (this.state.data.length === 0) {
      this.newMember();
    }
  }
  getRowByKey(key) {
    return this.state.data.filter(item => item.key === key)[0];
  }
  index = 0;
  cacheOriginData = {};
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submit',
          payload: values,
        });
      }
    });
  }
  toggleEditable(e, key) {
    e.preventDefault();
    const target = this.getRowByKey(key);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: [...this.state.data] });
    }
  }
  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
    this.props.onChange(newData);
  }
  newMember = () => {
    const newData = [...this.state.data];
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      费用类型: '',
      费用名称: '',
      数量: '1',
      单价: '0',
      金额: '0',
      自负比例: '0',
      自负金额: '0',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  }
  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
  handleFieldChange(e, fieldName, key) {
    const newData = [...this.state.data];
    const target = this.getRowByKey(key);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }
  saveRow(e, key) {
    e.persist();
    // save field when blur input
    setTimeout(() => {
      if (document.activeElement.tagName === 'INPUT' &&
          document.activeElement !== e.target) {
        return;
      }
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key);
      if (!target.费用名称) {
        message.error('必须填写费用名称');
        e.target.focus();
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      if (!this.state.data[this.state.data.length - 1].editable) {
        this.newMember();
      }
      this.props.onChange(this.state.data);
    }, 10);
  }
  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const target = this.getRowByKey(key);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({ data: [...this.state.data] });
  }
  render() {
    const columns = [{
      title: '费用类型',
      dataIndex: '费用类型',
      key: '费用类型',
      width: 100,
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '费用类型', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="费用类型"
            />
          );
        }
        return `${text}`;
      },
    }, {
      title: '费用名称',
      dataIndex: '费用名称',
      key: '费用名称',
      width: '25%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '费用名称', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="费用名称"
            />
          );
        }
        return `${text}`;
      },
    }, {
      title: '数量',
      dataIndex: '数量',
      key: '数量',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '数量', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="数量"
            />
          );
        }
        return `${text}`;
      },
    }, {
      title: '单价',
      dataIndex: '单价',
      key: '单价',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '单价', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="单价"
              addonAfter="元"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '金额(总价)',
      dataIndex: '金额',
      key: '金额(总价)',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '金额(总价)', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="金额(总价)"
              addonAfter="元"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '自付比例',
      dataIndex: '自付比例',
      key: '自付比例',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '自付比例', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="自费部分"
              addonAfter="%"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '自负金额',
      dataIndex: '自负金额',
      key: '自负金额',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '自负金额', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="统筹支付额"
              addonAfter="元"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '操作',
      width: 130,
      key: 'action',
      render: (text, record) => {
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a>保存</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <a>保存</a>
              <Divider type="vertical" />
              <a onClick={e => this.cancel(e, record.key)}>取消</a>
            </span>
          );
        }
        return (
          <span>
            <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    }];
    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          rowClassName={(record) => {
            return record.editable ? styles.editable : '';
          }}
        />
      </div>
    );
  }
}
