import {
  ArrowLeft,
  BellRing,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  FileCheck2,
  FolderUp,
  MailCheck,
  MessageSquareText,
  MonitorCheck,
  PlayCircle,
  Radio,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  UploadCloud,
  UsersRound,
} from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const contracts = [
  {
    id: "qdii",
    name: "华泰荣泰全球精选1号QDII集合资产管理计划资产管理合同",
    source: "proposal.doc",
    summary: "7 项特殊义务已归入一次性、周期性、事件触发三类",
  },
  {
    id: "yintai-guangyuan-6",
    name: "华泰银泰精选广元6号集合资产管理计划合同",
    source: "huatai-yintai-guangyuan-6-contract.docx",
    summary: "已接入 Word 版合同，支持特殊义务识别和履约提醒切换查看",
  },
];

const upcomingContractItems = [
  {
    item: "T+1 估值表发送",
    contract: "QDII集合资产管理计划合同",
    date: "2026-07-03",
  },
  {
    item: "月度持仓对账单",
    contract: "华泰银泰精选广元6号合同",
    date: "2026-07-07",
  },
  {
    item: "季度对账单归档",
    contract: "QDII集合资产管理计划合同",
    date: "2026-07-08",
  },
];

type ContractObligationSet = {
  oneTime: Array<{ title: string; text: string; doneAt: string }>;
  periodic: Array<{ title: string; cadence: string; next: string; text: string }>;
  event: Array<{ id: string; title: string; trigger: string; action: string; proof: string; text: string }>;
};

const contractObligations: Record<string, ContractObligationSet> = {
  qdii: {
    oneTime: [
      {
        title: "电子签约与指定账户校验",
        text: "核验电子签名约定书、参与账户和红利、退出、清算收款账户，确保款项回原账户或同名账户。",
        doneAt: "已完成 · 2026-07-01",
      },
      {
        title: "QDII 境外估值价格源登记",
        text: "登记境外债券主要做市商、彭博终端等价格来源，支持境外资产按合同约定估值。",
        doneAt: "已登记 · 估值上线前",
      },
    ],
    periodic: [
      {
        title: "开放日参与退出受理",
        cadence: "每周一/三/五",
        next: "下一次：本周五开放窗口",
        text: "按合同约定办理参与、退出业务，网站披露时同步电话、邮件或其他及时通知方式。",
      },
      {
        title: "份额净值披露",
        cadence: "T+2",
        next: "下一次：估值日后2日内",
        text: "披露 T 日各类份额净值和累计份额净值，并经托管人复核。",
      },
      {
        title: "季度对账单",
        cadence: "每季度",
        next: "下一次：季末后生成",
        text: "通过网站或交易客户端提供持有份额、净值、参与退出明细及收益分配情况。",
      },
    ],
    event: [
      {
        id: "qdii-warning-line",
        title: "预警线触及通知",
        trigger: "累计份额净值触及 0.95",
        action: "T+2 起邮件、电话或书面方式提示投资者风险",
        proof: "留存净值触发记录、投资者通知和风险提示底稿",
        text: "合同约定累计份额净值触及预警线时，管理人应向投资者提示风险。",
      },
      {
        id: "qdii-manager-change",
        title: "投资经理变更披露",
        trigger: "薛雅婧、徐琦、唐雨潇任一投资经理变更",
        action: "变更决定日起 5 日内网站通告并报送协会",
        proof: "留存通告页面、协会报送记录和内部审批意见",
        text: "QDII 合同列明三名投资经理，人员变化需要触发披露和报送。",
      },
      {
        id: "qdii-major-related",
        title: "重大关联交易征询",
        trigger: "拟开展重大关联交易",
        action: "公告征询投资者意见，并同步电话、邮件等及时通知方式",
        proof: "归档征询公告、投资者反馈和交易审批材料",
        text: "重大关联交易须事先取得投资者同意，事后告知投资者和托管人并报告派出机构。",
      },
    ],
  },
  "yintai-guangyuan-6": {
    oneTime: [
      {
        title: "中行托管与合同版本核对",
        text: "核对托管人为中国银行北京市分行、合同编号及法代更新后的签署版本。",
        doneAt: "已核对 · 2026-07-03",
      },
      {
        title: "受益所有人和反洗钱资料留存",
        text: "按托管人要求留存产品及受益所有人信息、身份证明文件和尽调资料。",
        doneAt: "待补齐 · 开户前",
      },
    ],
    periodic: [
      {
        title: "开放日参与退出受理",
        cadence: "每周一/三/四",
        next: "下一次：本周四开放窗口",
        text: "按合同约定开放参与和退出，未确认参与资金须在 10 个工作日内退还。",
      },
      {
        title: "份额净值披露",
        cadence: "T+2",
        next: "下一次：估值日后2日内",
        text: "管理人 T+2 内披露 T 日份额净值和累计份额净值，托管人复核后发布。",
      },
      {
        title: "季度报告与对账单",
        cadence: "每季度",
        next: "下一次：季度结束后1个月内",
        text: "披露季度报告，并向投资者提供份额数量、净值、参与退出和收益分配对账信息。",
      },
    ],
    event: [
      {
        id: "yintai-major-related",
        title: "重大关联交易邮件征询",
        trigger: "拟开展重大关联交易",
        action: "提前以邮件方式征询投资者意见，未明确同意视为不同意",
        proof: "留存邮件、回复记录和关联交易审批链路",
        text: "广元6号合同明确重大关联交易采用邮件征询，并要求预留合理回复期限。",
      },
      {
        id: "yintai-manager-change",
        title: "单一投资经理变更披露",
        trigger: "薛雅婧发生投资经理变更",
        action: "变更决定日起 5 日内网站公告并报送协会",
        proof: "留存网站公告、协会报送记录和内部任免文件",
        text: "广元6号合同只列明薛雅婧一名投资经理，人员变更提示范围更聚焦。",
      },
      {
        id: "yintai-contract-change",
        title: "合同变更征询",
        trigger: "合同变更不涉及重大投资或费率事项",
        action: "网站公告及邮件发送征询意见，未回复视为同意",
        proof: "归档公告、邮件、反馈清单和协会备案记录",
        text: "投资者不同意变更可申请退出，逾期未退出的可统一强制退出。",
      },
    ],
  },
};

const deliveryOutputs = [
  {
    output: "责任对象建议",
    description: "建议由人力资源部牵头，战略发展部、合规稽核部协同更新内部制度和考核口径。",
    status: "4 个对象",
  },
  {
    output: "制度重点条款清单",
    description: "第十三条、第十六条和第二十一条被标记为高关注条款，需映射至绩效考核、薪酬递延和问责制度。",
    status: "12 条",
  },
  {
    output: "点对点触达",
    description: "生成面向管理层、人力资源部、战略发展部的定向推送，并同步代办事项落实时间。",
    status: "待发送",
  },
  {
    output: "AI智能测试",
    description: "自动生成 8 道测试题，覆盖主动权益基金经理考核权重、薪酬递延和制度修订责任。",
    status: "已生成",
  },
  {
    output: "触达台账",
    description: "记录推送对象、阅读状态、反馈意见和二次提醒结果，支持按部门筛选导出。",
    status: "实时更新",
  },
];

const pointToPointItems = [
  { target: "代办事项建议和定向推送", action: "代办事项 3 项", time: "落实时间 2026-07-10" },
  { target: "公司管理层", action: "薪酬组织架构调整建议", time: "落实时间 2026-07-12" },
  { target: "人力资源部", action: "2025年投资人员绩效考核体系调整建议", time: "落实时间 2026-07-15" },
  { target: "战略发展部", action: "公司章程调整建议", time: "落实时间 2026-07-18" },
];

function App() {
  const [route, setRoute] = useState(() => window.location.hash || "#/");

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route === "#/employee-alert" ? <EmployeeAlertDetail /> : <Dashboard />;
}

function Dashboard() {
  return (
    <main className="app-shell">
      <section className="dashboard-grid" aria-label="智能管理看板">
        <EmployeeBoard />
        <ContractBoard />
        <PolicyBoard />
      </section>
    </main>
  );
}

function EmployeeBoard() {
  const [openDetail, setOpenDetail] = useState<"actions" | "leave" | null>(null);

  return (
    <section className="board board-employee">
      <BoardHeader icon={<UsersRound size={22} />} label="员工管理看板" status="实时监控" tone="red" />

      <div className="metric-grid">
        <Metric value="201" label="今日交手机人数" icon={<Smartphone size={18} />} />
        <Metric value="33" label="请假及出差人数" icon={<CalendarClock size={18} />} />
        <Metric value="173" label="实际到岗人数" icon={<MonitorCheck size={18} />} />
      </div>

      <button className="alert-strip" onClick={() => (window.location.hash = "#/employee-alert")}>
        <span className="alert-icon">
          <ShieldAlert size={20} />
        </span>
        <span>
          <strong>请假人员工位出现</strong>
          <small>员工：林泽宇 · 10:42 被 3F 摄像头识别</small>
        </span>
        <ChevronRight size={18} />
      </button>

      <div className="camera-card">
        <div className="card-heading">
          <span>AI 行为识别截图</span>
          <span className="risk-pill">疑似玩手机 92%</span>
        </div>
        <div className="camera-frame">
          <img src={asset("1.jpg")} alt="AI 监控疑似玩手机截图" />
          <div className="phone-box">
            <span>手部动作</span>
          </div>
          <div className="scan-line" />
        </div>
      </div>

      <div className="compact-list">
        <StatusRow label="摄像头覆盖工位" value="96.8%" />
        <StatusRow
          label="异常动作复核队列"
          value="4 条"
          danger
          expanded={openDetail === "actions"}
          onClick={() => setOpenDetail(openDetail === "actions" ? null : "actions")}
        />
        {openDetail === "actions" ? (
          <DetailList
            items={[
              "15:36 3F 东区工位疑似玩手机，待合规稽核部复核",
              "14:12 2F 会议区长时间离席，待主管确认",
              "11:05 5F 工位遮挡摄像头，已推送现场核验",
              "09:48 4F 茶水间聚集超时，待行政复核",
            ]}
          />
        ) : null}
        <StatusRow
          label="请假在岗交叉比对"
          value="1 人命中"
          danger
          expanded={openDetail === "leave"}
          onClick={() => setOpenDetail(openDetail === "leave" ? null : "leave")}
        />
        {openDetail === "leave" ? (
          <DetailList items={["林泽宇 · 全天事假 · 10:42 识别在 3F 东区本人办公工位"]} />
        ) : null}
      </div>
    </section>
  );
}

function ContractBoard() {
  const [uploaded, setUploaded] = useState(false);
  const [activeContractId, setActiveContractId] = useState(contracts[0].id);
  const [query, setQuery] = useState("");

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setUploaded(true);
      setActiveContractId(contracts[1].id);
    }
  };

  return (
    <section className="board board-contract">
      <BoardHeader icon={<BriefcaseBusiness size={22} />} label="合同管理看板" status="特殊义务分类监控" tone="amber" />

      <section className="expiry-panel">
        <div className="card-heading">
          <span>近期到期事项</span>
          <span className="neutral-pill">未来 7 天</span>
        </div>
        <div className="expiry-table">
          <div className="expiry-head">
            <span>具体事项</span>
            <span>涉及合同（多样性）</span>
            <span>到期日期</span>
          </div>
          {upcomingContractItems.map((row) => (
            <article key={`${row.item}-${row.date}`}>
              <strong>{row.item}</strong>
              <span>{row.contract}</span>
              <time>{row.date}</time>
            </article>
          ))}
        </div>
      </section>

      <div className="contract-tools">
        <label className="upload-card">
          <span className="upload-icon">
            <UploadCloud size={22} />
          </span>
          <span>
            <strong>{uploaded ? "合同已接收，更新识别中" : "上传合同识别义务"}</strong>
            <small>doc / docx / pdf 自动入履约日历</small>
          </span>
          <input type="file" accept=".doc,.docx,.pdf" onChange={onFileChange} />
        </label>

        <label className="contract-search">
          <Search size={19} />
          <span>
            <strong>搜索合同与义务</strong>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="输入合同、事项、日期"
            />
          </span>
        </label>
      </div>

      <div className="contract-switcher" aria-label="合同切换">
        {contracts.map((contract) => (
          <button
            key={contract.id}
            className={contract.id === activeContractId ? "active" : ""}
            type="button"
            onClick={() => setActiveContractId(contract.id)}
          >
            {contract.name}
          </button>
        ))}
      </div>

      <ContractObligations activeContractId={activeContractId} />
    </section>
  );
}

function ContractObligations({ activeContractId }: { activeContractId: string }) {
  const obligations = contractObligations[activeContractId] ?? contractObligations.qdii;
  const [activeEventId, setActiveEventId] = useState(obligations.event[0].id);
  const [launchedEventIds, setLaunchedEventIds] = useState<string[]>([]);
  const activeEvent = obligations.event.find((item) => item.id === activeEventId) ?? obligations.event[0];
  const eventGridClassName = ["event-grid", obligations.event.length === 3 ? "event-grid-trio" : ""]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    setActiveEventId(obligations.event[0].id);
    setLaunchedEventIds([]);
  }, [activeContractId, obligations.event]);

  const launchEventFlow = (eventId: string) => {
    setActiveEventId(eventId);
    setLaunchedEventIds((current) => (current.includes(eventId) ? current : [...current, eventId]));
  };

  return (
    <div className="contract-obligation-suite">
      <section className="obligation-category category-complete">
        <div className="category-head">
          <span>01</span>
          <div>
            <h3>一次性任务</h3>
            <p>完成后自动归档，后续流程不再重复提示。</p>
          </div>
        </div>
        <div className="completion-grid">
          {obligations.oneTime.map((item) => (
            <article key={item.title} className="completion-card">
              <CheckCircle2 size={18} />
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
              <aside className="task-status-ticket complete">
                <span>{item.doneAt.split(" · ")[0]}</span>
                <strong>{item.doneAt.split(" · ")[1]}</strong>
              </aside>
            </article>
          ))}
        </div>
      </section>

      <section className="obligation-category category-periodic">
        <div className="category-head">
          <span>02</span>
          <div>
            <h3>周期性任务</h3>
            <p>按日历、工作日和合同约定自动生成提醒。</p>
          </div>
        </div>
        <div className="periodic-timeline">
          {obligations.periodic.map((item) => {
            const [nextLabel, ...nextValueParts] = item.next.split("：");
            const nextValue = nextValueParts.length > 0 ? nextValueParts.join("：") : item.next;

            return (
              <article key={item.title} className="periodic-card">
                <div className="periodic-copy">
                  <div className="periodic-title-line">
                    <span className="periodic-frequency">
                      <small>周期</small>
                      {item.cadence}
                    </span>
                    <strong>{item.title}</strong>
                  </div>
                  <p>{item.text}</p>
                </div>
                <aside className="task-status-ticket due">
                  <span>{nextValueParts.length > 0 ? nextLabel : "提醒"}</span>
                  <strong>{nextValue}</strong>
                </aside>
              </article>
            );
          })}
        </div>
      </section>

      <section className="obligation-category category-event">
        <div className="category-head">
          <span>03</span>
          <div>
            <h3>事件触发型任务</h3>
            <p>业务流程启动时弹出前置提示，防止漏做。</p>
          </div>
        </div>
        <div className={eventGridClassName}>
          {obligations.event.map((item) => {
            const launched = launchedEventIds.includes(item.id);
            const className = [
              "event-card",
              item.id === activeEventId ? "active" : "",
              launched ? "launched" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <article key={item.id} className={className}>
                <BellRing size={17} />
                <strong>{item.title}</strong>
                <small>{item.trigger}</small>
                <p>{item.text}</p>
                <button type="button" onClick={() => launchEventFlow(item.id)}>
                  {launched ? <CheckCircle2 size={15} /> : <PlayCircle size={14} />}
                  {launched ? "已启动" : "启动流程"}
                </button>
              </article>
            );
          })}
        </div>
        <div className="event-prompt-panel" aria-live="polite">
          <div className="event-prompt-head">
            <span>
              <CircleAlert size={18} />
              流程启动提示
            </span>
            <strong>{activeEvent.title}</strong>
          </div>
          <div className="event-prompt-grid">
            <article>
              <small>触发流程</small>
              <strong>{activeEvent.trigger}</strong>
            </article>
            <article>
              <small>必须动作</small>
              <strong>{activeEvent.action}</strong>
            </article>
            <article>
              <small>留痕要求</small>
              <strong>{activeEvent.proof}</strong>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

function PolicyBoard() {
  return (
    <section className="board board-policy">
      <BoardHeader icon={<ShieldCheck size={22} />} label="制度法规管理看板" status="新规解读与触达到人" tone="green" />

      <div className="policy-docs">
        <a href={asset("基金管理公司绩效考核管理指引.pdf")} target="_blank" rel="noreferrer">
          <FileCheck2 size={20} />
          <span>制度原文</span>
        </a>
        <a href={asset("基金管理公司绩效考核管理指引核心要点解读.pdf")} target="_blank" rel="noreferrer">
          <MessageSquareText size={20} />
          <span>核心要点解读</span>
        </a>
      </div>

      <NewRuleExpress />
      <PolicyDelivery />
    </section>
  );
}

function NewRuleExpress() {
  return (
    <section className="policy-output-block rule-express-card">
      <div className="policy-panel-head">
        <div>
          <h3>新规速达</h3>
          <p>收文后自动拆解条款、识别风险并提示需修订制度。</p>
        </div>
        <span>处理中</span>
      </div>

      <div className="rule-command-layout">
        <article className="rule-primary-metric">
          <strong>重点条款</strong>
          <span>12</span>
          <small>条款已进入制度映射队列</small>
        </article>
        <div className="rule-secondary-stack">
          <article>
            <strong>高风险等级</strong>
            <span>4 项</span>
          </article>
          <article>
            <strong>需修订制度</strong>
            <span>3 份</span>
          </article>
        </div>
      </div>

      <div className="rule-document-strip">
        <span>本次收文</span>
        <strong>《基金管理公司绩效考核管理指引》</strong>
        <em>已解析 42 条条款</em>
      </div>
    </section>
  );
}

function PolicyDelivery() {
  const [pushed, setPushed] = useState(false);
  const [activeOutput, setActiveOutput] = useState(deliveryOutputs[0].output);
  const activeDelivery = deliveryOutputs.find((row) => row.output === activeOutput) ?? deliveryOutputs[0];

  return (
    <section className="policy-output-block delivery-block policy-delivery-card">
      <div className="policy-panel-head">
        <div>
          <h3>制度到人</h3>
          <p>自动判断应触达的条线、部门、岗位和人员，形成推送、反馈、台账闭环。</p>
        </div>
        <span>{pushed ? "已推送 · 覆盖率 91%" : "待推送 · 覆盖率 91%"}</span>
      </div>

      <div className="delivery-workbench">
        <div className="delivery-tabs">
          {deliveryOutputs.map((row, index) => (
            <button
              key={row.output}
              className={[activeOutput === row.output ? "active" : "", pushed || index < 2 ? "ready" : ""]
                .filter(Boolean)
                .join(" ")}
              type="button"
              onClick={() => setActiveOutput(row.output)}
            >
              <em>{String(index + 1).padStart(2, "0")}</em>
              <strong>{row.output}</strong>
              <span>{pushed && index === 2 ? "已推送" : row.status}</span>
            </button>
          ))}
        </div>

        <div className="delivery-detail-panel">
          <small>当前内容</small>
          <strong>{activeDelivery.output}</strong>
          <p>{activeDelivery.description}</p>
          {activeDelivery.output === "点对点触达" ? (
            <div className="touch-list">
              {pointToPointItems.map((item) => (
                <article key={item.target}>
                  <strong>{item.target}</strong>
                  <span>{item.action}</span>
                  <em>{item.time}</em>
                </article>
              ))}
            </div>
          ) : null}
          {activeDelivery.output === "AI智能测试" ? (
            <div className="qa-card">
              <strong>24小时全天候即时问答</strong>
              <p>问：对固收公募基金经理的业绩指标权重也要求不低于80%吗</p>
              <p>答：根据指引第十三条第一款规定，仅对主动权益类基金经理有如上要求</p>
            </div>
          ) : null}
        </div>
      </div>

      <button className={pushed ? "delivery-action pushed" : "delivery-action"} type="button" onClick={() => setPushed(true)}>
        {pushed ? <CheckCircle2 size={16} /> : <Send size={16} />}
        {pushed ? "推送任务已发送" : "推送到责任对象"}
      </button>

      <div className="delivery-targets">
        <article>
          <strong>机构业务部</strong>
          <span>36 人 · 31 已读</span>
          <p>张明超 7 天未阅读，已生成二次提醒待办。</p>
        </article>
        <article>
          <strong>渠道业务部</strong>
          <span>42 人 · 37 已读</span>
          <p>王珂超 7 天未阅读，待部门负责人确认。</p>
        </article>
        <article>
          <strong>合规稽核部</strong>
          <span>18 人 · 全部已读</span>
          <p>可查看提示覆盖台账和处理反馈。</p>
        </article>
      </div>
    </section>
  );
}

function EmployeeAlertDetail() {
  return (
    <main className="detail-shell">
      <header className="detail-hero">
        <button className="back-button" onClick={() => (window.location.hash = "#/")}>
          <ArrowLeft size={18} />
          返回看板
        </button>
        <div>
          <p className="eyebrow">Employee Alert</p>
          <h1>请假人员工位出现预警</h1>
          <p>员工林泽宇已提交全天事假流程，但 10:42 被 3F 东区摄像头识别出现在本人办公工位。</p>
        </div>
      </header>

      <section className="detail-grid">
        <div className="video-panel">
          <div className="card-heading">
            <span>监控视频复核</span>
            <span className="risk-pill">高风险</span>
          </div>
          <video src={asset("cctv.mp4")} controls playsInline poster={asset("1.jpg")} />
        </div>

        <aside className="case-panel">
          <div className="case-score">
            <CircleAlert size={28} />
            <div>
              <strong>异常匹配度 96%</strong>
              <small>人脸识别、工位轨迹、请假流程三源交叉命中</small>
            </div>
          </div>

          <div className="timeline">
            <TimelineItem icon={<FolderUp size={17} />} title="09:08" text="员工提交全天事假申请" />
            <TimelineItem icon={<ClipboardCheck size={17} />} title="09:21" text="直属经理审批通过" />
            <TimelineItem icon={<Radio size={17} />} title="10:42" text="3F 东区摄像头识别到本人在岗" danger />
            <TimelineItem icon={<Send size={17} />} title="10:45" text="系统自动推送复核待办至合规稽核部" />
          </div>

          <div className="case-actions">
            <button className="primary-action">
              <PlayCircle size={17} />
              标记复核中
            </button>
            <button className="secondary-action">
              <MailCheck size={17} />
              通知部门负责人
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}

function BoardHeader({
  icon,
  label,
  status,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  status: string;
  tone: "red" | "amber" | "green";
}) {
  return (
    <div className="board-header">
      <div className={`board-icon ${tone}`}>{icon}</div>
      <div>
        <h2>{label}</h2>
        <p>{status}</p>
      </div>
    </div>
  );
}

function Metric({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <article className="metric-card">
      <div>{icon}</div>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function StatusRow({
  label,
  value,
  danger = false,
  expanded = false,
  onClick,
}: {
  label: string;
  value: string;
  danger?: boolean;
  expanded?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span>{label}</span>
      <strong className={danger ? "danger-value" : ""}>{value}</strong>
      {onClick ? expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} /> : null}
    </>
  );

  return onClick ? (
    <button className="status-row status-row-button" onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className="status-row">{content}</div>
  );
}

function DetailList({ items }: { items: string[] }) {
  return (
    <div className="inline-detail-list">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function TimelineItem({
  icon,
  title,
  text,
  danger = false,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  danger?: boolean;
}) {
  return (
    <article className={danger ? "timeline-item danger" : "timeline-item"}>
      <span>{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </article>
  );
}

export default App;
