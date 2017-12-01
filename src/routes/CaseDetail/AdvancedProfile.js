import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';
import { parse } from 'qs';
import { connect } from 'dva';
import { Button, Menu, Dropdown, Icon, Row, Col, Steps, Card, Popover, Badge, Table, Tooltip, Divider, Spin } from 'antd';
import classNames from 'classnames';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './AdvancedProfile.less';

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
      <Button>影像件投影</Button>
      <Button>标记为问题件</Button>
      <Button>审核不通过</Button>
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
    <DescriptionList className={styles.headerList} size="small" col="2">
      <Description term="保险公司">{companyId.value}</Description>
      <Description term="赔案号"><a href="">{claimId}</a></Description>
      <Description term="被保人">{detail.insuredPerson.name}</Description>
      <Description term="申请人">{detail.reportPerson.name}</Description>
      <Description term="出险日期">{moment(accidentDate).format('YYYY年MM月DD日')}</Description>
      <Description term="初次就诊时间">{moment(firstDate).format('YYYY年MM月DD日')}</Description>
      <Description term="出险类型">{accidentSubtype.value}</Description>
      <Description term="出险地区">{accidentProvince.value}{accidentCity.value}{accidentArea.value}</Description>
      <Description term="出险详细地址">{accidentAddress}</Description>
      <Description term="出险经过">{accidentInfo}</Description>
    </DescriptionList>
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

const operationTabList = [{
  key: 'tab1',
  tab: '住院事件一',
}, {
  key: 'tab2',
  tab: '住院事件二',
}, {
  key: 'tab3',
  tab: '住院事件三',
}];

const columns = [{
  title: '发票日期',
  dataIndex: 'type',
  key: 'type',
}, {
  title: '收据类型',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '总金额',
  dataIndex: 'status',
  key: 'status',
  render: text => (
    text === 'agree' ? <Badge status="success" text="成功" /> : <Badge status="error" text="驳回" />
  ),
}, {
  title: '分类自负金额',
  dataIndex: 'updatedAt',
  key: 'updatedAt',
}, {
  title: '自费支付金额',
  dataIndex: 'updatedAt',
  key: 'updatedAt',
}, {
  title: '分类自负金额',
  dataIndex: 'updatedAt',
  key: 'updatedAt',
}, {
  title: '统筹支付金额',
  dataIndex: 'updatedAt',
  key: 'updatedAt',
}, {
  title: '附加支付金额',
  dataIndex: 'updatedAt',
  key: 'updatedAt',
}, {
  title: '第三方支付金额',
  dataIndex: 'updatedAt',
  key: 'updatedAt',
}, {
  title: '现金支付金额',
  dataIndex: 'updatedAt',
  key: 'updatedAt',
}, {
  title: '医保账户支付金额',
  dataIndex: 'updatedAt',
  key: 'updatedAt',
}, {
  title: '操作',
  dataIndex: 'memo',
  key: 'memo',
}];

@connect(state => ({
  claim: state.claim,
}))
export default class AdvancedProfile extends Component {
  state = {
    operationkey: 'tab1',
    stepDirection: 'horizontal',
    loading: true,
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'claim/fetchAdvanced',
    });
    const payload = parse(location.hash.split('?')[1]);
    this.state = {
      operationkey: 'tab1',
      stepDirection: 'horizontal',
      currentItem: payload,
      loading: true,
    };
    dispatch({
      type: 'claim/fetchDetail',
      payload,
      callback: (claim) => {
        this.setState({
          currentItem: claim,
          loading: false,
        });
      },
    });
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

  render() {
    const { stepDirection, currentItem, loading } = this.state;
    const { claim } = this.props;
    const { advancedLoading, advancedOperation1, advancedOperation2, advancedOperation3 } = claim;
    const contentList = {
      tab1: (
        <div>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="入院日期">付小小</Description>
            <Description term="出院日期">32943898021309809423</Description>
            <Description term="住院天数">3321944288191034921</Description>
            <Description term="收据总数">18112345678</Description>
            <Description term="就诊日期">3213</Description>
            <Description term="费用类别">3213</Description>
            <Description term="就诊医院">3213</Description>
            <Description term="主要诊断">3213</Description>
            <Description term="次要诊断">321</Description>
          </DescriptionList>
          <Table
            pagination={false}
            loading={advancedLoading}
            dataSource={advancedOperation1}
            columns={columns}
          />
        </div>),
      tab2: <Table
        pagination={false}
        loading={advancedLoading}
        dataSource={advancedOperation2}
        columns={columns}
      />,
      tab3: <Table
        pagination={false}
        loading={advancedLoading}
        dataSource={advancedOperation3}
        columns={columns}
      />,
    };
    if (loading) {
      return (
        <div className={styles.centerSpin}>
          <Spin size="large" tip="我在很努力的加载..." />
        </div>);
    }
    const { claimDataId } = currentItem;
    return (
      <PageHeaderLayout
        title={`编号：${claimDataId}`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        action={action}
        content={description(currentItem)}
        extraContent={extra(currentItem)}
      >
        <Card
          title="事件信息"
          className={styles.tabsCard}
          bordered={false}
          tabList={operationTabList}
          onTabChange={this.onOperationTabChange}
        >
          {contentList[this.state.operationkey]}
        </Card>
        <Card title="保单信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="用户姓名">付小小</Description>
            <Description term="会员卡号">32943898021309809423</Description>
            <Description term="身份证">3321944288191034921</Description>
            <Description term="联系方式">18112345678</Description>
            <Description term="联系地址">曲丽丽 18100000000 浙江省杭州市西湖区黄姑山路工专路交叉路口</Description>
          </DescriptionList>
          <DescriptionList style={{ marginBottom: 24 }} title="信息组">
            <Description term="某某数据">725</Description>
            <Description term="该数据更新时间">2017-08-08</Description>
            <Description>&nbsp;</Description>
            <Description term={
              <span>
                某某数据
                <Tooltip title="数据说明">
                  <Icon style={{ color: 'rgba(0, 0, 0, 0.43)', marginLeft: 4 }} type="info-circle-o" />
                </Tooltip>
              </span>
              }
            >
              725
            </Description>
            <Description term="该数据更新时间">2017-08-08</Description>
          </DescriptionList>
          <h4 style={{ marginBottom: 16 }}>信息组</h4>
          <Card type="inner" title="多层级信息组">
            <DescriptionList size="small" style={{ marginBottom: 16 }} title="组名称">
              <Description term="负责人">林东东</Description>
              <Description term="角色码">1234567</Description>
              <Description term="所属部门">XX公司 - YY部</Description>
              <Description term="过期时间">2017-08-08</Description>
              <Description term="描述">这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...</Description>
            </DescriptionList>
            <Divider style={{ margin: '16px 0' }} />
            <DescriptionList size="small" style={{ marginBottom: 16 }} title="组名称" col="1">
              <Description term="学名">
                Citrullus lanatus (Thunb.) Matsum. et Nakai一年生蔓生藤本；茎、枝粗壮，具明显的棱。卷须较粗..
              </Description>
            </DescriptionList>
            <Divider style={{ margin: '16px 0' }} />
            <DescriptionList size="small" title="组名称">
              <Description term="负责人">付小小</Description>
              <Description term="角色码">1234568</Description>
            </DescriptionList>
          </Card>
        </Card>
        <Card title="被保人历史理赔记录" style={{ marginBottom: 24 }} bordered={false}>
          <div className={styles.noData}>
            <Icon type="frown-o" />暂无数据
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
      </PageHeaderLayout>
    );
  }
}
