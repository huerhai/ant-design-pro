/* eslint-disable no-unused-vars,react/no-unused-state */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Radio, DatePicker, Cascader, InputNumber, Tabs, Icon, Button, Dropdown, Menu, message, Divider, Collapse, Alert } from 'antd';
import FooterToolbar from '../../../components/FooterToolbar';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import UniversalInput from '../../../components/UniversalInput';
import UniversalForm from '../../../components/UniversalForm';
import InvoiceTable from './InvoiceTable';
import { date } from '../../../utils/utils';

import InvoiceDetailTable from './InvoiceDetailTable';
import SelectNet from './selectNet';
import styles from './index.less';

import { basicInfo, basicEventInfo, invoiceInfo, claim as claimSchema, event as eventSchema, person as personSchema } from './claim';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  group: state.group,
  entry: state.entry,
}))
@Form.create()
export default class UniversalClaim extends PureComponent {
  constructor(props) {
    super(props);
    this.newTabIndex = 1;
    this.state = {
      policyFromNet: undefined,
      policyValidate: undefined,
      insurancePlanResponseList: [],
      basicInfo,
      basicEventInfo,
      invoiceInfo,
      claimSchema,
      eventSchema,
      personSchema,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/fetch',
    });
  }
  onChange = (activeKey) => {
    this.setState({ activeKey });
  }
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }
  onPeasonEdit = (targetKey, action) => {
    if (action === 'remove') this.removePeason(targetKey);
  }
  getInputForm(data) {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const children = [];
    Object.keys(data.properties)
      .forEach((key) => {
        const item = data.properties[key];
        if (data.properties[key].type === 'selectNET') {
          children.push(
            <Col span={item.style.span || 6} key={key} style={{ display: item.hide ? (getFieldValue(item.hide[0].key) === item.hide[0].value ? 'none' : 'inline-block') : 'inline-block' }}>
              <FormItem {...{ ...formItemLayout, ...item.style.formItem }} label={item.title}>
                {getFieldDecorator(key, {
                  initialValue: item.defaultValue,
                })(
                  <SelectNet />
                )}
              </FormItem>
            </Col>
          );
        } else {
          children.push(
            <Col span={item.style.span || 6} key={key} style={{ display: item.hide ? (getFieldValue(item.hide[0].key) === item.hide[0].value ? 'none' : 'inline-block') : 'inline-block' }}>
              <FormItem {...{ ...formItemLayout, ...item.style.formItem }} label={item.title}>
                {getFieldDecorator(key, {
                  initialValue: item.defaultValue,
                  rules: item.rules,
                })(
                  <UniversalInput schema={item} />
                )}
              </FormItem>
            </Col>
          );
        }
      });
    return <Row gutter={8} >{children}</Row>;
  }
  add = (name) => {
    const { events } = this.state;
    const activeKey = `${this.newTabIndex}-${name}事件`;
    events.push({ title: activeKey, key: activeKey, type: name });
    this.setState({ events, activeKey });
    this.newTabIndex = this.newTabIndex + 1;
  }
  addPerson = (name) => {
    const { persons } = this.state;
    const personActiveKey = `${name}`;
    persons[0].key = persons[0].key.replace(` ${name}`, '');
    persons[0].title = persons[0].key.replace(` ${name}`, '');
    persons.push({ title: personActiveKey, key: personActiveKey });
    this.setState({ persons, personActiveKey });
  }
  remove = (targetKey) => {
    let { activeKey } = this.state;
    let lastIndex = 0;
    this.state.events.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const events = this.state.events.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = events[lastIndex].key;
    }
    this.setState({ events, activeKey });
  }
  removePeason = (targetKey) => {
    let { personActiveKey } = this.state;
    let lastIndex;
    this.state.persons.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const persons = this.state.persons.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && personActiveKey === targetKey) {
      personActiveKey = persons[lastIndex].key;
    }
    this.setState({ persons, personActiveKey });
  }
  handleFormChange = (index, changedFields) => {
    const newEvents = this.state.events.map((item, index2) => {
      if (index2 === index) {
        return { ...item, ...changedFields };
      }
      return item;
    });
    this.setState({
      events: newEvents,
    });
  }
  handleIDSubmit = (value) => {
    const { dispatch, form: { setFieldsValue } } = this.props;
    const { entry } = this.state;
    dispatch({
      type: 'entry/fetchPolicy',
      payload: {
        id: value,
      },
      callback: (res) => {
        if (res.length === 1) {
          message.success('获取成功,请核实申请书与系统的是否一致');
          const policy = res[0];
          this.setState({
            policyFromNet: res[0],
            policyValidate: `${date(policy.policyValidateFrom)}-${date(policy.policyValidateTo)}`,
            insurancePlanResponseList: res[0].insurancePlanResponseList,
          });
          setFieldsValue({
            policyId: policy.policyId,
            policyHolderName: policy.policyHolder.name,
            id: policy.insuredPerson.id,
            idType: policy.insuredPerson.idType.referenceCode,
            name: policy.insuredPerson.name,
            gender: policy.insuredPerson.gender.referenceCode,
            mobilePhone: policy.insuredPerson.mobilePhone,
            bankType: policy.insuredPerson.bankType.referenceCode,
            bankAccount: policy.insuredPerson.bankAccount,
          });
        }
      },
    });
  };
  render() {
    const { form, submitting = false } = this.props;
    const { persons, policyFromNet, policyValidate, insurancePlanResponseList } = this.state;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        // if (error) {
        // } else {
        //   // console.log(this.state.events);
        // }
      });
    };
    const AlertMessge = `${policyFromNet && policyFromNet.insuredPerson.name} 保单有效期:${policyValidate}`;

    const pageHeaderContent = (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Input.Search
          placeholder="请输入被保人身份证号码"
          enterButton="获取"
          size="large"
          defaultValue="410804198701160085"
          onSearch={this.handleIDSubmit}
          style={{ width: 422, height: 40 }}
        />
        {policyValidate && <Alert message={AlertMessge} type="success" style={{ margin: '0 10px' }} />}
        {policyValidate && <a>查看</a>}
      </div>
    );
    return (
      <PageHeaderLayout
        content={pageHeaderContent}
      >
        <Form>
          <Card className={styles.card} title="基本信息">
            {this.getInputForm(this.state.basicInfo)}
          </Card>
          <Card className={styles.card} title="事件信息">
            {this.getInputForm(this.state.basicEventInfo)}
            <Divider>收据信息</Divider>
            <Collapse defaultActiveKey={['1']}>
              <Panel header="收据1" key="1">
                <div>
                  {this.getInputForm(this.state.invoiceInfo)}
                </div>
                <div>
                  {getFieldDecorator('invoiceDetailList', {
                    initialValue: [{
                      key: '0',
                      费用类型: '',
                      费用名称: '',
                      数量: '1',
                      单价: '0',
                      金额: '0',
                      自付比例: '0',
                      自负金额: '0',
                      editable: true,
                      isNew: true,
                    }],
                  })(<InvoiceDetailTable />)}
                </div>
              </Panel>
            </Collapse>
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              onClick={() => {}}
              icon="plus"
            >
              新增收据
            </Button>
          </Card>
        </Form>
        <FooterToolbar>
          {document.body.clientWidth < 1440 && <Alert message="您使用的屏幕太小了,可能会影响录入,建议你窗口全屏" type="warning" style={{ margin: 10, display: 'inline-block', float: 'left' }} />}
          <Button
            onClick={() => {
              window.open('http://hic.leapstack.cn/gw/am/attachment/getclaimFileByCalimId?claimId=0000000180');
            }}
            loading={submitting}
          >
            增加事件
          </Button>
          <Button
            onClick={() => {
              window.open('http://hic.leapstack.cn/gw/am/attachment/getclaimFileByCalimId?claimId=0000000180');
            }}
            loading={submitting}
          >
            查看影像件
          </Button>
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
