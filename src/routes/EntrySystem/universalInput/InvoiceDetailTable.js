/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Select } from 'antd';
import SelectNet from './selectNet';
import styles from './invoiceStyle.less';

const { Option } = Select;


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
      自付比例: '0',
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
            <Select
              showSearch
              style={{ width: 130 }}
              optionFilterProp="children"
              value={text}
              onChange={e => this.handleFieldChange(e, '费用类型', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="费用类型"
              filterOption={(input, option) => {
                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            >
              <Option value="01西药费">西药费</Option>
              <Option value="02中成药费">中成药费</Option>
              <Option value="03中草药费">中草药费</Option>
              <Option value="04民族药费">民族药费</Option>
              <Option value="05自制制剂">自制制剂</Option>
              <Option value="06挂号费">挂号费</Option>
              <Option value="07诊察费">诊察费</Option>
              <Option value="08检查费">检查费</Option>
              <Option value="09化验费">化验费</Option>
              <Option value="10放射检查费">放射检查费</Option>
              <Option value="11特检费">特检费</Option>
              <Option value="12治疗费">治疗费</Option>
              <Option value="13麻醉费">麻醉费</Option>
              <Option value="14手术费">手术费</Option>
              <Option value="15输血费">输血费</Option>
              <Option value="16输氧费">输氧费</Option>
              <Option value="17材料费">材料费</Option>
              <Option value="18护理费">护理费</Option>
              <Option value="19床位费">床位费</Option>
              <Option value="20抢救费">抢救费</Option>
              <Option value="21救护车费">救护车费</Option>
              <Option value="22生育费">生育费</Option>
              <Option value="23诊疗费">诊疗费</Option>
              <Option value="24医事服务费">医事服务费</Option>
              <Option value="25药事服务费">药事服务费</Option>
              <Option value="26查勘费">查勘费</Option>
              <Option value="99其它费">其它费</Option>
            </Select>
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
      title: '单价(元)',
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
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '金额(元)',
      dataIndex: '金额',
      key: '金额',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, '金额', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="金额"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '自付比例(%)',
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
              placeholder="自付比例"
            />
          );
        }
        return `${text}元`;
      },
    }, {
      title: '自负金额(元)',
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
