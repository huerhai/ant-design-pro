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
  newMember = (收据类型) => {
    const newData = [...this.state.data];
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      收据类型,
      收据日期: '',
      收据号: '',
      费用总额: '0',
      乙类自付: '0',
      自费部分: '0',
      统筹支付额: '0',
      附加支付金额: '0',
      大病支付: '0',
      第三方支付: '0',
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
      if (!target.费用总额) {
        message.error('必须填写费用总额');
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
      title: '收据类型',
      dataIndex: '收据类型',
      key: '收据类型',
      width: 100,
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '收据类型', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="收据类型"
            />
          );
        }
        return `${text}`;
      },
    }, {
      title: '收据日期',
      dataIndex: '收据日期',
      key: '收据日期',
      width: 120,
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '收据日期', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="YYYYMMDD"
            />
          );
        }
        return `${text}`;
      },
    }, {
      title: '收据号',
      dataIndex: '收据号',
      key: '收据号',
      width: '12%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '收据号', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="收据号"
            />
          );
        }
        return `${text}`;
      },
    }, {
      title: '费用总额',
      dataIndex: '费用总额',
      key: '费用总额',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '费用总额', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="费用总额"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '乙类自付',
      dataIndex: '乙类自付',
      key: '乙类自付',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '乙类自付', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="乙类自付"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '自费部分',
      dataIndex: '自费部分',
      key: '自费部分',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '自费部分', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="自费部分"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '统筹支付额',
      dataIndex: '统筹支付额',
      key: '统筹支付额',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '统筹支付额', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="统筹支付额"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '附加支付金额',
      dataIndex: '附加支付金额',
      key: '附加支付金额',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '附加支付金额', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="附加支付金额"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '大病支付',
      dataIndex: '大病支付',
      key: '大病支付',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '大病支付', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="大病支付"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '第三方支付',
      dataIndex: '第三方支付',
      key: '第三方支付',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '第三方支付', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="第三方支付"
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
          size="small"
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
