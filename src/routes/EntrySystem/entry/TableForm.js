import React, { PureComponent } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider } from 'antd';
import styles from './style.less';

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
  newMember = () => {
    const newData = [...this.state.data];
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      费用总额: '0',
      乙类自付: '0',
      自费部分: '0',
      统筹支付额: '0',
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
        message.error('请填写完整成员信息。');
        e.target.focus();
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
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
      title: '费用总额',
      dataIndex: '费用总额',
      key: '费用总额',
      width: '15%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '费用总额', record.key)}
              onBlur={e => this.saveRow(e, record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="费用总额"
              addonAfter="元"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '乙类自付',
      dataIndex: '乙类自付',
      key: '乙类自付',
      width: '15%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '乙类自付', record.key)}
              onBlur={e => this.saveRow(e, record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="乙类自付"
              addonAfter="元"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '自费部分',
      dataIndex: '自费部分',
      key: '自费部分',
      width: '15%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '自费部分', record.key)}
              onBlur={e => this.saveRow(e, record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="自费部分"
              addonAfter="元"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '统筹支付额',
      dataIndex: '统筹支付额',
      key: '统筹支付额',
      width: '15%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '统筹支付额', record.key)}
              onBlur={e => this.saveRow(e, record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="统筹支付额"
              addonAfter="元"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '扣除小计',
      dataIndex: '费用总额',
      key: '扣除小计',
      width: '15%',
      render: (text, record) => {
        return `${(+record.乙类自付) + (+record.自费部分) + (+record.统筹支付额)}元`;
      },
    }, {
      title: '核定小计',
      dataIndex: '费用总额',
      key: '核定小计',
      width: '15%',
      render: (text, record) => {
        return `${(+text) - ((+record.乙类自付) + (+record.自费部分) + (+record.统筹支付额))}元`;
      },
    }, {
      title: '操作',
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
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增收据
        </Button>
      </div>
    );
  }
}
