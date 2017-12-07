import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';
import { parse } from 'qs';
import { connect } from 'dva';
import { Button, Menu, Dropdown, Icon, Row, Col, Steps, Card, Popover, Badge, Table, Divider, Spin, message } from 'antd';
import classNames from 'classnames';

import Zeren from './zeren';
import InvoiceModle from './invoiceDetail';
import { date } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './style.less';

const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

const getWindowWidth = () => (window.innerWidth || document.documentElement.clientWidth);

const menu = (
  <Menu>
    <Menu.Item key="1">删除案件</Menu.Item>
    <Menu.Item key="2">更改理赔人</Menu.Item>
    <Menu.Item key="3">导出预览</Menu.Item>
  </Menu>
);

const action = (
  <div>
    <ButtonGroup>
      <Button>发送消息</Button>
      <Button>复制链接</Button>
      <Button>影像件投影</Button>
      <Button>标记为问题件</Button>
      <Button>审核不通过</Button>
      <Button>刷新</Button>
      <Dropdown overlay={menu} placement="bottomRight">
        <Button><Icon type="ellipsis" /></Button>
      </Dropdown>
    </ButtonGroup>
    <Button type="primary">审核完毕</Button>
  </div>
);

const extra = ({ detail }) => {
  const {
    auditConclusion,
    eventResponseList,
  } = detail;
  const claimPay = eventResponseList.reduce((a, b) => {
    return (a || 0) + +b.claimPay;
  }, 0).toFixed(2);
  return (
    <Row>
      <Col xs={24} sm={12}>
        <div className={styles.textSecondary}>当前结论</div>
        <div className={styles.heading}>{auditConclusion.value}</div>
      </Col>
      <Col xs={24} sm={12}>
        <div className={styles.textSecondary}>申请金额</div>
        <div className={styles.heading}>
          ¥ {claimPay}
        </div>
        <div className={styles.textSecondary}>核定金额</div>
        <div className={styles.heading}>
          ¥ {claimPay}
        </div>
      </Col>
    </Row>
  );
};

const description = ({ detail, claimId }) => {
  const {
    companyId,
    accidentDate,
    firstDate,
    accidentProvince,
    accidentCity,
    accidentArea,
    accidentAddress,
    accidentInfo,
    accidentSubtype,
  } = detail;
  return (
    <div>
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="保险公司">{companyId.value}</Description>
        <Description term="赔案号"><a href="">{claimId}</a></Description>
        <Description term="被保人">{detail.insuredPerson.name}</Description>
        <Description term="申请人">{detail.reportPerson.name}</Description>
        <Description term="出险日期">{moment(accidentDate).format('YYYY年MM月DD日')}</Description>
        <Description term="初次就诊时间">{moment(firstDate).format('YYYY年MM月DD日')}</Description>
        <Description term="出险类型">{accidentSubtype.value}</Description>
        <Description term="出险地区">{accidentProvince && accidentProvince.value}{accidentCity && accidentCity.value}{accidentArea && accidentArea.value}</Description>
        <Description term="出险详细地址">{accidentAddress}</Description>
        <Description term="出险经过">{accidentInfo}</Description>
      </DescriptionList>
    </div>
  );
};
const desc1 = (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    <div>
      李文杰
      <Icon type="dingding-o" style={{ marginLeft: 8 }} />
    </div>
    <div>2016-12-12 12:32</div>
  </div>
);

const desc2 = (
  <div className={styles.stepDescription}>
    <div>
      理赔丁
      <Icon type="dingding-o" style={{ color: '#00A0E9', marginLeft: 8 }} />
    </div>
    <div><a href="">催一下</a></div>
  </div>
);

const popoverContent = (
  <div style={{ width: 160 }}>
    吴加号
    <span className={styles.textSecondary} style={{ float: 'right' }}>
      <Badge status="default" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>未响应</span>} />
    </span>
    <div className={styles.textSecondary} style={{ marginTop: 4 }}>耗时：2小时25分钟</div>
  </div>
);

const customDot = (dot, { status }) => (status === 'process' ?
  <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
    {dot}
  </Popover>
  : dot
);


@connect(state => ({
  claim: state.claim,
}))
export default class AdvancedProfile extends Component {
  state = {
    operationkey: 1,
    stepDirection: 'horizontal',
    loading: true,
    showDetailModle: false,
    currentInvoice: {},
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'claim/fetchAdvanced',
    });
    const payload = parse(location.hash.split('?')[1]);
    this.state = {
      operationkey: 1,
      stepDirection: 'horizontal',
      currentItem: payload,
      loading: true,
      showDetailModle: false,
      currentInvoice: {},
    };
    this.fetchDetail();
    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  fetchDetail() {
    const { dispatch } = this.props;
    const payload = parse(location.hash.split('?')[1]);
    dispatch({
      type: 'claim/fetchDetail',
      payload,
      callback: (claim) => {
        if (claim.insurancePlanList.length === 0) {
          message.error('此人数据异常, insurancePlanList为空');
          return;
        }
        this.setState({
          currentItem: claim,
          loading: false,
        });
        // 填坑
        if (claim.policyList.length) {
          if (claim.dutyList.length === 0) {
            this.setState({
              loading: true,
            });
            dispatch({
              type: 'claim/createDuty',
              payload: claim,
              callback: () => {
                this.fetchDetail();
              },
            });
          }
        } else {
          message.error('此人数据异常, 没有保单数据, 所以无法进行理赔汇总');
        }
      },
    });
  }
  render() {
    const { stepDirection, currentItem, loading } = this.state;
    const { dispatch } = this.props;
    if (loading) {
      return (
        <div className={styles.centerSpin}>
          <Spin size="large" tip="我在很努力的加载..." />
        </div>);
    }
    const { claimDataId, detail } = currentItem;
    const {
      eventResponseList,
      insuredPerson,
      reportPerson,
      applyPerson,
      benefitPersonList,
    } = detail;
    const eventList = eventResponseList.map((item, index) => {
      return {
        ...item,
        key: index + 1,
        tab: `${index + 1}-${item.coverageCode.value}`,
      };
    });
    const columns = [{
      title: '发票日期',
      dataIndex: 'billDate',
      key: 'billDate',
      render: text => <span>{moment(text).format('YYYY年MM月DD日')}</span>,
    }, {
      title: '收据类型',
      dataIndex: 'billType',
      key: 'billType',
      render: text => <span>{text.value}</span>,
    }, {
      title: '总金额',
      dataIndex: 'billAmt',
      key: 'billAmt',
      align: 'right',
    }, {
      title: '分类自负',
      dataIndex: 'classificationPayAmt',
      key: 'classificationPayAmt',
      align: 'right',
    }, {
      title: '自费支付',
      dataIndex: 'selfPayAmt',
      key: 'selfPayAmt',
      align: 'right',
    }, {
      title: '统筹支付',
      dataIndex: 'overallPayAmt',
      key: 'overallPayAmt',
      align: 'right',
    }, {
      title: '附加支付',
      dataIndex: 'accountPayAmt',
      key: 'accountPayAmt',
      align: 'right',
    }, {
      title: '第三方支付',
      dataIndex: 'thirdPayAmt',
      key: 'thirdPayAmt',
      align: 'right',
    }, {
      title: '现金支付',
      dataIndex: 'cashPayAmt',
      key: 'cashPayAmt',
      align: 'right',
    }, {
      title: '医保账户支付',
      dataIndex: 'attachPayAmt',
      key: 'attachPayAmt',
      align: 'right',
    }, {
      title: '操作',
      dataIndex: 'memo',
      key: 'memo',
      render: (text, record) => {
        return (
          <div>
            <a onClick={() => handleCheckInvoice(record)}>查看</a>
          </div>);
      },
    }];
    const handleCheckInvoice = (record) => {
      dispatch({
        type: 'claim/fetchInvoice',
        payload: record,
        callback: (data) => {
          this.setState({
            showDetailModle: true,
            currentInvoice: Object.assign({}, record, { list: data }),
          });
        },
      });
    };
    const contentList = () => {
      if (!this.state.operationkey) {
        return <div>加载中</div>;
      }
      const event = eventList.filter(item => +item.key === +this.state.operationkey)[0];
      const {
        hospitalName,
        illCode,
        inDate,
        outDate,
        inDays,
        mainDoctor,
        resOpinion,
        resReason,
        subIllCode,
        billCnt,
        claimPay,
        payType,
      } = event;
      return (
        <div>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="医院名称">{hospitalName}</Description>
            <Description term="主要疾病">{illCode}</Description>
            <Description term="次要疾病">{subIllCode.join(',')}</Description>
            <Description term="入院日期">{date(inDate)}</Description>
            <Description term="出院日期">{date(outDate)}</Description>
            <Description term="住院天数">{inDays}天</Description>
            <Description term="主治医生">{mainDoctor}</Description>
            <Description term="收据总数">18112345678</Description>
            <Description term="费用类型">{payType.value}</Description>
            <Description term="收据数量">{billCnt}</Description>
          </DescriptionList>
          <Table
            pagination={false}
            dataSource={event.invoiceResponseList}
            columns={columns}
            rowKey="invoiceDataId"
          />
          <DescriptionList style={{ marginBottom: 24, marginTop: 24 }}>
            <Description term="赔付金额">{claimPay}</Description>
            <Description term="审核结论">{resOpinion}</Description>
            <Description term="结论原因">{resReason}</Description>
          </DescriptionList>
        </div>);
    };
    const nameInfo = (person, title) => {
      const {
        name,
        address,
        bankAccount,
        bankBranch,
        bankSubbranch,
        bankType,
        birthday,
        email,
        gender,
        id,
        idType,
        idValidateFrom,
        idValidateTo,
        job,
        mobilePhone,
        organization,
        payType,
        relationship,
        telephone,
        type,
        zip,
      } = person;
      return (
        <DescriptionList style={{ marginBottom: 24 }} title={title}>
          <Description term="与被保人关系">{relationship && relationship.value}</Description>
          <Description term="姓名">{name}</Description>
          <Description term="证件类型">{idType.value}</Description>
          <Description term="证件号码">{id}</Description>
          <Description term="证件有效期">{date(idValidateFrom)}至{date(idValidateTo)}</Description>
          <Description term="手机号">{mobilePhone}</Description>
          <Description term="联系号码">{telephone}</Description>
          <Description term="人员性质">{type && type.value}</Description>
          <Description term="单位">{organization}</Description>
          <Description term="工作">{job}</Description>
          <Description term="生日">{date(birthday)}</Description>
          <Description term="邮箱">{email}</Description>
          <Description term="性别">{gender.value}</Description>
          <Description term="地址">{address}</Description>
          <Description term="邮编">{zip}</Description>
          <Description term="付款方式">{payType ? payType.value : '无'}</Description>
          <Description term="银行">{bankType && bankType.value}{bankBranch && bankBranch.value}{bankSubbranch && bankSubbranch.value}</Description>
          <Description term="银行账号">{bankAccount}</Description>
        </DescriptionList>
      );
    };
    const OtherPerson = () => {
      if (insuredPerson.id !== applyPerson.id
        && reportPerson.id === applyPerson.id
        && applyPerson.id === benefitPersonList[0].id) {
        return nameInfo(reportPerson, '报案人-申请人-领款人');
      } else {
        return (
          <div>
            {reportPerson.id !== insuredPerson.id ? nameInfo(reportPerson, '报案人') : '报案人 同 被保人'}
            <Divider style={{ margin: '16px 0' }} />
            {applyPerson.id !== insuredPerson.id ? nameInfo(applyPerson, '申请人') : '申请人 同 被保人'}
            <Divider style={{ margin: '16px 0' }} />
            {benefitPersonList[0].id !== insuredPerson.id ? nameInfo(benefitPersonList[0], '领款人') : '领款人 同 被保人'}
          </div>);
      }
    };
    return (
      <PageHeaderLayout
        title={`编号：${claimDataId}`}
        action={action}
        content={description(currentItem)}
        extraContent={extra(currentItem)}
      >
        <Card
          title="事件信息"
          className={styles.tabsCard}
          bordered={false}
          tabList={eventList}
          onTabChange={this.onOperationTabChange}
        >
          {contentList()}
        </Card>
        <Card title="理赔汇总" style={{ marginBottom: 24 }} bordered={false}>
          <Zeren item={currentItem} />
        </Card>
        <Card title="人员信息" style={{ marginBottom: 24 }} bordered={false}>
          {nameInfo(insuredPerson, '被保人')}
          <Card type="inner" title="其他人员">
            {OtherPerson()}
          </Card>
        </Card>
        <Card title="被保人历史理赔记录" style={{ marginBottom: 24 }} bordered={false}>
          <div className={styles.noData}>
            <Icon type="frown-o" />暂无数据(未开发)
          </div>
        </Card>
        <Card title="流程进度" style={{ marginBottom: 24 }} bordered={false}>
          <Steps direction={stepDirection} progressDot={customDot} current={5}>
            <Step title="创建" description={desc1} />
            <Step title="扫描" description={desc1} />
            <Step title="预审" description={desc1} />
            <Step title="录入" description={desc1} />
            <Step title="质检" description={desc1} />
            <Step title="审核" description={desc2} />
            <Step title="导出" />
            <Step title="完成" />
          </Steps>
        </Card>
        {this.state.showDetailModle &&
          <InvoiceModle
            title="收据清单"
            visible={this.state.showDetailModle}
            item={this.state.currentItem}
            list={this.state.currentInvoice}
            onCancel={() => {
              this.setState({
                showDetailModle: false,
              });
           }}
          />}
      </PageHeaderLayout>
    );
  }
}
