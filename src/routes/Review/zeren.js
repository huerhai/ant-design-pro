/* eslint-disable react/no-typos */
/**
 * Created by liwenjie on 2017/11/30.
 */
import React from 'react';
import { Table, Input } from 'antd';

const { TextArea } = Input;

const data = [];
for (let i = 0; i < 100; i += 1) {
  data.push({
    dutyCode: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

const EditableCell = ({ value, onChange }) => (
  <div>
    <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '责任',
      dataIndex: 'dutyCode',
    }, {
      title: '赔付金额',
      dataIndex: 'dutyPay',
      width: 150,
      render: (text, record) => {
        return (<Input
          value={record.dutyPay}
          onChange={e => this.handleChange(e.target.value, record.dutyCode, 'dutyPay')}
        />);
      },
    }, {
      title: '赔付结论',
      dataIndex: 'resCode',
      width: 250,
      render: (text, record) => {
        return (<Input
          value={record.resCode}
          onChange={e => this.handleChange(e.target.value, record.dutyCode, 'resCode')}
        />);
      },
    }, {
      title: '结论原因',
      dataIndex: 'resReason',
      render: (text, record) => {
        return (<TextArea
          rows={4}
          value={record.resReason}
          onChange={e => this.handleChange(e.target.value, record.dutyCode, 'resReason')}
        />);
      },
    }, {
      title: '审核意见',
      dataIndex: 'resOpinion',
      render: (text, record) => {
        return (<TextArea
          rows={4}
          value={record.resOpinion}
          onChange={e => this.handleChange(e.target.value, record.dutyCode, 'resOpinion')}
        />);
      },
    }];
    this.state = { data: props.item.dutyList || [] };
    this.cacheData = this.state.data.map(item => ({ ...item }));
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.item.dutyList,
    });
  }
  handleChange(value, dutyCode, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => dutyCode === item.dutyCode)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit(dutyCode) {
    const newData = [...this.state.data];
    const target = newData.filter(item => dutyCode === item.dutyCode)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(dutyCode) {
    const newData = [...this.state.data];
    const target = newData.filter(item => dutyCode === item.dutyCode)[0];
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
      this.cacheData = newData.map(item => ({ ...item }));
    }
  }
  cancel(dutyCode) {
    const newData = [...this.state.data];
    const target = newData.filter(item => dutyCode === item.dutyCode)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => dutyCode === item.dutyCode)[0]);
      delete target.editable;
      this.setState({ data: newData });
    }
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.dutyCode, column)}
      />
    );
  }
  render() {
    return <Table bordered dataSource={this.state.data} columns={this.columns} rowKey="dutyCode" pagination={false} />;
  }
}
