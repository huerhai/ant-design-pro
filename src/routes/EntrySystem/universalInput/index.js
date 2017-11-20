/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Radio, DatePicker, Cascader, InputNumber, Tabs, Icon, Button, Dropdown, Menu, message } from 'antd';
import FooterToolbar from '../../../components/FooterToolbar';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import UniversalInput from '../../../components/UniversalInput';
import UniversalForm from '../../../components/UniversalForm';


import city from './city';
import styles from './index.less';

import { claim as claimSchema, event as eventSchema } from './claim';

const { TabPane } = Tabs;

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  group: state.group,
}))
@Form.create()
export default class UniversalClaim extends PureComponent {
  constructor(props) {
    super(props);
    this.newTabIndex = 1;
    const events = [
      { title: '事件1',
        key: '事件1',
      },
    ];
    this.state = {
      activeKey: events[0].key,
      events,
      claimSchema,
      eventSchema,
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
  getInputForm(data) {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const children = [];
    Object.keys(data.properties)
      .sort((a, b) => data.properties[a].order - data.properties[b].order)
      .forEach((key) => {
        const item = data.properties[key];
        children.push(
          <Col span={8} key={key}>
            <FormItem {...formItemLayout} label={item.title}>
              {getFieldDecorator(key, {
                initialValue: item.defaultValue,
                rules: item.rules,
              })(
                <UniversalInput schema={item} />
              )}
            </FormItem>
          </Col>
        );
      });
    return <Row gutter={40}>{children}</Row>;
  }
  add = () => {
    const { events } = this.state;
    const activeKey = `事件${this.newTabIndex + 1}`;
    events.push({ title: activeKey, key: activeKey });
    this.setState({ events, activeKey });
    this.newTabIndex = this.newTabIndex + 1;
  }
  remove = (targetKey) => {
    let { activeKey } = this.state;
    let lastIndex;
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
  render() {
    const { form, submitting = false } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          console.log(this.state.events);
        }
      });
    };
    return (
      <PageHeaderLayout title="数据录入">
        <Form>
          <Card className={styles.card} bordered={false}>
            {this.getInputForm(this.state.claimSchema)}
          </Card>
          <Card className={styles.card} bordered={false} style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <Button onClick={this.add}>添加事件</Button>
            </div>
            <Tabs
              hideAdd
              onChange={this.onChange}
              activeKey={this.state.activeKey}
              type="editable-card"
              onEdit={this.onEdit}
            >
              {this.state.events.map((pane, index) => {
                return (
                  <TabPane tab={pane.title} key={pane.key}>
                    <Card className={styles.card} bordered={false}>
                      <UniversalForm
                        schema={this.state.eventSchema}
                        {...this.state.events[index]}
                        onChange={this.handleFormChange.bind(this, index)}
                      />
                    </Card>
                  </TabPane>);
              })}
            </Tabs>
          </Card>
        </Form>
        <FooterToolbar>
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
