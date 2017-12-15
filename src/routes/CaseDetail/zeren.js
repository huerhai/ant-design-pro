/* eslint-disable react/no-typos */
/**
 * Created by liwenjie on 2017/11/30.
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Input, Button, message, Select } from 'antd';
import styles from './style.less';


const { TextArea } = Input;
const { Option } = Select;

const EditableCell = ({ value, onChange }) => (
  <div>
    <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

@connect(state => ({
  claim: state.claim,
}))
export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.item.dutyList || [],
      insurancePlanList: props.item.insurancePlanList,
      loading: false,
    };
    this.columns = [{
      title: '责任',
      dataIndex: 'dutyCode',
      key: 'dutyCode',
      render: (text) => {
        return (this.state.insurancePlanList.find(item => item.dutyCode === text).dutyName);
      },
    }, {
      title: '责任详细描述',
      dataIndex: 'dutyCode',
      key: 'dutyCodeDes',
      width: '25%',
      render: (text) => {
        const ze = this.state.insurancePlanList.find(item => item.dutyCode === text);
        return (
          <div>
            {ze.insurancePlanName ? <p>保障方案:{ze.insurancePlanName}</p> : ''}
            {ze.diseaseObservationDays ? <p>疾病观察日:{ze.diseaseObservationDays}</p> : ''}
            {ze.sumInsured ? <p>保障金额:{ze.sumInsured}</p> : ''}
            {ze.aggregateDeductible ? <p>年免赔额:{ze.aggregateDeductible}</p> : ''}
            {ze.deductiblePerOccurrence ? <p>次免赔额:{ze.deductiblePerOccurrence}</p> : ''}
            {ze.limitPerOccurrence ? <p>次限额:{ze.limitPerOccurrence}</p> : ''}
            {ze.deductibleDays ? <p>约定免赔天数:{ze.deductibleDays}天</p> : ''}
            {ze.payoutRatio ? <p>赔付比例:{ze.payoutRatio * 100}%</p> : ''}
            {ze.dailyBenefit ? <p>每日津贴:{ze.dailyBenefit}</p> : ''}
            {ze.specialAgreement ? <p>{ze.specialAgreement}</p> : ''}
          </div>);
      },
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
      width: 200,
      render: (text, record) => {
        return (
          <Select defaultValue="lucy" style={{ width: 200 }} value={record.resCode} onChange={value => this.handleChange(value, record.dutyCode, 'resCode')}>
            <Option value="赔付">赔付</Option>
            <Option value="拒赔">拒赔</Option>
            <Option value="部分赔付">部分赔付</Option>
          </Select>);
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
    this.policyColumns = [{
      title: '保障方案',
      dataIndex: 'insurancePlanName',
      key: 'insurancePlanName',
    }, {
      title: '保障金额',
      dataIndex: 'sumInsured',
      key: 'sumInsured',
    }, {
      title: '免赔条款',
      dataIndex: 'aggregateDeductible',
      key: 'aggregateDeductible',
      render: (text, record) => {
        return (
          <div>
            {record.diseaseObservationDays ? <div>疾病观察日:{record.diseaseObservationDays}天</div> : ''}
            {record.aggregateDeductible ? <div>年免赔额:{record.aggregateDeductible}</div> : ''}
            {record.deductiblePerOccurrence ? <div>次免赔额:{record.deductiblePerOccurrence}</div> : ''}
            {record.limitPerOccurrence ? <div>次限额:{record.limitPerOccurrence}</div> : ''}
            {record.deductibleDays ? <div>约定免赔天数:{record.deductibleDays}天</div> : ''}
          </div>);
      },
    }, {
      title: '赔付条款',
      dataIndex: 'payoutRatio',
      key: 'payoutRatio',
      width: '25%',
      render: (payoutRatio, record) => {
        return (
          <div>
            {payoutRatio ? <div>赔付比例:{payoutRatio * 100}%</div> : ''}
            {record.dailyBenefit ? <div>每日津贴:{record.dailyBenefit}</div> : ''}
          </div>);
      },
    }, {
      title: '其他条款',
      dataIndex: 'specialAgreement',
      key: 'specialAgreement',
    }];
    this.deductionsColumns = [{
      title: '扣减项目',
      dataIndex: '1',
      width: '15%',
      key: '1',
    }, {
      title: '扣减人',
      dataIndex: '6',
      width: '15%',
      key: '6',
    }, {
      title: '扣减内容',
      dataIndex: '2',
      key: '2',
    }, {
      title: '扣减金额',
      dataIndex: '3',
      width: '15%',
      key: '3',
    }, {
      title: '扣减原因',
      dataIndex: '4',
      key: '4',
    }];
    this.deductionsDate = [];
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
    const { dispatch } = this.props;
    const { loading } = this.state;
    return (
      <div>
        <div className={styles.tableTitle}>保单详情</div>
        <Table
          className={styles.policyTable}
          bordered
          dataSource={this.state.insurancePlanList}
          columns={this.policyColumns}
          rowKey="dutyDataId"
          pagination={false}
          loading={loading}
          size="small"
        />
        <div className={styles.tableTitle}>扣减详情</div>
        <Table
          className={styles.policyTable}
          bordered
          dataSource={this.deductionsDate}
          columns={this.deductionsColumns}
          rowKey="dutyDataId"
          pagination={false}
          loading={loading}
          size="small"
        />
        <div className={styles.tableTitle}>理算结论</div>
        <Table
          style={{ marginBottom: 16 }}
          bordered
          dataSource={this.state.data}
          columns={this.columns}
          rowKey="dutyDataId"
          pagination={false}
          loading={loading}
        />
        <Button
          className={styles.saveBtn}
          type="primary"
          onClick={() => {
            this.setState({
              loading: true,
            });
            this.state.data.forEach((duty) => {
              dispatch({
                type: 'caseList/updateDutyByClaimId',
                payload: duty,
                callback: () => {
                  message.success('理赔汇总 修改成功');
                  this.setState({
                    loading: false,
                  });
                },
              });
            });
          }}
        >
          保存
        </Button>
      </div>);
  }
}
