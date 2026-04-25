import {
  Activity,
  AlertTriangle,
  AppWindow,
  Archive,
  BarChart3,
  BookOpen,
  Boxes,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Cloud,
  Code2,
  Copy,
  Cpu,
  Database,
  Download,
  Eye,
  FileText,
  Folder,
  FolderOpen,
  GitBranch,
  Globe,
  Gauge,
  HardDrive,
  KeyRound,
  Layers,
  Link,
  LockKeyhole,
  Minus,
  Network,
  Play,
  Plus,
  RefreshCcw,
  Rocket,
  Search,
  ServerCog,
  Settings,
  Share2,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  StopCircle,
  Terminal,
  UploadCloud,
  Users,
  Wand2,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";

type Tone = "slate" | "blue" | "emerald" | "amber" | "rose" | "violet" | "cyan";

type Tenant = {
  id: string;
  name: string;
  level: "集团" | "租户" | "工作空间";
  cpu: number;
  gpu: number;
  vgpu: number;
};

type ResourceSpec = {
  id: string;
  name: string;
  type: "GPU" | "vGPU" | "NPU" | "vNPU";
  deviceId: string;
  deviceName: string;
  vendor: string;
  architecture: string;
  cpu: number;
  memory: number;
  acceleratorUnits: number;
  sliceProfile: string;
  tenantBindings: TenantBinding[];
  tenantLimit: number;
  scope: string;
  status: "草稿" | "下发中" | "已生效";
};

type TenantBinding = {
  tenantId: string;
  tenantName: string;
  tenantLevel: Tenant["level"];
  limit: number;
};

type AcceleratorDevice = {
  id: string;
  name: string;
  vendor: string;
  architecture: string;
  memory: string;
  interconnect: string;
  inventory: number;
  unitLabel: "GPU" | "NPU";
  maxVirtualSlices: number;
  sliceProfiles: string[];
  supportedModes: Array<ResourceSpec["type"]>;
};

type ModelAsset = {
  id: string;
  name: string;
  type: "PyTorch" | "MindSpore" | "TensorFlow" | "ONNX" | "Safetensors";
  size: string;
  encrypted: boolean;
  algorithm?: "AES-256-GCM" | "SM4-CBC" | "ChaCha20-Poly1305";
  passphrase?: string;
  status: "未部署" | "部署中" | "模型下载中" | "模型解密中" | "模型部署中" | "已部署" | "加密部署";
  endpoint?: string;
  uploadedAt: string;
};

type SensitiveBehavior = "拦截请求" | "替换敏感词" | "记录日志" | "第三方安全服务";

type SensitiveCategory = "涉密信息" | "账号凭据" | "个人隐私" | "违规指令";

type SensitiveWord = {
  id: string;
  word: string;
  category: SensitiveCategory;
  behavior: SensitiveBehavior;
  source: "手动添加" | "文件导入";
  hits: number;
  blocked: number;
  updatedAt: string;
};

type SafetyTab = "library" | "policy";

type SecurityPolicy = {
  id: string;
  name: string;
  behavior: SensitiveBehavior;
  words: string[];
  scope: string;
  priority: number;
  actionDetail: string;
  status: "启用" | "停用";
  updatedAt: string;
};

type DevInstanceStatus = "调度中" | "部署中" | "运行中";

type DevInstance = {
  id: string;
  name: string;
  skuType: string;
  imageType: string;
  resource: string;
  ipAddress: string;
  owner: string;
  status: DevInstanceStatus;
  deeplink: string;
  lastEvent: string;
};

type DevSkuOption = {
  id: string;
  name: string;
  resource: string;
  zone: string;
};

type DevImageOption = {
  id: string;
  name: string;
  stack: string;
};

type TerminalLine = {
  id: string;
  kind: "command" | "stdout" | "stderr" | "system";
  text: string;
};

type TerminalSession = {
  cwd: string;
  lines: TerminalLine[];
  logVersion: number;
};

type FineTuneMode = "快速微调" | "专家微调";

type FineTuneTaskStatus = "停止" | "调度中" | "训练中" | "训练结束";

type FineTuneHyperParams = {
  learningRate: string;
  epochs: string;
  batchSize: string;
  loraRank: string;
  warmupRatio: string;
  scheduler: string;
  precision: string;
  maxSeqLength: string;
  gpuCount: string;
  optimizer: string;
  weightDecay: string;
  gradientAccumulation: string;
  deepspeed: string;
  validationSplit: string;
};

type FineTuneModelVersion = {
  name: string;
  version: string;
  registry: string;
  adapter: string;
  quantization: string;
  score: string;
  owner: string;
  visibility: string;
  readyAt: string;
  tags: string[];
};

type FineTuneTask = {
  id: string;
  name: string;
  mode: FineTuneMode;
  baseModel: string;
  dataset: string;
  datasetSize: string;
  progress: number;
  status: FineTuneTaskStatus;
  metric: string;
  resourceSpec: string;
  queueLabel: string;
  submittedAt: string;
  submittedBy: string;
  outputModelName: string;
  description: string;
  hyperParams: FineTuneHyperParams;
  logLines: string[];
  chart: number[];
  trainedModel?: FineTuneModelVersion;
};

type InferenceMode = "单机模式" | "PD 分离模式";

type InferenceTaskStatus = "创建中" | "运行中" | "扩缩容中" | "待调整";

type InferenceTask = {
  id: string;
  name: string;
  framework: "vLLM";
  engineVersion: string;
  mode: InferenceMode;
  model: string;
  cluster: string;
  namespace: string;
  serviceName: string;
  endpoint: string;
  createdAt: string;
  createdBy: string;
  status: InferenceTaskStatus;
  routePolicy: string;
  maxModelLen: string;
  maxNumSeqs: string;
  kvCache: string;
  routerReplicas: number;
  routerMin: number;
  routerMax: number;
  routerSpec: string;
  prefillReplicas: number;
  prefillMin: number;
  prefillMax: number;
  prefillSpec: string;
  decodeReplicas: number;
  decodeMin: number;
  decodeMax: number;
  decodeSpec: string;
  singleReplicas: number;
  singleMin: number;
  singleMax: number;
  singleSpec: string;
  notes: string;
};

type InferenceLifecycleAction = "start" | "stop" | "delete";

type InferenceLifecycleEvent = {
  id: string;
  title: string;
  detail: string;
  time: string;
  result: AuditEvent["result"];
};

type InferenceMonitorRole = {
  id: string;
  role: string;
  summary: string;
  replicas: string;
  spec: string;
  qps: string;
  latency: string;
  utilization: string;
  throughput: string;
};

type InferenceMonitorAlert = {
  id: string;
  level: "正常" | "提示" | "告警";
  title: string;
  detail: string;
  time: string;
};

type InferenceMonitorSnapshot = {
  currentQps: string;
  ttftP95: string;
  e2eP95: string;
  successRate: string;
  gpuUtilization: string;
  kvHitRate: string;
  inflightRequests: string;
  outputTokens: string;
  queueDepth: string;
  trend: number[];
  roles: InferenceMonitorRole[];
  alerts: InferenceMonitorAlert[];
  events: InferenceLifecycleEvent[];
};

type AppSpace = {
  id: string;
  name: string;
  repo: string;
  branch: string;
  sdk: string;
  runtime: string;
  status: "草稿" | "已提交" | "构建中" | "部署中" | "运行中" | "已停止";
  endpoint: string;
  owner: string;
  visibility: "团队共享" | "租户可见" | "公开";
  buildNumber: number;
  region: string;
  commitSha: string;
  commitMessage: string;
  publishedVersion: string;
  likes: number;
  visits: number;
  published: boolean;
  buildLogs: string[];
  runtimeLogs: string[];
};

type CloudNativeApp = {
  id: string;
  name: string;
  image: string;
  replicas: number;
  resource: string;
  ingress: string;
  storage: string;
  autoscaling: string;
  source: string;
  status: "草稿" | "任务下发中" | "部署中" | "运行中" | "扩缩容中" | "已停止";
  updatedAt: string;
};

type CloudNativeCatalogItem = {
  id: string;
  name: string;
  summary: string;
  image: string;
  resource: string;
  ingress: string;
  storage: string;
  replicas: number;
  autoscaling: string;
  tags: string[];
};

type FabricType = "IB" | "RoCE";

type ClusterStatus = "运行中" | "配置变更中" | "待校验";

type FabricPreference = "IB 优先" | "RoCE 优先" | "双平面";

type NodePoolFabricPolicy = "IB 训练平面" | "RoCE 业务平面" | "双平面";

type ClusterNodePool = {
  id: string;
  name: string;
  role: "训练" | "推理" | "存储" | "跨云网关";
  nodes: number;
  accelerator: string;
  rdmaNic: string;
  networkPolicy: NodePoolFabricPolicy;
};

type ClusterNetworkConfig = {
  topology: "单数据中心" | "双活机房" | "跨云互联";
  primaryFabric: FabricType;
  schedulerPolicy: "RDMA 优先调度" | "按网络标签隔离" | "跨云回落 RoCE";
  validationPolicy: "提交前校验" | "变更窗口校验";
  ib: {
    enabled: boolean;
    speed: string;
    subnetManager: string;
    pKey: string;
    serviceLevel: number;
    mtu: string;
    adaptiveRouting: boolean;
    trafficClass: string;
  };
  roce: {
    enabled: boolean;
    mode: "RoCE v2 L2" | "RoCE v2 L3";
    nicBond: string;
    pfcEnabled: boolean;
    pfcPriority: number;
    ecnEnabled: boolean;
    ecnThreshold: string;
    dscp: number;
    mtu: string;
    gateway: string;
  };
};

type Cluster = {
  id: string;
  name: string;
  region: string;
  business: string;
  status: ClusterStatus;
  nodes: number;
  accelerator: string;
  latencyTarget: string;
  configVersion: string;
  lastChanged: string;
  fabricPreference: FabricPreference;
  rdmaJobs: number;
  network: ClusterNetworkConfig;
  nodePools: ClusterNodePool[];
};

type ClusterPluginTab = "platform" | "kubernetes";

type ClusterPluginStatus = "运行中" | "已集成" | "可选安装" | "安装中" | "卸载中";

type ClusterPlugin = {
  id: string;
  name: string;
  category: ClusterPluginTab;
  vendor: string;
  version: string;
  summary: string;
  capability: string;
  deployment: string;
  status: ClusterPluginStatus;
  tags: string[];
};

type ClusterPluginRuntime = {
  status: ClusterPluginStatus;
  progress: number;
  phase: string;
};

type PublishRule = {
  id: string;
  model: string;
  scope: "个人" | "租户" | "公开";
  quota: string;
  expires: string;
  tenantIds: string[];
  tenantNames: string[];
  updatedAt: string;
  status: "已发布" | "已撤销";
};

type ModelMarketComment = {
  id: string;
  author: string;
  role: string;
  content: string;
  createdAt: string;
  likes: number;
};

type ModelMarketPlacementLevel = "普通" | "精选" | "置顶";

type ModelMarketPlacementStatus = "未设置" | "待审批" | "已生效";

type ModelMarketPlacementChannel = "市场首页" | "搜索优先" | "专题推荐";

type ModelMarketPlacement = {
  level: ModelMarketPlacementLevel;
  status: ModelMarketPlacementStatus;
  channels: ModelMarketPlacementChannel[];
  reason: string;
  applicant?: string;
  approver?: string;
  requestedAt?: string;
  approvedAt?: string;
  effectiveUntil?: string;
};

type OpenSourceModelCard = {
  id: string;
  name: string;
  family: string;
  provider: string;
  params: string;
  summary: string;
  highlights: string[];
  rating: number;
  reviewCount: number;
  heatScore: number;
  weeklyCalls: string;
  downloads: number;
  favorites: number;
  comments: ModelMarketComment[];
  placement: ModelMarketPlacement;
};

type DatasetVisibility = "私有" | "租户共享" | "公开";

type DatasetPermissionScope = "个人" | "租户" | "公开";

type DatasetWatermarkPolicy = "关闭" | "租户标识水印" | "实名下载水印" | "动态追踪水印";

type DatasetAccessPolicy = {
  scope: DatasetPermissionScope;
  modelTypes: string[];
  industryScenarios: string[];
  regions: string[];
  orgStructures: string[];
  tenantIds: string[];
  tenantNames: string[];
  effectiveUntil: string;
  watermarkPolicy: DatasetWatermarkPolicy;
  permissions: {
    read: boolean;
    edit: boolean;
    download: boolean;
    share: boolean;
  };
  updatedAt: string;
};

type DatasetSnapshotField = {
  label: string;
  value: string;
};

type DatasetSnapshot = {
  id: string;
  version: string;
  createdAt: string;
  createdBy: string;
  summary: string;
  lineage: string[];
  codeCommit: string;
  commitMessage: string;
  hyperParams: DatasetSnapshotField[];
  metrics: DatasetSnapshotField[];
  changeNotes: string[];
};

type DatasetAsset = {
  id: string;
  name: string;
  owner: string;
  visibility: DatasetVisibility;
  modality: string;
  domain: string;
  task: string;
  summary: string;
  tags: string[];
  sampleCount: string;
  storage: string;
  likes: number;
  downloads: number;
  updatedAt: string;
  currentVersionId: string;
  consumers: string[];
  versions: DatasetSnapshot[];
  accessPolicy: DatasetAccessPolicy;
};

type AuditEvent = {
  id: string;
  time: string;
  actor: string;
  action: string;
  target: string;
  result: "成功" | "处理中" | "拦截" | "告警";
};

type DemoScenario = {
  key: string;
  title: string;
  summary: string;
  steps: string[];
  tone: Tone;
  featured?: boolean;
};

type NavigationItem = {
  path: string;
  label: string;
  icon: LucideIcon;
  scenario?: string;
};

type NavigationSection = {
  id: string;
  label: string;
  items: NavigationItem[];
};

const tenants: Tenant[] = [
  { id: "group", name: "集团级资源池", level: "集团", cpu: 1280, gpu: 160, vgpu: 620 },
  { id: "tenant-a", name: "智能制造租户", level: "租户", cpu: 420, gpu: 48, vgpu: 180 },
  { id: "tenant-b", name: "城市治理租户", level: "租户", cpu: 360, gpu: 36, vgpu: 140 },
  { id: "workspace-a", name: "大模型研发空间", level: "工作空间", cpu: 128, gpu: 12, vgpu: 48 },
];

const modelAssets: ModelAsset[] = [
  {
    id: "m-001",
    name: "工业质检多模态模型",
    type: "PyTorch",
    size: "18.6GB",
    encrypted: true,
    algorithm: "SM4-CBC",
    passphrase: "secure-001",
    status: "未部署",
    uploadedAt: "2026-04-24 09:18",
  },
  {
    id: "m-002",
    name: "政务问答大语言模型",
    type: "MindSpore",
    size: "42.8GB",
    encrypted: false,
    status: "未部署",
    uploadedAt: "2026-04-24 10:06",
  },
  {
    id: "m-003",
    name: "设备预测性维护模型",
    type: "TensorFlow",
    size: "8.3GB",
    encrypted: true,
    algorithm: "AES-256-GCM",
    passphrase: "secure-003",
    status: "未部署",
    uploadedAt: "2026-04-24 11:42",
  },
  {
    id: "m-004",
    name: "文本分类基线模型",
    type: "ONNX",
    size: "2.1GB",
    encrypted: false,
    status: "未部署",
    uploadedAt: "2026-04-24 13:20",
  },
];

const initialAudit: AuditEvent[] = [
  {
    id: "a-001",
    time: "14:22:09",
    actor: "平台运营员",
    action: "更新租户级 GPU 配额",
    target: "智能制造租户",
    result: "成功",
  },
  {
    id: "a-002",
    time: "14:17:42",
    actor: "安全策略",
    action: "触发敏感词替换",
    target: "政务问答服务",
    result: "告警",
  },
  {
    id: "a-003",
    time: "14:09:18",
    actor: "研发工程师",
    action: "发布模型应用空间",
    target: "质检助手",
    result: "成功",
  },
  {
    id: "a-004",
    time: "13:56:31",
    actor: "模型仓库",
    action: "完成 SM4 加密上传",
    target: "设备预测性维护模型",
    result: "成功",
  },
];

const scenarios: DemoScenario[] = [
  {
    key: "cluster",
    title: "集群管理与高速网络编排",
    summary: "围绕 IB 与 RoCE 双平面网络，为训练、推理、跨云互联场景设计集群级配置、生效与校验闭环。",
    steps: ["选择集群", "规划平面", "配置 IB", "配置 RoCE", "校验生效"],
    tone: "cyan",
  },
  {
    key: "compute",
    title: "精细化算力治理",
    summary: "从集团资源池到租户、工作空间逐级约束，保证异构算力可控分配。",
    steps: ["定义规格", "绑定租户", "设置上限", "下发策略", "审计留痕"],
    tone: "blue",
  },
  {
    key: "encryption",
    title: "模型加密部署工作流",
    summary: "用户上传模型文件后选择类型、算法和口令，完成加密上传，并在部署加密模型时校验口令。",
    steps: ["上传文件", "选择参数", "加密上传", "模型列表", "口令部署"],
    tone: "emerald",
  },
  {
    key: "datasets",
    title: "数据集管理与版本快照",
    summary: "按照类似 Huggingface Dataset Hub 的方式管理数据资产，并下钻查看版本快照、血缘、代码提交、指标差异与回滚。",
    steps: ["浏览数据集", "查看快照", "选择版本", "差异对比", "执行回滚"],
    tone: "blue",
    featured: false,
  },
  {
    key: "safety",
    title: "可编排内容安全策略",
    summary: "支持敏感词库维护与策略编排，命中后按拦截、替换、第三方服务、日志等动作处置。",
    steps: ["维护词库", "上传导入", "策略编排", "统计分析", "记录审计"],
    tone: "rose",
  },
  {
    key: "dev",
    title: "远程研发提效",
    summary: "研发人员一键进入开发实例，代码在线编辑、同步和上传可追踪。",
    steps: ["选择实例", "建立隧道", "启动 VS Code", "同步代码", "归档记录"],
    tone: "cyan",
  },
  {
    key: "finetune",
    title: "快速与专家微调",
    summary: "轻量任务快速发起，复杂任务保留参数和资源的专家控制，并支持多数据集联合提交。",
    steps: ["选择模式", "选择模型", "选择数据集", "配置参数", "查看指标"],
    tone: "violet",
  },
  {
    key: "inference",
    title: "模型推理任务",
    summary: "基于 vLLM 提供单机与 PD 分离推理任务编排，支持 Router、Prefill、Decode 角色的独立扩缩容与实例管理。",
    steps: ["选择模式", "填写角色", "设置扩缩容", "创建任务", "查看实例"],
    tone: "cyan",
  },
  {
    key: "scheduler",
    title: "Volcano 调度器",
    summary: "围绕微调任务提供队列、公平性、Gang、抢占和回填编排，实现参数配置与执行管理一体化。",
    steps: ["选择模板", "绑定队列", "设置 Gang", "配置抢占", "下发执行"],
    tone: "cyan",
    featured: false,
  },
  {
    key: "tasks",
    title: "任务管理与优先级抢占",
    summary: "统一展示任务列表，并通过右侧案例演示高优先级插队、低优先级回收和受保护任务不被抢占的行为。",
    steps: ["查看任务", "选择案例", "观察优先级", "执行抢占", "回看结果"],
    tone: "amber",
    featured: false,
  },
  {
    key: "drive",
    title: "云盘管理与 S3 浏览器",
    summary: "提供类似文件浏览器的数据目录视图，支持文件上传、文件夹上传、下载和批量删除，并展示 S3 连接信息。",
    steps: ["查看目录", "复制凭据", "上传文件", "上传文件夹", "下载与删除"],
    tone: "blue",
    featured: false,
  },
  {
    key: "space",
    title: "模型应用空间",
    summary: "Git 源码、自动构建、在线部署、预览和生命周期管理集中完成。",
    steps: ["绑定仓库", "自动构建", "部署运行", "在线预览", "发布管理"],
    tone: "amber",
  },
  {
    key: "cloud",
    title: "云原生应用交付",
    summary: "应用商店到实例运行时配置，覆盖 Ingress、存储、变量和弹性伸缩。",
    steps: ["商店部署", "资源规格", "运行配置", "弹性伸缩", "运维闭环"],
    tone: "blue",
  },
  {
    key: "market",
    title: "模型市场",
    summary: "以模型卡片、精选置顶、详情页、评分评论和热度榜单承载模型运营，促进资产价值发现与流转。",
    steps: ["浏览卡片", "设置推荐位", "查看榜单", "进入详情", "运营沉淀"],
    tone: "emerald",
  },
];

const initialDatasetSeeds: DatasetAsset[] = [
  {
    id: "gov-text-sft",
    name: "GovText-SFT-CN",
    owner: "政务模型组",
    visibility: "租户共享",
    modality: "文本",
    domain: "政务问答",
    task: "监督微调 / 问答增强",
    summary: "面向政务问答与政策检索的中文指令数据集，保留清洗、切分、评测与上线快照。",
    tags: ["zh", "instruction", "sft", "governance"],
    sampleCount: "148,000 训练 / 16,400 验证",
    storage: "42.8 GB",
    likes: 214,
    downloads: 1286,
    updatedAt: "2026-04-25 09:20",
    currentVersionId: "gov-v3",
    consumers: ["政务问答工作台", "gov-qa-nightly", "政策助手评测集"],
    accessPolicy: createDatasetAccessPolicy({
      visibility: "租户共享",
      modelTypes: ["LLM", "RAG"],
      industryScenarios: ["政务问答", "政策检索"],
      regions: ["华东", "全国"],
      orgStructures: ["集团", "政务事业部", "租户"],
      tenantIds: ["tenant-a", "tenant-b"],
      tenantNames: ["智能制造租户", "城市治理租户"],
    }),
    versions: [
      {
        id: "gov-v3",
        version: "v3.2.0",
        createdAt: "2026-04-25 09:20",
        createdBy: "政务模型组 / 李潇",
        summary: "接入最新政策库与工单问答样本，新增低质回答过滤器并重跑评测。",
        lineage: [
          "raw/policy-20260424.parquet + raw/ticket-qa-20260424.jsonl",
          "清洗流水线 data-pipeline/gov-clean@c8f4a21",
          "PII 脱敏规则 pii-masker-v2.1 + 8:1:1 切分策略",
        ],
        codeCommit: "c8f4a21",
        commitMessage: "feat: refine gov data cleaner and refresh eval split",
        hyperParams: [
          { label: "基础模型", value: "Qwen2.5-7B-Instruct" },
          { label: "Epoch", value: "3" },
          { label: "Learning Rate", value: "2e-5" },
          { label: "LoRA Rank", value: "64" },
        ],
        metrics: [
          { label: "Rouge-L", value: "54.2" },
          { label: "EM", value: "71.8%" },
          { label: "人工验收通过率", value: "96.4%" },
          { label: "幻觉率", value: "2.1%" },
        ],
        changeNotes: ["新增 23,400 条政务工单问答", "剔除低置信度样本 8,213 条", "回归测试通过后设为当前版本"],
      },
      {
        id: "gov-v2",
        version: "v3.1.0",
        createdAt: "2026-04-18 18:06",
        createdBy: "政务模型组 / 李潇",
        summary: "第一次将工单问答和政策语料合并进入统一训练快照。",
        lineage: [
          "raw/policy-20260416.parquet + raw/ticket-qa-20260417.jsonl",
          "清洗流水线 data-pipeline/gov-clean@b31fa82",
          "敏感字段脱敏 v2.0 + 8:1:1 切分策略",
        ],
        codeCommit: "b31fa82",
        commitMessage: "feat: merge ticket corpus into gov sft dataset",
        hyperParams: [
          { label: "基础模型", value: "Qwen2.5-7B-Instruct" },
          { label: "Epoch", value: "3" },
          { label: "Learning Rate", value: "2e-5" },
          { label: "LoRA Rank", value: "32" },
        ],
        metrics: [
          { label: "Rouge-L", value: "51.7" },
          { label: "EM", value: "68.5%" },
          { label: "人工验收通过率", value: "93.6%" },
          { label: "幻觉率", value: "3.4%" },
        ],
        changeNotes: ["新增工单类样本后回答覆盖度明显提升", "仍存在旧政策引用问题，因此保留为历史快照"],
      },
      {
        id: "gov-v1",
        version: "v3.0.0",
        createdAt: "2026-04-08 14:32",
        createdBy: "政务模型组 / 周颉",
        summary: "仅基于政策条文构建的首个政务指令版本。",
        lineage: [
          "raw/policy-20260408.parquet",
          "清洗流水线 data-pipeline/gov-clean@91da553",
          "规则去重 + 固定长度切分",
        ],
        codeCommit: "91da553",
        commitMessage: "feat: bootstrap gov instruction dataset",
        hyperParams: [
          { label: "基础模型", value: "Qwen2-7B-Instruct" },
          { label: "Epoch", value: "2" },
          { label: "Learning Rate", value: "3e-5" },
          { label: "LoRA Rank", value: "16" },
        ],
        metrics: [
          { label: "Rouge-L", value: "47.8" },
          { label: "EM", value: "61.2%" },
          { label: "人工验收通过率", value: "88.1%" },
          { label: "幻觉率", value: "5.6%" },
        ],
        changeNotes: ["初始上线版本", "适合回溯最早训练口径"],
      },
    ],
  },
  {
    id: "vision-defect-pairs",
    name: "VisionDefect-Pairs",
    owner: "制造视觉组",
    visibility: "公开",
    modality: "图文",
    domain: "工业质检",
    task: "多模态对齐 / 缺陷识别",
    summary: "类似 Huggingface 数据集主页的图文数据集入口，沉淀多批次质检图片、标注、描述语和评测结果。",
    tags: ["vision", "multimodal", "quality", "caption"],
    sampleCount: "820,000 图文对",
    storage: "186.4 GB",
    likes: 356,
    downloads: 2438,
    updatedAt: "2026-04-24 17:45",
    currentVersionId: "vision-v4",
    consumers: ["质检助手应用空间", "vision-align-train", "缺陷检测日报"],
    accessPolicy: createDatasetAccessPolicy({
      visibility: "公开",
      modelTypes: ["多模态", "视觉"],
      industryScenarios: ["工业质检", "视觉分析"],
      regions: ["华东", "华南", "全国"],
      orgStructures: ["集团", "制造事业部", "租户", "工作空间"],
      watermarkPolicy: "实名下载水印",
    }),
    versions: [
      {
        id: "vision-v4",
        version: "v4.0.1",
        createdAt: "2026-04-24 17:45",
        createdBy: "制造视觉组 / 何舟",
        summary: "补充新产线样本并统一图文清洗模板，当前作为线上默认快照。",
        lineage: [
          "raw/line-a-images-0424 + raw/line-c-images-0424",
          "标注工具 label-studio export + caption-normalizer@f2a91de",
          "去重阈值 0.93 + OCR 过滤 + 图文对齐校验",
        ],
        codeCommit: "f2a91de",
        commitMessage: "feat: normalize captions and align new production lines",
        hyperParams: [
          { label: "基础模型", value: "InternVL2-8B" },
          { label: "Epoch", value: "2" },
          { label: "Learning Rate", value: "1.5e-5" },
          { label: "Batch Size", value: "256" },
        ],
        metrics: [
          { label: "图文对齐通过率", value: "98.4%" },
          { label: "Recall@10", value: "92.1%" },
          { label: "误报率", value: "1.7%" },
          { label: "人工复核通过率", value: "95.8%" },
        ],
        changeNotes: ["新增 120,000 张质检图片", "统一 caption 模板", "改善 OCR 误差导致的错配问题"],
      },
      {
        id: "vision-v3",
        version: "v3.3.0",
        createdAt: "2026-04-14 16:12",
        createdBy: "制造视觉组 / 何舟",
        summary: "加入 OCR 文本过滤和噪声图像剔除规则。",
        lineage: [
          "raw/line-a-images-0414 + raw/line-b-images-0414",
          "caption-normalizer@d7e11aa + image-filter@c4d81ce",
          "相似图去重 + 模糊样本剔除",
        ],
        codeCommit: "d7e11aa",
        commitMessage: "feat: add ocr filter and image denoise stage",
        hyperParams: [
          { label: "基础模型", value: "InternVL2-8B" },
          { label: "Epoch", value: "2" },
          { label: "Learning Rate", value: "2e-5" },
          { label: "Batch Size", value: "192" },
        ],
        metrics: [
          { label: "图文对齐通过率", value: "96.9%" },
          { label: "Recall@10", value: "89.4%" },
          { label: "误报率", value: "2.6%" },
          { label: "人工复核通过率", value: "92.7%" },
        ],
        changeNotes: ["过滤掉大批量 OCR 污染样本", "保留为可回滚的稳定版本"],
      },
      {
        id: "vision-v2",
        version: "v3.0.0",
        createdAt: "2026-04-02 11:08",
        createdBy: "制造视觉组 / 郑原",
        summary: "第一版多模态缺陷图文对齐数据集。",
        lineage: [
          "raw/line-a-images-0402",
          "caption bootstrap@98ad101",
          "人工抽检 + 基础去重",
        ],
        codeCommit: "98ad101",
        commitMessage: "feat: initial multimodal defect dataset",
        hyperParams: [
          { label: "基础模型", value: "InternVL2-4B" },
          { label: "Epoch", value: "1" },
          { label: "Learning Rate", value: "3e-5" },
          { label: "Batch Size", value: "128" },
        ],
        metrics: [
          { label: "图文对齐通过率", value: "91.6%" },
          { label: "Recall@10", value: "84.2%" },
          { label: "误报率", value: "4.9%" },
          { label: "人工复核通过率", value: "88.4%" },
        ],
        changeNotes: ["历史基线版本", "适合说明图文数据集的演进过程"],
      },
    ],
  },
  {
    id: "speech-command-clean",
    name: "SpeechCommand-Clean",
    owner: "语音平台组",
    visibility: "私有",
    modality: "语音",
    domain: "语音识别",
    task: "ASR 训练 / VAD 清洗",
    summary: "统一管理语音切分、标注修正、VAD 过滤和训练快照，满足租户内部私有数据治理。",
    tags: ["speech", "asr", "vad", "private"],
    sampleCount: "2,340 小时音频",
    storage: "96.2 GB",
    likes: 72,
    downloads: 148,
    updatedAt: "2026-04-23 21:16",
    currentVersionId: "speech-v5",
    consumers: ["speech-cleanup-job", "热线语音转写服务"],
    accessPolicy: createDatasetAccessPolicy({
      visibility: "私有",
      modelTypes: ["语音", "ASR"],
      industryScenarios: ["语音转写", "热线质检"],
      regions: ["华东"],
      orgStructures: ["语音平台组", "项目组"],
      effectiveUntil: "2026-09-30",
      permissions: { read: true, edit: true, download: false, share: false },
    }),
    versions: [
      {
        id: "speech-v5",
        version: "v5.0.0",
        createdAt: "2026-04-23 21:16",
        createdBy: "语音平台组 / 田策",
        summary: "重新对齐热线录音和人工转写，并引入新一轮 VAD 分段规则。",
        lineage: [
          "raw/hotline-audio-0423.tar + raw/transcript-0423.csv",
          "speech-cleaner@a41fd20 + vad-segmenter@7ab3310",
          "降噪、静音裁剪、时长过滤 0.6s-18s",
        ],
        codeCommit: "a41fd20",
        commitMessage: "feat: refresh hotline aligner and vad segmenter",
        hyperParams: [
          { label: "基础模型", value: "Paraformer-Large" },
          { label: "Epoch", value: "20" },
          { label: "Learning Rate", value: "1e-4" },
          { label: "SpecAugment", value: "开启" },
        ],
        metrics: [
          { label: "CER", value: "4.8%" },
          { label: "WER", value: "7.2%" },
          { label: "VAD 命中率", value: "97.1%" },
          { label: "人工转写一致率", value: "95.3%" },
        ],
        changeNotes: ["语音与文本重新对齐", "当前私有上线快照"],
      },
      {
        id: "speech-v4",
        version: "v4.2.0",
        createdAt: "2026-04-11 20:03",
        createdBy: "语音平台组 / 田策",
        summary: "上一轮热线清洗版本，仍保留为可回滚节点。",
        lineage: [
          "raw/hotline-audio-0411.tar + raw/transcript-0411.csv",
          "speech-cleaner@9c2de10 + vad-segmenter@63a7f0b",
          "基础降噪 + 时长过滤 0.8s-20s",
        ],
        codeCommit: "9c2de10",
        commitMessage: "feat: stabilize speech cleanup pipeline",
        hyperParams: [
          { label: "基础模型", value: "Paraformer-Large" },
          { label: "Epoch", value: "18" },
          { label: "Learning Rate", value: "1.2e-4" },
          { label: "SpecAugment", value: "关闭" },
        ],
        metrics: [
          { label: "CER", value: "5.4%" },
          { label: "WER", value: "8.1%" },
          { label: "VAD 命中率", value: "95.5%" },
          { label: "人工转写一致率", value: "92.8%" },
        ],
        changeNotes: ["作为当前版本的直接前序快照", "适合说明回滚路径"],
      },
    ],
  },
];

const datasetSeries = [
  "Atlas",
  "Nova",
  "Orion",
  "Vertex",
  "Nimbus",
  "Helix",
  "Quanta",
  "Aegis",
  "Flux",
  "Vector",
];

const initialDatasetCatalog: DatasetAsset[] = Array.from({ length: 40 }, (_, index) => {
  const seed = initialDatasetSeeds[index % initialDatasetSeeds.length];
  const serial = String(index + 1).padStart(2, "0");
  const series = datasetSeries[index % datasetSeries.length];
  const currentVersion = seed.versions.find((item) => item.id === seed.currentVersionId) ?? seed.versions[0];
  const likes = seed.likes + index * 7;
  const downloads = seed.downloads + index * 23;

  const versions = seed.versions.map((version, versionIndex) => ({
    ...version,
    id: `${seed.id}-${serial}-v${versionIndex + 1}`,
    createdAt: `2026-04-${String(25 - (index % 9) - versionIndex).padStart(2, "0")} ${version.createdAt.slice(11)}`,
    changeNotes: [...version.changeNotes],
    lineage: [...version.lineage],
    hyperParams: version.hyperParams.map((item) => ({ ...item })),
    metrics: version.metrics.map((item) => ({ ...item })),
  }));

  const mappedCurrentVersion = versions.find((item) => item.version === currentVersion.version)?.id ?? versions[0].id;

  return {
    ...seed,
    id: `${seed.id}-${serial}`,
    name: `${seed.name}-${series}-${serial}`,
    summary: `${seed.domain}场景 ${seed.modality} 数据集，支持版本快照、差异对比与回滚。`,
    likes,
    downloads,
    updatedAt: `2026-04-${String(25 - (index % 11)).padStart(2, "0")} ${seed.updatedAt.slice(11)}`,
    currentVersionId: mappedCurrentVersion,
    tags: [...seed.tags.slice(0, 3), `mock-${serial}`],
    consumers: [...seed.consumers],
    accessPolicy: {
      ...seed.accessPolicy,
      modelTypes: [...seed.accessPolicy.modelTypes],
      industryScenarios: [...seed.accessPolicy.industryScenarios],
      regions: [...seed.accessPolicy.regions],
      orgStructures: [...seed.accessPolicy.orgStructures],
      tenantIds: [...seed.accessPolicy.tenantIds],
      tenantNames: [...seed.accessPolicy.tenantNames],
      permissions: { ...seed.accessPolicy.permissions },
      updatedAt: `2026-04-${String(25 - (index % 11)).padStart(2, "0")} ${seed.updatedAt.slice(11)}`,
    },
    versions,
  };
});

const devSkuOptions: DevSkuOption[] = [
  { id: "a100-train-standard", name: "a100-train-standard", resource: "32C / 256GB / 4 GPU", zone: "NVIDIA A100 80GB" },
  { id: "h200-vgpu-inference", name: "h200-vgpu-inference", resource: "16C / 96GB / 1 vGPU", zone: "NVIDIA H200 141GB" },
  { id: "ascend-910b-vnpu-balanced", name: "ascend-910b-vnpu-balanced", resource: "16C / 96GB / 2 vNPU", zone: "昇腾 910B" },
];

const devImageOptions: DevImageOption[] = [
  { id: "pytorch-2.4-cuda-12.4", name: "PyTorch 2.4 CUDA 12.4", stack: "Python 3.11 / CUDA 开发栈" },
  { id: "mindspore-2.3-cann-8", name: "MindSpore 2.3 CANN 8.0", stack: "Ascend CANN / MindIE 组件" },
  { id: "vscode-base-python", name: "VS Code Base Python 3.11", stack: "轻量调试镜像 / 常规依赖" },
];

const cloudNativeCatalog: CloudNativeCatalogItem[] = [
  {
    id: "store-rag",
    name: "RAG 检索增强服务",
    summary: "提供向量检索、知识库召回和统一 API 接口。",
    image: "registry.local/apps/rag-service:2.3.1",
    resource: "4C / 16GB",
    ingress: "rag.demo.local",
    storage: "100GB PVC",
    replicas: 2,
    autoscaling: "2-6 副本 / CPU 65%",
    tags: ["知识库", "API"],
  },
  {
    id: "store-guard",
    name: "文本审核云原生服务",
    summary: "执行文本预处理、敏感词检测和内容审计。",
    image: "registry.local/apps/text-guard:1.8.2",
    resource: "4C / 16GB",
    ingress: "text-guard.demo.local",
    storage: "20GB PVC",
    replicas: 2,
    autoscaling: "2-4 副本 / CPU 60%",
    tags: ["审核", "安全"],
  },
  {
    id: "store-gateway",
    name: "模型推理网关",
    summary: "负责统一鉴权、灰度转发和推理服务路由。",
    image: "registry.local/apps/inference-gateway:3.0.4",
    resource: "8C / 32GB",
    ingress: "gateway.demo.local",
    storage: "20GB PVC",
    replicas: 3,
    autoscaling: "3-8 副本 / CPU 70%",
    tags: ["推理", "网关"],
  },
  {
    id: "store-etl",
    name: "数据清洗任务中心",
    summary: "定时执行数据拉取、清洗转换与离线写回。",
    image: "registry.local/apps/data-etl:1.4.0",
    resource: "2C / 8GB",
    ingress: "etl.demo.local",
    storage: "对象存储挂载",
    replicas: 1,
    autoscaling: "1-3 副本 / 定时扩缩",
    tags: ["数据处理", "批任务"],
  },
  {
    id: "store-ocr",
    name: "OCR 文档识别服务",
    summary: "执行票据、文档与扫描件解析，输出结构化字段。",
    image: "registry.local/apps/ocr-service:2.1.5",
    resource: "4C / 16GB",
    ingress: "ocr.demo.local",
    storage: "50GB PVC",
    replicas: 2,
    autoscaling: "2-5 副本 / CPU 65%",
    tags: ["OCR", "文档"],
  },
  {
    id: "store-voice",
    name: "语音转写服务",
    summary: "提供音频上传、实时流式识别和转写结果回调。",
    image: "registry.local/apps/speech-asr:1.9.3",
    resource: "8C / 32GB",
    ingress: "speech.demo.local",
    storage: "100GB PVC",
    replicas: 2,
    autoscaling: "2-6 副本 / CPU 68%",
    tags: ["语音", "转写"],
  },
  {
    id: "store-face",
    name: "视觉分析服务",
    summary: "承载图像检测、目标识别和多路视频帧分析。",
    image: "registry.local/apps/vision-service:3.2.0",
    resource: "8C / 32GB",
    ingress: "vision.demo.local",
    storage: "200GB PVC",
    replicas: 2,
    autoscaling: "2-6 副本 / GPU 70%",
    tags: ["视觉", "分析"],
  },
  {
    id: "store-search",
    name: "企业搜索网关",
    summary: "统一聚合业务索引、权限过滤和检索结果服务。",
    image: "registry.local/apps/search-gateway:2.0.7",
    resource: "4C / 16GB",
    ingress: "search.demo.local",
    storage: "100GB PVC",
    replicas: 2,
    autoscaling: "2-5 副本 / CPU 60%",
    tags: ["检索", "网关"],
  },
  {
    id: "store-notify",
    name: "消息通知中心",
    summary: "承载短信、邮件、站内信和Webhook 分发能力。",
    image: "registry.local/apps/notify-center:1.6.4",
    resource: "2C / 8GB",
    ingress: "notify.demo.local",
    storage: "20GB PVC",
    replicas: 2,
    autoscaling: "2-4 副本 / CPU 55%",
    tags: ["通知", "消息"],
  },
  {
    id: "store-bi",
    name: "指标看板服务",
    summary: "提供图表查询、指标聚合和大屏接口输出。",
    image: "registry.local/apps/bi-dashboard:2.4.8",
    resource: "4C / 16GB",
    ingress: "bi.demo.local",
    storage: "50GB PVC",
    replicas: 2,
    autoscaling: "2-4 副本 / CPU 58%",
    tags: ["报表", "看板"],
  },
  {
    id: "store-agent",
    name: "智能体编排服务",
    summary: "负责工具调用、任务编排和会话状态托管。",
    image: "registry.local/apps/agent-orchestrator:0.9.6",
    resource: "8C / 32GB",
    ingress: "agent.demo.local",
    storage: "100GB PVC",
    replicas: 3,
    autoscaling: "3-8 副本 / CPU 72%",
    tags: ["智能体", "编排"],
  },
];

const initialInferenceTasks: InferenceTask[] = [
  {
    id: "inf-201",
    name: "政务问答-pd-router",
    framework: "vLLM",
    engineVersion: "vLLM 0.8.5",
    mode: "PD 分离模式",
    model: "Qwen2.5-72B-Instruct",
    cluster: "跨云推理集群 B",
    namespace: "inference-prod",
    serviceName: "gov-qa-pd",
    endpoint: buildInferenceEndpoint("gov-qa-pd", "inference-prod"),
    createdAt: "2026-04-25 09:42:18",
    createdBy: "平台运营员",
    status: "运行中",
    routePolicy: "TTFT 优先 + Decode 负载均衡",
    maxModelLen: "32768",
    maxNumSeqs: "256",
    kvCache: "FP8 E5M2",
    routerReplicas: 2,
    routerMin: 2,
    routerMax: 4,
    routerSpec: "4C / 8GB",
    prefillReplicas: 3,
    prefillMin: 2,
    prefillMax: 6,
    prefillSpec: "L40S x2 / 96GB",
    decodeReplicas: 8,
    decodeMin: 4,
    decodeMax: 16,
    decodeSpec: "L40S x1 / 48GB",
    singleReplicas: 0,
    singleMin: 0,
    singleMax: 0,
    singleSpec: "",
    notes: "面向政务问答高并发入口，Prefill 保障首包时延，Decode 负责续写吞吐。",
  },
  {
    id: "inf-202",
    name: "制造视觉质检-pd",
    framework: "vLLM",
    engineVersion: "vLLM 0.8.4",
    mode: "PD 分离模式",
    model: "InternVL2.5-8B",
    cluster: "华东训练集群 A",
    namespace: "vision-infer",
    serviceName: "vision-defect-pd",
    endpoint: buildInferenceEndpoint("vision-defect-pd", "vision-infer"),
    createdAt: "2026-04-25 10:16:03",
    createdBy: "视觉算法组",
    status: "扩缩容中",
    routePolicy: "图像请求按 Prefill 热点分桶",
    maxModelLen: "16384",
    maxNumSeqs: "128",
    kvCache: "BF16",
    routerReplicas: 2,
    routerMin: 2,
    routerMax: 6,
    routerSpec: "4C / 8GB",
    prefillReplicas: 4,
    prefillMin: 2,
    prefillMax: 8,
    prefillSpec: "H100 x2 / 160GB",
    decodeReplicas: 10,
    decodeMin: 6,
    decodeMax: 18,
    decodeSpec: "H100 x1 / 80GB",
    singleReplicas: 0,
    singleMin: 0,
    singleMax: 0,
    singleSpec: "",
    notes: "图片理解请求在工作日白天流量抬升，当前正在扩大 Decode 池保证持续吞吐。",
  },
  {
    id: "inf-203",
    name: "热线转写-single",
    framework: "vLLM",
    engineVersion: "vLLM 0.8.3",
    mode: "单机模式",
    model: "Qwen2.5-14B-Instruct",
    cluster: "政务专有集群 C",
    namespace: "speech-infer",
    serviceName: "speech-single",
    endpoint: buildInferenceEndpoint("speech-single", "speech-infer"),
    createdAt: "2026-04-25 10:28:44",
    createdBy: "语音平台组",
    status: "运行中",
    routePolicy: "单机直连",
    maxModelLen: "8192",
    maxNumSeqs: "64",
    kvCache: "FP16",
    routerReplicas: 0,
    routerMin: 0,
    routerMax: 0,
    routerSpec: "",
    prefillReplicas: 0,
    prefillMin: 0,
    prefillMax: 0,
    prefillSpec: "",
    decodeReplicas: 0,
    decodeMin: 0,
    decodeMax: 0,
    decodeSpec: "",
    singleReplicas: 2,
    singleMin: 2,
    singleMax: 4,
    singleSpec: "A800 x2 / 160GB",
    notes: "用于低并发专有环境验证，统一由单个 vLLM 服务承载 Prefill 与 Decode。",
  },
];

const initialClusters: Cluster[] = [
  {
    id: "cluster-east-train",
    name: "华东训练集群 A",
    region: "上海金桥 A 区",
    business: "千卡训练 / AllReduce 优先",
    status: "运行中",
    nodes: 96,
    accelerator: "768 x H100 80GB",
    latencyTarget: "< 3us 集群内延迟",
    configVersion: "v3.4",
    lastChanged: "2026-04-24 14:32",
    fabricPreference: "双平面",
    rdmaJobs: 42,
    network: {
      topology: "双活机房",
      primaryFabric: "IB",
      schedulerPolicy: "RDMA 优先调度",
      validationPolicy: "提交前校验",
      ib: {
        enabled: true,
        speed: "NDR 400Gb/s",
        subnetManager: "主备 SM + UFM",
        pKey: "0x8011",
        serviceLevel: 4,
        mtu: "4096",
        adaptiveRouting: true,
        trafficClass: "训练 AllReduce / Checkpoint Sync",
      },
      roce: {
        enabled: true,
        mode: "RoCE v2 L3",
        nicBond: "bond1 / 2x200G",
        pfcEnabled: true,
        pfcPriority: 3,
        ecnEnabled: true,
        ecnThreshold: "65% 队列占用触发 ECN",
        dscp: 26,
        mtu: "9000",
        gateway: "BGP EVPN + VXLAN 跨 AZ",
      },
    },
    nodePools: [
      {
        id: "np-east-train",
        name: "train-h100-pool",
        role: "训练",
        nodes: 64,
        accelerator: "H100",
        rdmaNic: "ConnectX-7 400G",
        networkPolicy: "IB 训练平面",
      },
      {
        id: "np-east-infer",
        name: "infer-mix-pool",
        role: "推理",
        nodes: 20,
        accelerator: "H100 / L40S",
        rdmaNic: "ConnectX-6 Dx 200G",
        networkPolicy: "双平面",
      },
      {
        id: "np-east-storage",
        name: "checkpoint-storage",
        role: "存储",
        nodes: 12,
        accelerator: "CPU",
        rdmaNic: "BlueField-2 200G",
        networkPolicy: "RoCE 业务平面",
      },
    ],
  },
  {
    id: "cluster-cross-cloud",
    name: "跨云推理集群 B",
    region: "上海 - 杭州 双云互联",
    business: "推理弹性 / 跨云流量回切",
    status: "运行中",
    nodes: 48,
    accelerator: "192 x L40S",
    latencyTarget: "< 50us 跨云网关延迟",
    configVersion: "v2.7",
    lastChanged: "2026-04-24 13:48",
    fabricPreference: "RoCE 优先",
    rdmaJobs: 18,
    network: {
      topology: "跨云互联",
      primaryFabric: "RoCE",
      schedulerPolicy: "跨云回落 RoCE",
      validationPolicy: "变更窗口校验",
      ib: {
        enabled: false,
        speed: "HDR 200Gb/s",
        subnetManager: "保留，不参与调度",
        pKey: "0x8021",
        serviceLevel: 2,
        mtu: "2048",
        adaptiveRouting: false,
        trafficClass: "仅保留本地维护窗口",
      },
      roce: {
        enabled: true,
        mode: "RoCE v2 L3",
        nicBond: "bond0 / 2x100G",
        pfcEnabled: true,
        pfcPriority: 4,
        ecnEnabled: true,
        ecnThreshold: "60% 队列占用触发 ECN",
        dscp: 32,
        mtu: "9000",
        gateway: "专线网关 + SRv6 隧道",
      },
    },
    nodePools: [
      {
        id: "np-cross-gateway",
        name: "gateway-pool",
        role: "跨云网关",
        nodes: 8,
        accelerator: "CPU",
        rdmaNic: "ConnectX-6 100G",
        networkPolicy: "RoCE 业务平面",
      },
      {
        id: "np-cross-infer",
        name: "roce-infer-pool",
        role: "推理",
        nodes: 32,
        accelerator: "L40S",
        rdmaNic: "ConnectX-6 Dx 100G",
        networkPolicy: "RoCE 业务平面",
      },
      {
        id: "np-cross-store",
        name: "feature-store-pool",
        role: "存储",
        nodes: 8,
        accelerator: "CPU",
        rdmaNic: "BlueField-2 100G",
        networkPolicy: "双平面",
      },
    ],
  },
  {
    id: "cluster-gov-ib",
    name: "政务专有集群 C",
    region: "苏州私有云 B 区",
    business: "专有训练 / 强隔离租户",
    status: "待校验",
    nodes: 32,
    accelerator: "256 x A800 80GB",
    latencyTarget: "< 5us 机房内延迟",
    configVersion: "v1.9",
    lastChanged: "2026-04-24 11:06",
    fabricPreference: "IB 优先",
    rdmaJobs: 9,
    network: {
      topology: "单数据中心",
      primaryFabric: "IB",
      schedulerPolicy: "按网络标签隔离",
      validationPolicy: "提交前校验",
      ib: {
        enabled: true,
        speed: "HDR 200Gb/s",
        subnetManager: "内置 SM 主备",
        pKey: "0x8031",
        serviceLevel: 3,
        mtu: "4096",
        adaptiveRouting: true,
        trafficClass: "训练 / 数据预热",
      },
      roce: {
        enabled: true,
        mode: "RoCE v2 L2",
        nicBond: "bond1 / 2x100G",
        pfcEnabled: true,
        pfcPriority: 3,
        ecnEnabled: true,
        ecnThreshold: "55% 队列占用触发 ECN",
        dscp: 24,
        mtu: "4200",
        gateway: "机房内 Leaf-Spine Lossless VLAN",
      },
    },
    nodePools: [
      {
        id: "np-gov-train",
        name: "secure-train-pool",
        role: "训练",
        nodes: 20,
        accelerator: "A800",
        rdmaNic: "ConnectX-6 200G",
        networkPolicy: "IB 训练平面",
      },
      {
        id: "np-gov-infer",
        name: "isolated-infer-pool",
        role: "推理",
        nodes: 8,
        accelerator: "A800",
        rdmaNic: "ConnectX-6 100G",
        networkPolicy: "双平面",
      },
      {
        id: "np-gov-store",
        name: "dataset-cache-pool",
        role: "存储",
        nodes: 4,
        accelerator: "CPU",
        rdmaNic: "BlueField-2 100G",
        networkPolicy: "RoCE 业务平面",
      },
    ],
  },
];

const clusterPlugins: ClusterPlugin[] = [
  {
    id: "plugin-scheduler-pro",
    name: "智能调度增强器",
    category: "platform",
    vendor: "PAI Platform",
    version: "v2.8.1",
    summary: "支持 Binpack、Spread、DRF、优先级抢占等策略的组合编排。",
    capability: "多调度算法编排",
    deployment: "scheduler-extension",
    status: "运行中",
    tags: ["调度", "抢占"],
  },
  {
    id: "plugin-rdma-gateway",
    name: "RDMA 网络控制器",
    category: "platform",
    vendor: "PAI Platform",
    version: "v1.9.4",
    summary: "统一下发 IB / RoCE 平面参数与节点标签，联动调度器完成落位。",
    capability: "高速网络编排",
    deployment: "network-controller",
    status: "运行中",
    tags: ["IB", "RoCE"],
  },
  {
    id: "plugin-gpu-slicer",
    name: "显存切分管理器",
    category: "platform",
    vendor: "PAI Platform",
    version: "v3.1.0",
    summary: "管理 GPU / NPU 切分档位、租户额度与规格生效流程。",
    capability: "GPU / NPU 切分",
    deployment: "gpu-slice-operator",
    status: "运行中",
    tags: ["vGPU", "vNPU"],
  },
  {
    id: "plugin-dataset-cache",
    name: "数据预热加速器",
    category: "platform",
    vendor: "PAI Platform",
    version: "v2.4.3",
    summary: "将热点模型和数据集预加载到节点 NVMe，提高训练任务启动速度。",
    capability: "本地缓存预热",
    deployment: "dataset-cache-agent",
    status: "已集成",
    tags: ["缓存", "NVMe"],
  },
  {
    id: "plugin-model-guard",
    name: "模型加密守护",
    category: "platform",
    vendor: "PAI Secure",
    version: "v1.7.6",
    summary: "支持 AES、SM4 等模型上传加密与部署口令校验。",
    capability: "模型安全",
    deployment: "model-guard",
    status: "运行中",
    tags: ["加密", "解密"],
  },
  {
    id: "plugin-content-shield",
    name: "内容安全编排器",
    category: "platform",
    vendor: "PAI Secure",
    version: "v2.0.2",
    summary: "对接敏感词、日志、第三方审核与拦截链路。",
    capability: "安全策略联动",
    deployment: "content-shield",
    status: "运行中",
    tags: ["安全", "审核"],
  },
  {
    id: "plugin-vscode-bridge",
    name: "远程开发连接器",
    category: "platform",
    vendor: "PAI DevX",
    version: "v1.5.8",
    summary: "一键拉起 VS Code Remote，打通实例、代码和终端。",
    capability: "远程研发",
    deployment: "dev-bridge",
    status: "已集成",
    tags: ["VS Code", "SSH"],
  },
  {
    id: "plugin-finetune-studio",
    name: "微调工作台",
    category: "platform",
    vendor: "PAI ModelOps",
    version: "v3.0.7",
    summary: "统一管理快速微调、专家微调、模板和训练回放。",
    capability: "训练管理",
    deployment: "finetune-studio",
    status: "运行中",
    tags: ["SFT", "LoRA"],
  },
  {
    id: "plugin-model-market",
    name: "模型资产运营中心",
    category: "platform",
    vendor: "PAI ModelOps",
    version: "v2.3.0",
    summary: "支持评分、评论、热度榜单和精选置顶策略。",
    capability: "模型运营",
    deployment: "model-market",
    status: "已集成",
    tags: ["运营", "市场"],
  },
  {
    id: "plugin-trace-audit",
    name: "全链路审计总线",
    category: "platform",
    vendor: "PAI Platform",
    version: "v1.6.5",
    summary: "归集配置变更、训练事件、共享授权和安全命中记录。",
    capability: "审计留痕",
    deployment: "audit-bus",
    status: "运行中",
    tags: ["审计", "追踪"],
  },
  {
    id: "plugin-app-space",
    name: "应用空间构建器",
    category: "platform",
    vendor: "PAI AppSpace",
    version: "v2.6.1",
    summary: "打通 Git、构建、在线预览、发布和版本回滚。",
    capability: "应用空间",
    deployment: "app-space-builder",
    status: "运行中",
    tags: ["Git", "发布"],
  },
  {
    id: "plugin-pd-router",
    name: "PD 分离路由器",
    category: "platform",
    vendor: "PAI Inference",
    version: "v1.2.9",
    summary: "管理 Prefill、Decode、Router 角色的扩缩容与流量路由。",
    capability: "推理架构编排",
    deployment: "pd-router",
    status: "可选安装",
    tags: ["推理", "Router"],
  },
  {
    id: "plugin-tenant-quota",
    name: "租户配额中心",
    category: "platform",
    vendor: "PAI Platform",
    version: "v2.2.4",
    summary: "集团到租户到工作空间的多级配额与授权分发。",
    capability: "多租户治理",
    deployment: "quota-center",
    status: "已集成",
    tags: ["租户", "配额"],
  },
  {
    id: "plugin-cni-calico",
    name: "Calico",
    category: "kubernetes",
    vendor: "Project Calico",
    version: "v3.29.2",
    summary: "提供网络策略、BGP 路由与工作负载隔离。",
    capability: "CNI / NetworkPolicy",
    deployment: "calico",
    status: "运行中",
    tags: ["CNI", "网络策略"],
  },
  {
    id: "plugin-cilium",
    name: "Cilium",
    category: "kubernetes",
    vendor: "Isovalent",
    version: "v1.17.3",
    summary: "基于 eBPF 的网络、可观测与服务治理能力。",
    capability: "eBPF 网络栈",
    deployment: "cilium",
    status: "可选安装",
    tags: ["eBPF", "Service Mesh"],
  },
  {
    id: "plugin-ingress-nginx",
    name: "Ingress NGINX",
    category: "kubernetes",
    vendor: "Kubernetes",
    version: "v1.12.1",
    summary: "为平台 API、控制台与模型服务提供统一入口暴露。",
    capability: "入口流量管理",
    deployment: "ingress-nginx",
    status: "运行中",
    tags: ["Ingress", "网关"],
  },
  {
    id: "plugin-cert-manager",
    name: "cert-manager",
    category: "kubernetes",
    vendor: "CNCF",
    version: "v1.17.1",
    summary: "自动签发和续期平台控制面与应用域名证书。",
    capability: "证书管理",
    deployment: "cert-manager",
    status: "已集成",
    tags: ["TLS", "证书"],
  },
  {
    id: "plugin-prometheus",
    name: "Prometheus Operator",
    category: "kubernetes",
    vendor: "CNCF",
    version: "v0.81.0",
    summary: "采集集群、节点、GPU、训练任务与服务指标。",
    capability: "指标监控",
    deployment: "prometheus-operator",
    status: "运行中",
    tags: ["监控", "Metrics"],
  },
  {
    id: "plugin-grafana",
    name: "Grafana",
    category: "kubernetes",
    vendor: "Grafana Labs",
    version: "v11.5.2",
    summary: "承载 GPU 利用率、TTFT、TPOT 与网络面板展示。",
    capability: "可视化大盘",
    deployment: "grafana",
    status: "运行中",
    tags: ["Dashboard", "告警"],
  },
  {
    id: "plugin-loki",
    name: "Loki",
    category: "kubernetes",
    vendor: "Grafana Labs",
    version: "v3.4.2",
    summary: "聚合平台控制面、训练作业和插件日志。",
    capability: "日志中心",
    deployment: "loki",
    status: "已集成",
    tags: ["日志", "检索"],
  },
  {
    id: "plugin-argo-workflows",
    name: "Argo Workflows",
    category: "kubernetes",
    vendor: "CNCF",
    version: "v3.6.7",
    summary: "编排数据处理、训练、评测和发布流水线。",
    capability: "工作流调度",
    deployment: "argo-workflows",
    status: "运行中",
    tags: ["Workflow", "Pipeline"],
  },
  {
    id: "plugin-argo-cd",
    name: "Argo CD",
    category: "kubernetes",
    vendor: "CNCF",
    version: "v2.14.9",
    summary: "统一管理平台组件和插件的 GitOps 发布。",
    capability: "GitOps 交付",
    deployment: "argo-cd",
    status: "已集成",
    tags: ["GitOps", "发布"],
  },
  {
    id: "plugin-volcano",
    name: "Volcano",
    category: "kubernetes",
    vendor: "CNCF",
    version: "v1.11.0",
    summary: "提供批任务、Gang Scheduling 与队列公平调度能力。",
    capability: "批调度增强",
    deployment: "volcano",
    status: "运行中",
    tags: ["批任务", "Gang"],
  },
  {
    id: "plugin-kubeflow",
    name: "Kubeflow Training Operator",
    category: "kubernetes",
    vendor: "Kubeflow",
    version: "v1.9.3",
    summary: "支撑分布式训练作业 CRD 和训练生命周期管理。",
    capability: "训练作业 CRD",
    deployment: "training-operator",
    status: "已集成",
    tags: ["Training", "Operator"],
  },
  {
    id: "plugin-keda",
    name: "KEDA",
    category: "kubernetes",
    vendor: "CNCF",
    version: "v2.17.0",
    summary: "根据队列长度、事件源和自定义指标进行弹性伸缩。",
    capability: "事件驱动伸缩",
    deployment: "keda",
    status: "运行中",
    tags: ["Autoscaling", "Event"],
  },
  {
    id: "plugin-longhorn",
    name: "Longhorn",
    category: "kubernetes",
    vendor: "SUSE",
    version: "v1.8.1",
    summary: "为模型缓存、流水线和应用提供分布式块存储。",
    capability: "分布式存储",
    deployment: "longhorn",
    status: "可选安装",
    tags: ["存储", "CSI"],
  },
  {
    id: "plugin-rook-ceph",
    name: "Rook Ceph",
    category: "kubernetes",
    vendor: "CNCF",
    version: "v1.16.6",
    summary: "为数据集、模型仓和检查点提供对象与块存储。",
    capability: "对象存储",
    deployment: "rook-ceph",
    status: "已集成",
    tags: ["Ceph", "对象存储"],
  },
];

const navigationSections: NavigationSection[] = [
  {
    id: "governance",
    label: "平台治理",
    items: [
      { path: "/", label: "平台总览", icon: Gauge },
      { path: "/cluster", label: "集群管理", icon: Network, scenario: "cluster" },
      { path: "/compute", label: "算力规格", icon: Cpu, scenario: "compute" },
      { path: "/scheduler", label: "调度器", icon: Workflow, scenario: "scheduler" },
      { path: "/tasks", label: "任务管理", icon: Archive, scenario: "tasks" },
    ],
  },
  {
    id: "data-governance",
    label: "数据治理",
    items: [
      { path: "/encryption", label: "模型加密", icon: LockKeyhole, scenario: "encryption" },
      { path: "/drive", label: "云盘管理", icon: HardDrive, scenario: "drive" },
      { path: "/datasets", label: "数据集管理", icon: Database, scenario: "datasets" },
      { path: "/market", label: "模型市场", icon: Share2, scenario: "market" },
      { path: "/safety", label: "敏感词策略", icon: ShieldAlert, scenario: "safety" },
    ],
  },
  {
    id: "delivery",
    label: "研发与交付",
    items: [
      { path: "/dev", label: "远程开发", icon: Code2, scenario: "dev" },
      { path: "/finetune", label: "模型微调", icon: BrainCircuit, scenario: "finetune" },
      { path: "/inference", label: "模型推理任务", icon: Boxes, scenario: "inference" },
      { path: "/space", label: "应用空间", icon: AppWindow, scenario: "space" },
      { path: "/cloud", label: "云原生应用", icon: Cloud, scenario: "cloud" },
    ],
  },
];

const navigation = navigationSections.flatMap((section) => section.items);

const openSourceModelCards: OpenSourceModelCard[] = Array.from({ length: 50 }, (_, index) => {
  const families = ["Qwen", "Llama", "DeepSeek", "Mistral", "Yi", "Baichuan", "InternLM", "Phi", "ChatGLM", "Gemma"];
  const providers = ["阿里云魔搭", "Meta", "DeepSeek AI", "Mistral AI", "零一万物", "百川智能", "上海 AI Lab", "Microsoft", "智谱 AI", "Google"];
  const highlights = [
    ["多轮问答", "指令跟随", "中文增强"],
    ["代码生成", "函数调用", "Agent 适配"],
    ["知识检索", "长上下文", "企业问答"],
    ["视觉理解", "多模态", "表格抽取"],
    ["推理增强", "安全对齐", "轻量部署"],
  ];
  const modelNo = index + 1;
  const family = families[index % families.length];
  const provider = providers[index % providers.length];
  const capability = highlights[index % highlights.length];
  const params = ["7B", "8B", "13B", "14B", "32B", "70B"][index % 6];
  const rating = Number((4.2 + (index % 5) * 0.12).toFixed(1));
  const heatScore = 128 - index;
  const downloads = 2400 + index * 67;
  const favorites = 320 + index * 13;
  const placementLevel: ModelMarketPlacementLevel = modelNo <= 2 ? "置顶" : modelNo <= 6 ? "精选" : "普通";
  const comments = [
    {
      id: `c-${modelNo}-1`,
      author: "平台运营员",
      role: "运营",
      content: `在 ${capability[0]} 场景的转化最好，最近一周热度持续提升，适合放入精选推荐位。`,
      createdAt: `2026-04-${String(24 - (index % 5)).padStart(2, "0")} 10:2${index % 6}`,
      likes: 12 + (index % 5) * 3,
    },
    {
      id: `c-${modelNo}-2`,
      author: "算法工程师",
      role: "用户",
      content: `${capability[1]} 能力稳定，文档和样例较完整，适合做标准化模型资产运营。`,
      createdAt: `2026-04-${String(23 - (index % 4)).padStart(2, "0")} 15:1${index % 7}`,
      likes: 8 + (index % 4) * 2,
    },
    {
      id: `c-${modelNo}-3`,
      author: "解决方案经理",
      role: "运营",
      content: `在 ${capability[2]} 方案宣讲里点击率较高，建议继续保留在行业专题页和热度榜单中。`,
      createdAt: `2026-04-${String(22 - (index % 3)).padStart(2, "0")} 11:4${index % 5}`,
      likes: 15 + (index % 6) * 2,
    },
    {
      id: `c-${modelNo}-4`,
      author: "租户管理员",
      role: "用户",
      content: `下载后上手成本低，评分和评论区的信息比较完整，方便团队判断模型价值。`,
      createdAt: `2026-04-${String(21 - (index % 4)).padStart(2, "0")} 17:0${index % 8}`,
      likes: 9 + (index % 5) * 2,
    },
  ];
  const reviewCount = family === "Qwen" && params === "7B" ? comments.length : 58 + index * 4;
  const placement: ModelMarketPlacement =
    placementLevel === "普通"
      ? {
          level: "普通",
          status: "未设置",
          channels: [],
          reason: "",
        }
      : {
          level: placementLevel,
          status: "已生效",
          channels: placementLevel === "置顶" ? ["市场首页", "搜索优先"] : ["市场首页", "专题推荐"],
          reason:
            placementLevel === "置顶"
              ? "适合作为高价值模型置顶展示，在浏览和搜索结果中优先触达。"
              : "文档、评分与转化表现稳定，适合作为精选推荐长期陈列。",
          applicant: "平台运营员",
          approver: "模型市场管理员",
          requestedAt: `2026-04-${String(18 + (index % 4)).padStart(2, "0")} 10:30:00`,
          approvedAt: `2026-04-${String(19 + (index % 4)).padStart(2, "0")} 15:20:00`,
          effectiveUntil: `2026-05-${String(8 + (index % 10)).padStart(2, "0")}`,
        };

  return {
    id: `osc-${String(modelNo).padStart(3, "0")}`,
    name: `${family}-${params}-Instruct`,
    family,
    provider,
    params,
    summary: `${provider} 开源模型，适合用于${capability[0]}、${capability[1]}与${capability[2]}等场景演示。`,
    highlights: capability,
    rating,
    reviewCount,
    heatScore,
    weeklyCalls: `${(18 + index * 0.8).toFixed(1)} 万次`,
    downloads,
    favorites,
    comments,
    placement,
  };
});

function nowTime() {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function nowDateTime() {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function toneClass(tone: Tone) {
  const map: Record<Tone, string> = {
    slate: "tone-slate",
    blue: "tone-blue",
    emerald: "tone-emerald",
    amber: "tone-amber",
    rose: "tone-rose",
    violet: "tone-violet",
    cyan: "tone-cyan",
  };
  return map[tone];
}

function resultTone(result: AuditEvent["result"]) {
  if (result === "成功") return "emerald";
  if (result === "处理中") return "blue";
  if (result === "拦截") return "rose";
  return "amber";
}

function behaviorTone(behavior: SensitiveBehavior): Tone {
  if (behavior === "拦截请求") return "rose";
  if (behavior === "替换敏感词") return "amber";
  if (behavior === "第三方安全服务") return "blue";
  return "emerald";
}

function categoryTone(category: SensitiveCategory): Tone {
  if (category === "涉密信息") return "rose";
  if (category === "账号凭据") return "amber";
  if (category === "个人隐私") return "violet";
  return "blue";
}

function cloudStatusTone(status: CloudNativeApp["status"]): Tone {
  if (status === "运行中") return "emerald";
  if (status === "已停止") return "slate";
  if (status === "扩缩容中") return "amber";
  if (status === "草稿") return "slate";
  return "blue";
}

function datasetPermissionScopeToVisibility(scope: DatasetPermissionScope): DatasetVisibility {
  if (scope === "个人") return "私有";
  if (scope === "租户") return "租户共享";
  return "公开";
}

function datasetVisibilityToPermissionScope(visibility: DatasetVisibility): DatasetPermissionScope {
  if (visibility === "私有") return "个人";
  if (visibility === "租户共享") return "租户";
  return "公开";
}

function datasetVisibilityTone(visibility: DatasetVisibility): Tone {
  if (visibility === "公开") return "cyan";
  if (visibility === "租户共享") return "emerald";
  return "amber";
}

function inferenceStatusTone(status: InferenceTaskStatus): Tone {
  if (status === "运行中") return "emerald";
  if (status === "扩缩容中") return "amber";
  if (status === "待调整") return "rose";
  return "blue";
}

function clusterStatusTone(status: ClusterStatus): Tone {
  if (status === "运行中") return "emerald";
  if (status === "配置变更中") return "blue";
  return "amber";
}

function pluginStatusTone(status: ClusterPlugin["status"]): Tone {
  if (status === "运行中") return "emerald";
  if (status === "安装中") return "blue";
  if (status === "卸载中") return "amber";
  if (status === "已集成") return "blue";
  return "amber";
}

function behaviorIcon(behavior: SensitiveBehavior): LucideIcon {
  if (behavior === "拦截请求") return StopCircle;
  if (behavior === "替换敏感词") return Wand2;
  if (behavior === "第三方安全服务") return Link;
  return FileText;
}

function deploymentTone(status: ModelAsset["status"]): Tone {
  if (status === "加密部署") return "emerald";
  if (status === "已部署") return "blue";
  if (status === "部署中" || status === "模型下载中" || status === "模型解密中" || status === "模型部署中") {
    return "amber";
  }
  return "slate";
}

function isDeploymentInProgress(status: ModelAsset["status"]) {
  return status === "部署中" || status === "模型下载中" || status === "模型解密中" || status === "模型部署中";
}

function formatBytes(bytes: number) {
  if (bytes <= 0) {
    return "0B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)}${units[index]}`;
}

function cloneSpecs(items: ResourceSpec[]) {
  return items.map((item) => ({ ...item, tenantBindings: cloneBindings(item.tenantBindings) }));
}

function clonePolicies(items: SecurityPolicy[]) {
  return items.map((item) => ({ ...item, words: [...item.words] }));
}

function cloneSensitiveWords(items: SensitiveWord[]) {
  return items.map((item) => ({ ...item }));
}

function cloneInstances(items: DevInstance[]) {
  return items.map((item) => ({ ...item }));
}

function cloneInferenceTasks(items: InferenceTask[]) {
  return items.map((item) => ({ ...item }));
}

function cloneClusters(items: Cluster[]) {
  return items.map((item) => ({
    ...item,
    network: {
      ...item.network,
      ib: { ...item.network.ib },
      roce: { ...item.network.roce },
    },
    nodePools: item.nodePools.map((pool) => ({ ...pool })),
  }));
}

function buildClusterPluginRuntimeState(clusters: Cluster[], plugins: ClusterPlugin[]) {
  return Object.fromEntries(
    clusters.map((cluster) => [
      cluster.id,
      Object.fromEntries(
        plugins.map((plugin) => [
          plugin.id,
          {
            status: plugin.status,
            progress: plugin.status === "运行中" || plugin.status === "已集成" ? 100 : 0,
            phase:
              plugin.status === "运行中"
                ? "插件运行正常，可执行升级或卸载。"
                : plugin.status === "已集成"
                  ? "已随平台纳管，可按需执行卸载。"
                  : "等待安装，尚未下发到当前集群。",
          } satisfies ClusterPluginRuntime,
        ]),
      ),
    ]),
  ) as Record<string, Record<string, ClusterPluginRuntime>>;
}

function buildDevInstanceIp(seed: number) {
  return `10.21.${18 + Math.floor(seed / 200)}.${20 + (seed % 200)}`;
}

function buildInferenceEndpoint(serviceName: string, namespace: string) {
  return `https://${serviceName}.${namespace}.svc.demo.local`;
}

function inferenceTotalReplicas(task: InferenceTask) {
  return task.mode === "PD 分离模式" ? task.routerReplicas + task.prefillReplicas + task.decodeReplicas : task.singleReplicas;
}

function inferenceAlertTone(level: InferenceMonitorAlert["level"]): Tone {
  if (level === "告警") return "rose";
  if (level === "提示") return "amber";
  return "emerald";
}

function buildInferenceLifecycleEvents(task: InferenceTask): InferenceLifecycleEvent[] {
  const totalReplicas = inferenceTotalReplicas(task);
  const rolloutResult: AuditEvent["result"] = task.status === "创建中" ? "处理中" : "成功";
  const statusDetail =
    task.status === "扩缩容中"
      ? "Decode 池正在滚动扩容，目标是压低高峰时段 P95。"
      : task.status === "待调整"
        ? "服务处于待调整窗口，允许执行重启、缩容和参数校验。"
        : "探针与副本状态稳定，最近 30 分钟未出现不可恢复失败。";

  return [
    {
      id: `${task.id}-event-created`,
      title: "任务创建",
      detail: `${task.createdBy} 提交 ${task.mode} 推理任务，服务名 ${task.serviceName}。`,
      time: task.createdAt,
      result: "成功",
    },
    {
      id: `${task.id}-event-rollout`,
      title: "版本下发",
      detail: `${task.framework} ${task.engineVersion} 已下发到 ${task.cluster}，当前总实例 ${totalReplicas}。`,
      time: "2026-04-25 11:18:06",
      result: rolloutResult,
    },
    {
      id: `${task.id}-event-health`,
      title: task.status === "扩缩容中" ? "弹性策略执行" : "健康巡检",
      detail: statusDetail,
      time: "2026-04-25 13:42:17",
      result: task.status === "扩缩容中" ? "处理中" : "成功",
    },
  ];
}

function buildInferenceMonitorSnapshot(task: InferenceTask, tick = 0): InferenceMonitorSnapshot {
  const seed = Number(task.id.replace(/\D/g, "")) || 1;
  const totalReplicas = inferenceTotalReplicas(task);
  const isPdMode = task.mode === "PD 分离模式";
  const statusFactor = task.status === "扩缩容中" ? 1.12 : task.status === "待调整" ? 0.46 : 1;
  const modeFactor = isPdMode ? 1.72 : 1;
  const wave = Math.sin((tick + (seed % 5)) / 2.6);
  const pressure = Math.cos((tick + seed) / 3.4);
  const qps = Math.round((36 + totalReplicas * 15 + (seed % 9) * 3) * modeFactor * statusFactor + wave * 18 + pressure * 9);
  const ttft = Math.round((isPdMode ? 390 : 650) + (seed % 7) * (isPdMode ? 24 : 36) + (task.status === "扩缩容中" ? 42 : 0) + Math.max(0, wave * 28));
  const e2e = Math.round(ttft + 760 + totalReplicas * (isPdMode ? 22 : 30) + Math.max(0, pressure * 34));
  const successRate = (99.82 + (seed % 5) * 0.03 - (task.status === "扩缩容中" ? 0.06 : 0) - Math.max(0, wave) * 0.03).toFixed(2);
  const gpuUtilization = Math.min(96, Math.max(42, Math.round((isPdMode ? 62 : 58) + totalReplicas * 1.8 + (seed % 7) + wave * 7)));
  const kvHitRate = Math.min(97, Number(((isPdMode ? 87.4 : 81.2) + (seed % 4) * 1.4 + pressure * 1.2).toFixed(1)));
  const inflight = Math.round(totalReplicas * (isPdMode ? 24 : 12) * statusFactor + 8 + (seed % 9) + wave * 10);
  const outputTokens = Math.round(qps * (isPdMode ? 74 : 41));
  const queueDepth = Math.max(2, Math.round((task.status === "扩缩容中" ? 18 : 7) + (seed % 6) + Math.max(0, wave * 6)));
  const trend = Array.from({ length: 8 }, (_, index) =>
    Math.max(
      18,
      Math.min(96, Math.round(42 + Math.sin((index + tick + (seed % 3)) / 1.7) * 13 + index * 3 + totalReplicas * (isPdMode ? 2.6 : 1.7))),
    ),
  );

  const roles: InferenceMonitorRole[] = isPdMode
    ? [
        {
          id: `${task.id}-router`,
          role: "Router",
          summary: "统一接入、租户分桶和 PD 路由分发。",
          replicas: `${task.routerReplicas}/${task.routerReplicas} Ready`,
          spec: task.routerSpec,
          qps: `${qps}`,
          latency: `${18 + (seed % 5)} ms`,
          utilization: `${48 + (seed % 12)}% CPU`,
          throughput: `${Math.round(qps * 1.02)} req/s`,
        },
        {
          id: `${task.id}-prefill`,
          role: "Prefill",
          summary: "首 Token 生成和长上下文预填充。",
          replicas: `${task.prefillReplicas}/${task.prefillReplicas} Ready`,
          spec: task.prefillSpec,
          qps: `${Math.round(qps * 0.64)}`,
          latency: `${ttft} ms TTFT`,
          utilization: `${Math.min(98, gpuUtilization + 6)}% GPU`,
          throughput: `${Math.round(outputTokens * 0.34)} tok/s`,
        },
        {
          id: `${task.id}-decode`,
          role: "Decode",
          summary: "续写吞吐承载和高并发稳定输出。",
          replicas: `${task.decodeReplicas}/${task.decodeReplicas} Ready`,
          spec: task.decodeSpec,
          qps: `${Math.round(qps * 0.92)}`,
          latency: `${e2e} ms P95`,
          utilization: `${gpuUtilization}% GPU`,
          throughput: `${outputTokens} tok/s`,
        },
      ]
    : [
        {
          id: `${task.id}-single`,
          role: "Single Service",
          summary: "单机统一服务，适合低并发验证与稳定性回归。",
          replicas: `${task.singleReplicas}/${task.singleReplicas} Ready`,
          spec: task.singleSpec,
          qps: `${qps}`,
          latency: `${e2e} ms P95`,
          utilization: `${gpuUtilization}% GPU`,
          throughput: `${outputTokens} tok/s`,
        },
      ];

  const alerts: InferenceMonitorAlert[] = [
    {
      id: `${task.id}-alert-1`,
      level: task.status === "扩缩容中" ? "提示" : "正常",
      title: task.status === "扩缩容中" ? "Decode 池扩容进行中" : "SLA 达标",
      detail:
        task.status === "扩缩容中"
          ? "最近 5 分钟并发抬升，HPA 已把 Decode 目标副本提升到上限区间内。"
          : `最近 30 分钟成功率 ${successRate}% ，未触发 SLO 告警。`,
      time: "2026-04-25 13:48:11",
    },
    {
      id: `${task.id}-alert-2`,
      level: isPdMode ? "提示" : "正常",
      title: isPdMode ? "Prefill GPU 利用率偏高" : "单机实例稳定",
      detail: isPdMode ? "Prefill 平均 GPU 利用率接近 90%，建议关注午高峰 TTFT 波动。" : "当前单机池无异常重启，探针成功率维持 100%。",
      time: "2026-04-25 13:36:42",
    },
    {
      id: `${task.id}-alert-3`,
      level: task.status === "待调整" ? "告警" : "正常",
      title: task.status === "待调整" ? "服务处于维护窗口" : "KV Cache 命中稳定",
      detail: task.status === "待调整" ? "当前任务处于待调整状态，外部流量建议保持只读或灰度。" : `KV Cache 命中率 ${kvHitRate}% ，续写吞吐稳定。`,
      time: "2026-04-25 13:28:09",
    },
  ];

  return {
    currentQps: `${qps}`,
    ttftP95: `${ttft} ms`,
    e2eP95: `${e2e} ms`,
    successRate: `${successRate}%`,
    gpuUtilization: `${gpuUtilization}%`,
    kvHitRate: `${kvHitRate}%`,
    inflightRequests: `${inflight}`,
    outputTokens: `${outputTokens} tok/s`,
    queueDepth: `${queueDepth}`,
    trend,
    roles,
    alerts,
    events: buildInferenceLifecycleEvents(task),
  };
}

function createDatasetAccessPolicy({
  visibility,
  modelTypes,
  industryScenarios,
  regions,
  orgStructures,
  tenantIds = [],
  tenantNames = [],
  effectiveUntil = "2026-12-31",
  watermarkPolicy,
  permissions,
}: {
  visibility: DatasetVisibility;
  modelTypes: string[];
  industryScenarios: string[];
  regions: string[];
  orgStructures: string[];
  tenantIds?: string[];
  tenantNames?: string[];
  effectiveUntil?: string;
  watermarkPolicy?: DatasetWatermarkPolicy;
  permissions?: DatasetAccessPolicy["permissions"];
}): DatasetAccessPolicy {
  const scope = datasetVisibilityToPermissionScope(visibility);

  return {
    scope,
    modelTypes,
    industryScenarios,
    regions,
    orgStructures,
    tenantIds,
    tenantNames,
    effectiveUntil,
    watermarkPolicy:
      watermarkPolicy ??
      (visibility === "公开" ? "实名下载水印" : visibility === "租户共享" ? "租户标识水印" : "关闭"),
    permissions:
      permissions ??
      (visibility === "私有"
        ? { read: true, edit: true, download: true, share: false }
        : visibility === "租户共享"
          ? { read: true, edit: false, download: true, share: true }
          : { read: true, edit: false, download: true, share: false }),
    updatedAt: "2026-04-25 09:30",
  };
}

function buildVsCodeDeeplink(ipAddress: string, instanceName: string) {
  return `vscode://vscode-remote/ssh-remote+root@${ipAddress}/workspace/projects/${instanceName}`;
}

function buildTerminalLine(kind: TerminalLine["kind"], text: string): TerminalLine {
  return {
    id: `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    text,
  };
}

function buildDevTerminalWelcome(instance: DevInstance) {
  return [
    buildTerminalLine("system", `Last login: 2026-04-24 15:18:22 from web-terminal-gateway on ${instance.name}`),
    buildTerminalLine("system", `Establishing secure tunnel for ${instance.name} ... connected`),
    buildTerminalLine("system", `Workspace mounted at /workspace/projects/${instance.name}`),
    buildTerminalLine("system", "Type `help` to view the fixed demo operations."),
  ];
}

function buildTerminalStatusLines(instance: DevInstance) {
  return [
    `instance: ${instance.name}`,
    `phase: ${instance.status}`,
    `sku: ${instance.skuType}`,
    `image: ${instance.imageType}`,
    `workspace: /workspace/projects/${instance.name}`,
    `ip: ${instance.ipAddress}`,
    `vscode deeplink: ${instance.status === "运行中" ? "ready" : "pending"}`,
  ];
}

function fineTuneStatusTone(status: FineTuneTaskStatus): Tone {
  if (status === "训练结束") return "emerald";
  if (status === "训练中") return "amber";
  if (status === "调度中") return "blue";
  return "slate";
}

function fineTuneStepIndex(status: FineTuneTaskStatus) {
  if (status === "调度中") return 1;
  if (status === "训练中") return 2;
  return 3;
}

function buildFineTuneLogLine(message: string) {
  return `${new Date().toLocaleTimeString("zh-CN", { hour12: false })} | ${message}`;
}

function buildFineTuneModelVersion(task: FineTuneTask): FineTuneModelVersion {
  return {
    name: task.outputModelName,
    version: `v2026.04.24-${task.id.slice(-3)}`,
    registry: `registry://finetune/${task.outputModelName}`,
    adapter: task.mode === "快速微调" ? "LoRA Adapter" : "Full SFT Checkpoint",
    quantization: task.mode === "快速微调" ? "INT4 Serving + LoRA Merge" : "BF16 Master + INT8 Serving",
    score: task.metric,
    owner: task.submittedBy,
    visibility: task.mode === "快速微调" ? "租户模型仓" : "专家模型仓",
    readyAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    tags: [task.baseModel, task.dataset, task.mode],
  };
}

function buildFineTunePlaybackScript(task: FineTuneTask) {
  const seed = Array.from(task.id).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const targetLines = 1000;
  const phases = ["prepare", "loader", "forward", "backward", "optimizer", "checkpoint", "eval", "export"];
  const actions = [
    "同步梯度桶并刷新优化器状态",
    "写入 tensorboard 标量与 profiler 样本",
    "执行验证集抽样评测与错误样本归档",
    "异步上传检查点到对象存储并写入索引",
    "更新训练编排心跳与资源看板",
    "回收低价值 checkpoint 并压缩日志切片",
    "刷新 tokenizer cache 与 prompt packing 队列",
    "同步模型仓元数据与服务标签",
  ];
  const introLines = [
    `[meta] job_id=${task.id} mode=${task.mode} owner=${task.submittedBy}`,
    `[meta] model=${task.baseModel}`,
    `[meta] datasets=${task.dataset}`,
    `[meta] resource=${task.resourceSpec}`,
    `[meta] output_model=${task.outputModelName}`,
    `[meta] current_metric=${task.metric}`,
    `[init] 挂载工作目录 /mnt/jobs/${task.id} 与输出目录 /mnt/models/${task.outputModelName}`,
    `[init] 拉取基础权重完成，校验散列、tokenizer 版本与 rope scaling 配置一致`,
    `[dataset] 构建训练索引、样本指纹缓存与多数据集路由表`,
    `[dataset] 读取数据集摘要: ${task.datasetSize}`,
    `[dataset] 执行去重、脏样本过滤、字段归一化与 prompt 展开`,
    `[dataset] 数据预处理完成，开始生成训练分片 shards=${task.mode === "专家微调" ? 32 : 16}`,
    `[runtime] precision=${task.hyperParams.precision} optimizer=${task.hyperParams.optimizer} scheduler=${task.hyperParams.scheduler}`,
    `[runtime] lr=${task.hyperParams.learningRate} epochs=${task.hyperParams.epochs} batch=${task.hyperParams.batchSize} grad_acc=${task.hyperParams.gradientAccumulation}`,
    `[runtime] max_seq_len=${task.hyperParams.maxSeqLength} warmup=${task.hyperParams.warmupRatio} deepspeed=${task.hyperParams.deepspeed}`,
    `[loader] dataloader warmup 完成，prefetch buffer 已建立`,
    `[loader] sample packing ready, dynamic bucket = ${task.mode === "专家微调" ? "8" : "4"}, pad ratio = ${(0.12 + (seed % 7) * 0.01).toFixed(2)}`,
    `[trainer] begin distributed launch, world_size=${task.hyperParams.gpuCount}, global_batch=${Number(task.hyperParams.batchSize) * Number(task.hyperParams.gradientAccumulation)}`,
    `[system] 训练事件总线已连接，metrics sink / audit sink / checkpoint sink 均可写`,
  ];

  const lines = [...introLines];
  for (let index = 1; lines.length < targetLines - 1; index += 1) {
    const step = 24 + index * 8;
    const phase = phases[index % phases.length];
    const throughput = 1760 + ((seed + index * 37) % 420);
    const gpu = 72 + ((seed + index * 11) % 24);
    const cpu = 34 + ((seed + index * 7) % 32);
    const loss = Math.max(0.118, 1.42 - index * 0.0047 + ((seed + index) % 3) * 0.003);
    const gradNorm = Math.max(0.11, 1.08 - index * 0.0022 + ((seed + index) % 5) * 0.004);
    const evalScore = Math.min(96.4, 71.8 + index * 0.025 + ((seed + index) % 4) * 0.08);
    const action = actions[(seed + index) % actions.length];

    if (index % 17 === 0) {
      lines.push(
        `[eval] step=${step} score=${evalScore.toFixed(2)} consistency=${(84 + (index % 10) * 0.9).toFixed(1)} safety_pass=${(98.2 + (index % 5) * 0.2).toFixed(1)}% latency=${82 + (index % 6) * 7}ms`,
      );
      continue;
    }

    if (index % 23 === 0) {
      lines.push(
        `[checkpoint] step=${step} name=autosave-${String(index).padStart(4, "0")} shard=${(index % 8) + 1}/${task.mode === "专家微调" ? 8 : 4} upload=done retention=keep_best action=${action}`,
      );
      continue;
    }

    if (index % 29 === 0) {
      lines.push(
        `[system] step=${step} gpu_util=${gpu}% cpu_util=${cpu}% throughput=${throughput} tok/s io_wait=${(1.2 + (index % 7) * 0.3).toFixed(1)}% action=${action}`,
      );
      continue;
    }

    lines.push(
      `[trainer] step=${step} phase=${phase} loss=${loss.toFixed(3)} grad_norm=${gradNorm.toFixed(3)} gpu_mem=${gpu}% throughput=${throughput} tok/s lr=${task.hyperParams.learningRate} action=${action}`,
    );
  }

  lines.push(
    task.status === "训练结束"
      ? `[done] 训练结束，最终指标 ${task.metric}，累计输出 ${lines.length + 1} 行日志，模型已可用于部署与发布`
      : `[watch] 训练仍在继续，已累计输出 ${lines.length + 1} 行历史日志，等待下一轮 step 与评测结果`,
  );

  return lines;
}

function buildFineTuneLiveTailLine(task: FineTuneTask, sequence: number) {
  const baseStep = 680 + sequence * 24;
  const loss = Math.max(0.182, 0.412 - sequence * 0.011);
  const gpu = 89 + (sequence % 5);
  const throughput = 1840 + (sequence % 7) * 66;
  const phases = [
    "同步梯度桶并刷新优化器状态",
    "写入 tensorboard 标量与离线回放指标",
    "执行验证集抽样评测与错误样本归档",
    "异步上传检查点至对象存储",
    "更新训练面板与任务编排心跳",
  ];

  return `[stream] step=${baseStep} loss=${loss.toFixed(3)} gpu_util=${gpu}% throughput=${throughput} tok/s action=${phases[sequence % phases.length]}`;
}

function buildTerminalLogs(instance: DevInstance, version: number) {
  const baseLogs = [
    "2026-04-24T15:18:22Z [info] code-server bootstrap completed",
    "2026-04-24T15:18:23Z [info] workspace volume mounted at /workspace/projects",
    `2026-04-24T15:18:25Z [info] instance ${instance.name} reported ${instance.status}`,
    `2026-04-24T15:18:27Z [info] ssh gateway bound to ${instance.ipAddress}`,
  ];

  if (version % 2 === 1) {
    return [
      ...baseLogs,
      "2026-04-24T15:21:04Z [info] vscode server heartbeat ok",
      "2026-04-24T15:21:06Z [info] extension host warmed: python, jupyter",
    ];
  }

  return [
    ...baseLogs,
    "2026-04-24T15:20:11Z [info] remote fs watcher ready",
    "2026-04-24T15:20:14Z [info] terminal attach session accepted",
  ];
}

function buildTerminalReadme(instance: DevInstance) {
  return [
    `# ${instance.name}`,
    "",
    `Runtime Image: ${instance.imageType}`,
    `SKU Type: ${instance.skuType}`,
    `Endpoint IP: ${instance.ipAddress}`,
    "Editor: VS Code Remote",
    "Entry: code .",
  ];
}

function createTerminalSession(instance: DevInstance): TerminalSession {
  return {
    cwd: `/workspace/projects/${instance.name}`,
    lines: buildDevTerminalWelcome(instance),
    logVersion: 0,
  };
}

function marketPlacementTone(placement: ModelMarketPlacement): Tone {
  if (placement.status === "待审批") return "amber";
  if (placement.status === "已生效" && placement.level === "置顶") return "rose";
  if (placement.status === "已生效" && placement.level === "精选") return "emerald";
  return "slate";
}

function marketPlacementPriority(model: OpenSourceModelCard) {
  if (model.placement.status !== "已生效") {
    return 0;
  }

  if (model.placement.level === "置顶") {
    return 2;
  }

  if (model.placement.level === "精选") {
    return 1;
  }

  return 0;
}

function marketPlacementLabel(placement: ModelMarketPlacement) {
  if (placement.status === "待审批") {
    return `${placement.level}待审批`;
  }

  if (placement.status === "已生效" && placement.level !== "普通") {
    return `${placement.level}生效`;
  }

  return "普通展示";
}

function defaultPlacementChannels(level: Exclude<ModelMarketPlacementLevel, "普通">): ModelMarketPlacementChannel[] {
  return level === "置顶" ? ["市场首页", "搜索优先"] : ["市场首页", "专题推荐"];
}

function placementChannelsLabel(channels: ModelMarketPlacementChannel[]) {
  return channels.length ? channels.join(" / ") : "未配置";
}

function cloneBindings(items: TenantBinding[]) {
  return items.map((item) => ({ ...item }));
}

function buildTenantLimitState(tenants: Tenant[], bindings: TenantBinding[], defaultTenantId?: string) {
  const state: Record<string, { enabled: boolean; limit: number }> = {};

  tenants.forEach((tenant) => {
    const matched = bindings.find((binding) => binding.tenantId === tenant.id);
    state[tenant.id] = matched
      ? { enabled: true, limit: matched.limit }
      : {
          enabled: tenant.id === defaultTenantId && bindings.length === 0,
          limit: tenant.id === defaultTenantId && bindings.length === 0 ? 8 : 0,
        };
  });

  return state;
}

function cloneDatasetCatalog(items: DatasetAsset[]) {
  return items.map((item) => ({
    ...item,
    tags: [...item.tags],
    consumers: [...item.consumers],
    accessPolicy: {
      ...item.accessPolicy,
      modelTypes: [...item.accessPolicy.modelTypes],
      industryScenarios: [...item.accessPolicy.industryScenarios],
      regions: [...item.accessPolicy.regions],
      orgStructures: [...item.accessPolicy.orgStructures],
      tenantIds: [...item.accessPolicy.tenantIds],
      tenantNames: [...item.accessPolicy.tenantNames],
      permissions: { ...item.accessPolicy.permissions },
    },
    versions: item.versions.map((version) => ({
      ...version,
      lineage: [...version.lineage],
      hyperParams: version.hyperParams.map((field) => ({ ...field })),
      metrics: version.metrics.map((field) => ({ ...field })),
      changeNotes: [...version.changeNotes],
    })),
  }));
}

function cloneMarketModels(items: OpenSourceModelCard[]) {
  return items.map((item) => ({
    ...item,
    highlights: [...item.highlights],
    comments: item.comments.map((comment) => ({ ...comment })),
    placement: {
      ...item.placement,
      channels: [...item.placement.channels],
    },
  }));
}

function parseSliceUnits(profile: string) {
  if (profile === "整卡") {
    return 1;
  }

  const matched = profile.match(/^(\d+)[a-z]\./i);
  return matched ? Number(matched[1]) : 1;
}

function acceleratorLabelForType(type: ResourceSpec["type"]) {
  return type.includes("NPU") ? "NPU" : "GPU";
}

function getSpecCapacity(spec: Pick<ResourceSpec, "type" | "acceleratorUnits" | "sliceProfile">, device?: AcceleratorDevice) {
  if (!device) {
    return 0;
  }

  if (!spec.type.startsWith("v")) {
    return Math.floor(device.inventory / Math.max(spec.acceleratorUnits, 1));
  }

  const sliceUnits = Math.max(parseSliceUnits(spec.sliceProfile), 1);
  const totalVirtualSlices = device.inventory * device.maxVirtualSlices;
  return Math.floor(totalVirtualSlices / Math.max(spec.acceleratorUnits * sliceUnits, 1));
}

function bumpConfigVersion(version: string) {
  const matched = version.match(/^v(\d+)\.(\d+)$/);
  if (!matched) {
    return version;
  }

  return `v${matched[1]}.${Number(matched[2]) + 1}`;
}

function findNavigationItem(pathname: string) {
  const exact = navigation.find((item) => item.path === pathname);
  if (exact) {
    return exact;
  }

  const nested = navigation.find((item) => item.path !== "/" && pathname.startsWith(`${item.path}/`));
  return nested ?? navigation[0];
}

function App() {
  const [tenantId, setTenantId] = useState("tenant-a");
  const [audit, setAudit] = useState<AuditEvent[]>(initialAudit);
  const [datasets, setDatasets] = useState<DatasetAsset[]>(() => cloneDatasetCatalog(initialDatasetCatalog));
  const [marketModels, setMarketModels] = useState<OpenSourceModelCard[]>(() => cloneMarketModels(openSourceModelCards));

  const selectedTenant = tenants.find((tenant) => tenant.id === tenantId) ?? tenants[1];

  const addAudit = (event: Omit<AuditEvent, "id" | "time">) => {
    setAudit((items) => [
      {
        ...event,
        id: `a-${Date.now()}`,
        time: nowTime(),
      },
      ...items,
    ].slice(0, 14));
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-slate-950">
      <ScrollToTop />
      <div className="app-shell">
        <Sidebar />
        <main className="min-w-0">
          <Topbar selectedTenant={selectedTenant} tenantId={tenantId} setTenantId={setTenantId} />
          <div className="content-wrap">
            <Routes>
              <Route path="/" element={<Dashboard audit={audit} />} />
              <Route path="/cluster" element={<ClusterPage addAudit={addAudit} />} />
              <Route path="/compute" element={<ComputePage tenant={selectedTenant} addAudit={addAudit} />} />
              <Route path="/encryption" element={<EncryptionPage addAudit={addAudit} />} />
              <Route path="/safety" element={<SafetyPage addAudit={addAudit} />} />
              <Route path="/dev" element={<DevInstancePage addAudit={addAudit} />} />
              <Route path="/finetune" element={<FineTunePage addAudit={addAudit} />} />
              <Route path="/inference" element={<InferenceTaskPage addAudit={addAudit} />} />
              <Route path="/tasks" element={<TaskManagementPage datasets={datasets} addAudit={addAudit} />} />
              <Route path="/drive" element={<DataManagementPage addAudit={addAudit} />} />
              <Route path="/datasets" element={<DatasetManagementPage datasets={datasets} setDatasets={setDatasets} addAudit={addAudit} />} />
              <Route path="/datasets/:datasetId" element={<DatasetDetailPage datasets={datasets} setDatasets={setDatasets} addAudit={addAudit} />} />
              <Route path="/market" element={<ModelMarketPage models={marketModels} addAudit={addAudit} />} />
              <Route path="/market/:modelId" element={<ModelMarketDetailPage models={marketModels} setModels={setMarketModels} addAudit={addAudit} />} />
              <Route path="/scheduler" element={<SchedulerPage addAudit={addAudit} />} />
              <Route path="/space" element={<AppSpacePage addAudit={addAudit} />} />
              <Route path="/cloud" element={<CloudNativePage addAudit={addAudit} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  return null;
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <div className="brand-mark">
          <Layers size={21} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-950">智算平台控制台</p>
          <p className="text-xs text-slate-500">统一算力与模型服务平台</p>
        </div>
      </div>

      <div className="nav-sections">
        {navigationSections.map((section) => (
          <section key={section.id} className="nav-section">
            <div className="nav-section-title">{section.label}</div>
            <nav className="nav-list" aria-label={section.label}>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) => `nav-item ${isActive ? "is-active" : ""}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.scenario && <CircleDot className="ml-auto text-slate-300" size={12} />}
                  </NavLink>
                );
              })}
            </nav>
          </section>
        ))}
      </div>
    </aside>
  );
}

function Topbar({
  selectedTenant,
  tenantId,
  setTenantId,
}: {
  selectedTenant: Tenant;
  tenantId: string;
  setTenantId: (id: string) => void;
}) {
  const location = useLocation();
  const active = findNavigationItem(location.pathname);
  const activeScenario = scenarios.find((scenario) => scenario.key === active.scenario);

  return (
    <header className="topbar">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>平台控制台</span>
          <ChevronRight size={14} />
          <span className="font-medium text-slate-700">{active.label}</span>
        </div>
        <h1 className="mt-1 text-xl font-semibold tracking-normal text-slate-950">
          {activeScenario?.title ?? "平台统一驾驶舱"}
        </h1>
      </div>
      <div className="topbar-actions">
        <label className="select-wrap">
          <Users size={16} />
          <select value={tenantId} onChange={(event) => setTenantId(event.target.value)}>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </select>
        </label>
        <div className="context-chip">
          <span>{selectedTenant.level}</span>
          <strong>{selectedTenant.gpu} GPU</strong>
        </div>
        <div className="user-chip" aria-label="当前登录用户">
          <div className="user-avatar">PA</div>
          <div className="user-meta">
            <strong>平台运营员</strong>
            <span>
              <CheckCircle2 size={12} />
              已登录
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Dashboard({ audit }: { audit: AuditEvent[] }) {
  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">企业级智算平台</span>
          <h2>面向算力治理、模型安全与应用交付的统一工作台</h2>
          <p>
            覆盖多租户算力配额、模型全链路安全、研发微调、云原生交付和模型资产运营，支撑从研发到部署再到共享运营的完整闭环。
          </p>
        </div>
        <div className="hero-metrics">
          <MetricCard icon={Cpu} label="异构算力纳管" value="2,128" unit="核 / 卡 / vGPU" tone="blue" />
          <MetricCard icon={LockKeyhole} label="加密模型资产" value="86" unit="个" tone="emerald" />
          <MetricCard icon={Rocket} label="运行中应用" value="24" unit="个" tone="amber" />
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard icon={Activity} label="GPU 平均利用率" value="78.4%" unit="近 24 小时" tone="blue" trend="+12.8%" />
        <MetricCard icon={ShieldAlert} label="安全策略命中" value="327" unit="次" tone="rose" trend="-4.1%" />
        <MetricCard icon={BrainCircuit} label="训练任务完成率" value="91.6%" unit="本周" tone="violet" trend="+7.2%" />
        <MetricCard icon={Share2} label="租户共享模型" value="143" unit="个" tone="emerald" trend="+18" />
      </section>

      <section className="module-board">
        <SectionHeader
          eyebrow="CORE CAPABILITIES"
          title="核心业务能力"
          description="覆盖平台治理、模型研发、应用部署与运营共享的关键流程。"
        />
        <div className="scenario-grid">
          {scenarios.filter((scenario) => scenario.featured !== false).map((scenario, index) => (
            <NavLink key={scenario.key} to={`/${scenario.key}`} className={`scenario-card ${toneClass(scenario.tone)}`}>
              <div className="flex items-start justify-between gap-3">
                <span className="scenario-index">{String(index + 1).padStart(2, "0")}</span>
                <ChevronRight size={18} />
              </div>
              <h3>{scenario.title}</h3>
              <p>{scenario.summary}</p>
              <div className="scenario-steps">
                {scenario.steps.slice(0, 3).map((step) => (
                  <span key={step}>{step}</span>
                ))}
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      <div className="two-column">
        <section className="surface-panel">
          <SectionHeader eyebrow="RESOURCE" title="租户资源治理快照" />
          <DataTable
            columns={["层级", "租户/空间", "CPU", "GPU", "vGPU"]}
            rows={tenants.map((tenant) => [
              tenant.level,
              tenant.name,
              `${tenant.cpu} 核`,
              `${tenant.gpu} 卡`,
              `${tenant.vgpu} 片`,
            ])}
          />
        </section>
        <section className="surface-panel">
          <SectionHeader eyebrow="AUDIT" title="最新审计动态" />
          <AuditList audit={audit.slice(0, 6)} />
        </section>
      </div>
    </div>
  );
}

function ClusterPage({ addAudit }: { addAudit: (event: Omit<AuditEvent, "id" | "time">) => void }) {
  const [clusters, setClusters] = useState<Cluster[]>(() => cloneClusters(initialClusters));
  const [selectedClusterId, setSelectedClusterId] = useState(initialClusters[0].id);
  const [pluginTab, setPluginTab] = useState<ClusterPluginTab>("platform");
  const [pluginRuntime, setPluginRuntime] = useState<Record<string, Record<string, ClusterPluginRuntime>>>(() =>
    buildClusterPluginRuntimeState(initialClusters, clusterPlugins),
  );
  const [editingClusterId, setEditingClusterId] = useState<string | null>(null);
  const [draftCluster, setDraftCluster] = useState<Cluster | null>(null);

  const selectedCluster = clusters.find((item) => item.id === selectedClusterId) ?? clusters[0];
  const runningCount = clusters.filter((item) => item.status === "运行中").length;
  const crossCloudCount = clusters.filter((item) => item.network.topology === "跨云互联").length;
  const totalRdmaJobs = clusters.reduce((sum, item) => sum + item.rdmaJobs, 0);
  const filteredPlugins = useMemo(
    () =>
      clusterPlugins
        .filter((item) => item.category === pluginTab)
        .map((item) => ({
          ...item,
          runtime: pluginRuntime[selectedCluster.id]?.[item.id] ?? {
            status: item.status,
            progress: item.status === "运行中" || item.status === "已集成" ? 100 : 0,
            phase: item.status === "可选安装" ? "等待安装，尚未下发到当前集群。" : "插件运行正常，可执行升级或卸载。",
          },
        })),
    [pluginRuntime, pluginTab, selectedCluster.id],
  );
  const platformPluginCount = clusterPlugins.filter((item) => item.category === "platform").length;
  const kubernetesPluginCount = clusterPlugins.filter((item) => item.category === "kubernetes").length;

  const updatePluginRuntime = (clusterId: string, pluginId: string, patch: Partial<ClusterPluginRuntime>) => {
    setPluginRuntime((current) => ({
      ...current,
      [clusterId]: {
        ...current[clusterId],
        [pluginId]: {
          ...current[clusterId][pluginId],
          ...patch,
        },
      },
    }));
  };

  const runPluginAction = (plugin: ClusterPlugin) => {
    const runtime = pluginRuntime[selectedCluster.id]?.[plugin.id];
    if (!runtime || runtime.status === "安装中" || runtime.status === "卸载中") {
      return;
    }

    const isInstall = runtime.status === "可选安装";
    const startStatus: ClusterPluginStatus = isInstall ? "安装中" : "卸载中";
    const finalStatus: ClusterPluginStatus = isInstall ? "运行中" : "可选安装";
    const steps = isInstall
      ? [
          { delay: 0, progress: 18, phase: "拉取 Helm Chart / Operator 镜像并校验版本依赖。" },
          { delay: 320, progress: 46, phase: "创建命名空间、ServiceAccount、CRD 与 RBAC 权限。" },
          { delay: 680, progress: 78, phase: "下发 Deployment / DaemonSet，等待控制器就绪。" },
          { delay: 1080, progress: 100, phase: "健康检查通过，插件已接入当前集群。" },
        ]
      : [
          { delay: 0, progress: 24, phase: "冻结插件入口，停止新请求与新调度。" },
          { delay: 320, progress: 52, phase: "删除控制器工作负载并回收附属配置。" },
          { delay: 680, progress: 82, phase: "清理 CRD、Webhook 与命名空间遗留对象。" },
          { delay: 1080, progress: 100, phase: "卸载完成，插件已从当前集群移除。" },
        ];

    updatePluginRuntime(selectedCluster.id, plugin.id, {
      status: startStatus,
      progress: steps[0].progress,
      phase: steps[0].phase,
    });
    addAudit({
      actor: "插件管理器",
      action: `${isInstall ? "开始安装" : "开始卸载"}插件`,
      target: `${selectedCluster.name} / ${plugin.name}`,
      result: "处理中",
    });

    steps.slice(1).forEach((step, index) => {
      window.setTimeout(() => {
        updatePluginRuntime(selectedCluster.id, plugin.id, {
          status: index === steps.length - 2 ? finalStatus : startStatus,
          progress: step.progress,
          phase: step.phase,
        });

        if (index === steps.length - 2) {
          addAudit({
            actor: "插件管理器",
            action: `${isInstall ? "安装完成" : "卸载完成"}插件`,
            target: `${selectedCluster.name} / ${plugin.name}`,
            result: "成功",
          });
        }
      }, step.delay);
    });
  };

  const openConfig = (clusterId: string) => {
    const target = clusters.find((item) => item.id === clusterId);
    if (!target) {
      return;
    }

    setEditingClusterId(clusterId);
    setDraftCluster(cloneClusters([target])[0]);
  };

  const closeConfig = () => {
    setEditingClusterId(null);
    setDraftCluster(null);
  };

  const updateDraftField = <K extends keyof Cluster>(key: K, value: Cluster[K]) => {
    setDraftCluster((current) => (current ? { ...current, [key]: value } : current));
  };

  const updateDraftNetwork = <K extends keyof ClusterNetworkConfig>(key: K, value: ClusterNetworkConfig[K]) => {
    setDraftCluster((current) => (current ? { ...current, network: { ...current.network, [key]: value } } : current));
  };

  const updateDraftIb = <K extends keyof ClusterNetworkConfig["ib"]>(key: K, value: ClusterNetworkConfig["ib"][K]) => {
    setDraftCluster((current) =>
      current
        ? {
            ...current,
            network: {
              ...current.network,
              ib: { ...current.network.ib, [key]: value },
            },
          }
        : current,
    );
  };

  const updateDraftRoce = <K extends keyof ClusterNetworkConfig["roce"]>(
    key: K,
    value: ClusterNetworkConfig["roce"][K],
  ) => {
    setDraftCluster((current) =>
      current
        ? {
            ...current,
            network: {
              ...current.network,
              roce: { ...current.network.roce, [key]: value },
            },
          }
        : current,
    );
  };

  const updateNodePoolPolicy = (poolId: string, networkPolicy: NodePoolFabricPolicy) => {
    setDraftCluster((current) =>
      current
        ? {
            ...current,
            nodePools: current.nodePools.map((pool) => (pool.id === poolId ? { ...pool, networkPolicy } : pool)),
          }
        : current,
    );
  };

  const validation = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!draftCluster) {
      return { errors, warnings };
    }

    if (draftCluster.network.primaryFabric === "IB" && !draftCluster.network.ib.enabled) {
      errors.push("主网络平面选择 IB 时，IB 配置必须处于启用状态。");
    }

    if (draftCluster.network.primaryFabric === "RoCE" && !draftCluster.network.roce.enabled) {
      errors.push("主网络平面选择 RoCE 时，RoCE 配置必须处于启用状态。");
    }

    if (draftCluster.fabricPreference === "双平面" && (!draftCluster.network.ib.enabled || !draftCluster.network.roce.enabled)) {
      errors.push("双平面模式要求 IB 与 RoCE 同时启用，分别承载训练与跨云/存储流量。");
    }

    if (draftCluster.network.topology === "跨云互联" && !draftCluster.network.roce.enabled) {
      errors.push("跨云互联场景至少需要启用 RoCE 平面，以便通过三层网络承载 RDMA 流量。");
    }

    if (draftCluster.network.ib.enabled && !draftCluster.network.ib.pKey.trim()) {
      errors.push("IB 平面需要配置 PKey 分区，保证训练作业与租户网络隔离。");
    }

    if (draftCluster.network.roce.enabled && !draftCluster.network.roce.pfcEnabled) {
      errors.push("RoCE 平面必须开启 PFC，才能为 RDMA 提供无损队列。");
    }

    if (draftCluster.network.roce.enabled && !draftCluster.network.roce.ecnEnabled) {
      warnings.push("RoCE 已启用但未开启 ECN，建议与 PFC 联动，避免单独依赖 PFC 造成头阻塞。");
    }

    if (draftCluster.network.primaryFabric === "IB" && draftCluster.network.topology === "跨云互联") {
      warnings.push("跨云链路通常不直接承载 IB，建议将跨云复制与回源流量落到 RoCE L3 平面。");
    }

    const primaryBound = draftCluster.nodePools.some((pool) =>
      pool.networkPolicy === "双平面" ||
      (draftCluster.network.primaryFabric === "IB" ? pool.networkPolicy === "IB 训练平面" : pool.networkPolicy === "RoCE 业务平面"),
    );

    if (!primaryBound) {
      errors.push("至少需要一个节点池绑定到主网络平面，否则调度器无法按照网络标签完成作业落位。");
    }

    return { errors, warnings };
  }, [draftCluster]);

  const applyClusterConfig = () => {
    if (!draftCluster || validation.errors.length > 0) {
      return;
    }

    const appliedAt = `2026-04-24 ${nowTime()}`;
    const nextVersion = bumpConfigVersion(draftCluster.configVersion);
    const updatingCluster = {
      ...cloneClusters([draftCluster])[0],
      configVersion: nextVersion,
      lastChanged: appliedAt,
      status: "配置变更中" as ClusterStatus,
    };

    setClusters((items) => items.map((item) => (item.id === updatingCluster.id ? updatingCluster : item)));
    addAudit({
      actor: "集群网络控制器",
      action: `提交${updatingCluster.network.primaryFabric} 主平面配置变更`,
      target: `${updatingCluster.name} / ${updatingCluster.fabricPreference}`,
      result: "处理中",
    });
    closeConfig();

    window.setTimeout(() => {
      setClusters((items) =>
        items.map((item) =>
          item.id === updatingCluster.id
            ? {
                ...updatingCluster,
                status: "运行中",
              }
            : item,
        ),
      );
      addAudit({
        actor: "集群网络控制器",
        action: "完成 IB / RoCE 网络策略下发",
        target: `${updatingCluster.name} / ${nextVersion}`,
        result: "成功",
      });
    }, 900);
  };

  return (
    <ModuleScaffold scenarioKey="cluster">
      <section className="surface-panel">
        <SectionHeader
          eyebrow="CLUSTER OVERVIEW"
          title="集群清单与 RDMA 网络编排"
          description="为训练、推理和跨云复制流量设计集群级网络平面，统一管理 IB 与 RoCE 配置并把策略下发到调度器。"
        />
        <div className="metric-grid">
          <MetricCard icon={Network} label="纳管集群" value={`${clusters.length}`} unit="个" tone="cyan" />
          <MetricCard icon={CheckCircle2} label="运行中集群" value={`${runningCount}`} unit="个" tone="emerald" />
          <MetricCard icon={Globe} label="跨云互联集群" value={`${crossCloudCount}`} unit="个" tone="blue" />
          <MetricCard icon={Workflow} label="RDMA 作业队列" value={`${totalRdmaJobs}`} unit="个" tone="amber" />
        </div>
      </section>

      <section className="surface-panel">
        <SectionHeader
          eyebrow="CLUSTER LIST"
          title="集群列表"
          description="Mock 三类典型集群：同城训练、跨云推理与专有域隔离。点击集群卡片查看生态插件页签，点击“集群配置”进入网络编排。"
        />
        <div className="cluster-list">
          {clusters.map((cluster) => (
            <article
              key={cluster.id}
              className={`cluster-card ${selectedCluster.id === cluster.id ? "selected" : ""}`}
              onClick={() => setSelectedClusterId(cluster.id)}
            >
              <div className="cluster-card-head">
                <div>
                  <span className="eyebrow">{cluster.region}</span>
                  <h3>{cluster.name}</h3>
                </div>
                <StatusBadge tone={clusterStatusTone(cluster.status)}>{cluster.status}</StatusBadge>
              </div>
              <p>{cluster.business}</p>
              <div className="cluster-card-tags">
                <span>{cluster.fabricPreference}</span>
                <span>{cluster.network.primaryFabric} 主平面</span>
                <span>{cluster.nodes} 节点</span>
              </div>
              <div className="cluster-card-meta">
                <span>{cluster.accelerator}</span>
                <span>{cluster.latencyTarget}</span>
                <span>{cluster.configVersion}</span>
              </div>
              <div className="cluster-card-footer">
                <strong>RDMA 作业 {cluster.rdmaJobs}</strong>
                <button
                  className="inline-action"
                  onClick={(event) => {
                    event.stopPropagation();
                    openConfig(cluster.id);
                  }}
                >
                  集群配置
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-panel safety-tab-shell">
        <div className="cluster-plugin-shell">
          <div className="cluster-plugin-header">
            <div>
              <span className="eyebrow">PLUGIN ECOSYSTEM</span>
              <h2>{selectedCluster.name} 插件生态</h2>
              <p>
                当前展示 {selectedCluster.name} 的插件视图，覆盖智算平台自有生态与 Kubernetes 生态组件，
                用于表达平台支持插件化管理自身和第三方组件的能力。
              </p>
            </div>
            <div className="cluster-plugin-meta">
              <MetricMini label="当前集群" value={selectedCluster.region} />
              <MetricMini label="平台插件" value={`${platformPluginCount}`} />
              <MetricMini label="K8s 插件" value={`${kubernetesPluginCount}`} />
            </div>
          </div>

          <div className="safety-tabs" role="tablist" aria-label="集群插件生态分类">
            <button
              className={pluginTab === "platform" ? "active" : ""}
              type="button"
              role="tab"
              aria-selected={pluginTab === "platform"}
              onClick={() => setPluginTab("platform")}
            >
              <Boxes size={16} />
              智算平台生态插件
            </button>
            <button
              className={pluginTab === "kubernetes" ? "active" : ""}
              type="button"
              role="tab"
              aria-selected={pluginTab === "kubernetes"}
              onClick={() => setPluginTab("kubernetes")}
            >
              <Cloud size={16} />
              Kubernetes 生态插件
            </button>
          </div>

          <div className="plugin-grid" role="tabpanel" aria-label={pluginTab === "platform" ? "智算平台生态插件" : "Kubernetes 生态插件"}>
            {filteredPlugins.map((plugin) => (
              <article key={plugin.id} className="plugin-card">
                <div className="plugin-card-head">
                  <div>
                    <span className="eyebrow">{plugin.vendor}</span>
                    <h3>{plugin.name}</h3>
                  </div>
                  <StatusBadge
                    tone={pluginStatusTone(plugin.runtime.status)}
                    animated={plugin.runtime.status === "安装中" || plugin.runtime.status === "卸载中"}
                  >
                    {plugin.runtime.status}
                  </StatusBadge>
                </div>
                <p>{plugin.summary}</p>
                <div className="plugin-card-strip">
                  <span>{plugin.capability}</span>
                  <span>{plugin.version}</span>
                  <span>{plugin.deployment}</span>
                </div>
                <div className="ft-tag-strip plugin-tag-strip">
                  {plugin.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="plugin-process-line">
                  <span>过程</span>
                  <strong>{plugin.runtime.phase}</strong>
                </div>
                <div className="plugin-progress-track">
                  <span style={{ width: `${plugin.runtime.progress}%` }} />
                </div>
                <div className="plugin-action-row">
                  <span>{plugin.runtime.progress}%</span>
                  <Button
                    variant="secondary"
                    icon={plugin.runtime.status === "可选安装" ? Plus : Minus}
                    onClick={() => runPluginAction(plugin)}
                    disabled={plugin.runtime.status === "安装中" || plugin.runtime.status === "卸载中"}
                  >
                    {plugin.runtime.status === "可选安装"
                      ? "安装"
                      : plugin.runtime.status === "安装中"
                        ? "安装中"
                        : plugin.runtime.status === "卸载中"
                          ? "卸载中"
                          : "卸载"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {editingClusterId && draftCluster ? (
        <div className="modal-backdrop" role="presentation" onClick={closeConfig}>
          <section
            className="modal-panel cluster-config-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cluster-config-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">CLUSTER CONFIG</span>
                <h3 id="cluster-config-title">集群配置</h3>
                <p>{draftCluster.name} · 配置 IB 与 RoCE 网络参数，并将网络平面绑定到节点池调度策略。</p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={closeConfig}>
                <X size={18} />
              </button>
            </div>

            <div className="allocation-summary compact">
              <KeyValue label="集群" value={draftCluster.name} />
              <KeyValue label="当前版本" value={draftCluster.configVersion} />
              <KeyValue label="主平面" value={draftCluster.network.primaryFabric} />
              <KeyValue label="拓扑" value={draftCluster.network.topology} />
            </div>

            <div className="form-grid three">
              <label className="field">
                <span>网络拓扑</span>
                <select value={draftCluster.network.topology} onChange={(event) => updateDraftNetwork("topology", event.target.value as ClusterNetworkConfig["topology"])}>
                  <option>单数据中心</option>
                  <option>双活机房</option>
                  <option>跨云互联</option>
                </select>
              </label>
              <label className="field">
                <span>平面策略</span>
                <select value={draftCluster.fabricPreference} onChange={(event) => updateDraftField("fabricPreference", event.target.value as FabricPreference)}>
                  <option>IB 优先</option>
                  <option>RoCE 优先</option>
                  <option>双平面</option>
                </select>
              </label>
              <label className="field">
                <span>主网络平面</span>
                <select value={draftCluster.network.primaryFabric} onChange={(event) => updateDraftNetwork("primaryFabric", event.target.value as FabricType)}>
                  <option>IB</option>
                  <option>RoCE</option>
                </select>
              </label>
              <label className="field">
                <span>调度策略</span>
                <select value={draftCluster.network.schedulerPolicy} onChange={(event) => updateDraftNetwork("schedulerPolicy", event.target.value as ClusterNetworkConfig["schedulerPolicy"])}>
                  <option>RDMA 优先调度</option>
                  <option>按网络标签隔离</option>
                  <option>跨云回落 RoCE</option>
                </select>
              </label>
              <label className="field">
                <span>校验策略</span>
                <select value={draftCluster.network.validationPolicy} onChange={(event) => updateDraftNetwork("validationPolicy", event.target.value as ClusterNetworkConfig["validationPolicy"])}>
                  <option>提交前校验</option>
                  <option>变更窗口校验</option>
                </select>
              </label>
              <div className="field readonly-field">
                <span>节点规模</span>
                <strong>{draftCluster.nodes} 节点 / {draftCluster.accelerator}</strong>
              </div>
            </div>

            {validation.errors.length > 0 ? (
              <div className="inline-notice warn">
                <strong>阻断项</strong>
                <span>{validation.errors.join("；")}</span>
              </div>
            ) : (
              <div className="inline-notice ok">
                <strong>校验结果</strong>
                <span>当前配置满足主平面、节点池绑定和无损网络要求，可以下发到调度器。</span>
              </div>
            )}
            {validation.warnings.length > 0 ? (
              <div className="inline-notice warn">
                <strong>设计提醒</strong>
                <span>{validation.warnings.join("；")}</span>
              </div>
            ) : null}

            <section className="cluster-config-section">
              <div className="section-header compact">
                <div>
                  <span className="eyebrow">IB FABRIC</span>
                  <h3>IB 网络配置</h3>
                  <p>适合同机房大规模训练，强调低延迟、低抖动与集合通信效率。</p>
                </div>
              </div>
              <div className="form-grid three">
                <label className="field">
                  <span>是否启用</span>
                  <select value={draftCluster.network.ib.enabled ? "true" : "false"} onChange={(event) => updateDraftIb("enabled", event.target.value === "true")}>
                    <option value="true">启用</option>
                    <option value="false">停用</option>
                  </select>
                </label>
                <label className="field">
                  <span>链路速率</span>
                  <select value={draftCluster.network.ib.speed} onChange={(event) => updateDraftIb("speed", event.target.value)}>
                    <option>NDR 400Gb/s</option>
                    <option>HDR 200Gb/s</option>
                    <option>EDR 100Gb/s</option>
                  </select>
                </label>
                <label className="field">
                  <span>SM 高可用</span>
                  <select value={draftCluster.network.ib.subnetManager} onChange={(event) => updateDraftIb("subnetManager", event.target.value)}>
                    <option>主备 SM + UFM</option>
                    <option>内置 SM 主备</option>
                    <option>外部 UFM 托管</option>
                  </select>
                </label>
                <label className="field">
                  <span>PKey 分区</span>
                  <input value={draftCluster.network.ib.pKey} onChange={(event) => updateDraftIb("pKey", event.target.value)} />
                </label>
                <label className="field">
                  <span>Service Level</span>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={draftCluster.network.ib.serviceLevel}
                    onChange={(event) => updateDraftIb("serviceLevel", Number(event.target.value))}
                  />
                </label>
                <label className="field">
                  <span>MTU</span>
                  <select value={draftCluster.network.ib.mtu} onChange={(event) => updateDraftIb("mtu", event.target.value)}>
                    <option>4096</option>
                    <option>2048</option>
                  </select>
                </label>
                <label className="field">
                  <span>自适应路由</span>
                  <select value={draftCluster.network.ib.adaptiveRouting ? "true" : "false"} onChange={(event) => updateDraftIb("adaptiveRouting", event.target.value === "true")}>
                    <option value="true">开启</option>
                    <option value="false">关闭</option>
                  </select>
                </label>
                <label className="field cluster-span-2">
                  <span>推荐承载业务</span>
                  <input value={draftCluster.network.ib.trafficClass} onChange={(event) => updateDraftIb("trafficClass", event.target.value)} />
                </label>
              </div>
            </section>

            <section className="cluster-config-section">
              <div className="section-header compact">
                <div>
                  <span className="eyebrow">ROCE FABRIC</span>
                  <h3>RoCE 网络配置</h3>
                  <p>适合跨机房、跨云或三层网络场景，强调无损队列、ECN 与网关互联能力。</p>
                </div>
              </div>
              <div className="form-grid three">
                <label className="field">
                  <span>是否启用</span>
                  <select value={draftCluster.network.roce.enabled ? "true" : "false"} onChange={(event) => updateDraftRoce("enabled", event.target.value === "true")}>
                    <option value="true">启用</option>
                    <option value="false">停用</option>
                  </select>
                </label>
                <label className="field">
                  <span>RoCE 模式</span>
                  <select value={draftCluster.network.roce.mode} onChange={(event) => updateDraftRoce("mode", event.target.value as ClusterNetworkConfig["roce"]["mode"])}>
                    <option>RoCE v2 L2</option>
                    <option>RoCE v2 L3</option>
                  </select>
                </label>
                <label className="field">
                  <span>网卡 Bond</span>
                  <input value={draftCluster.network.roce.nicBond} onChange={(event) => updateDraftRoce("nicBond", event.target.value)} />
                </label>
                <label className="field">
                  <span>PFC</span>
                  <select value={draftCluster.network.roce.pfcEnabled ? "true" : "false"} onChange={(event) => updateDraftRoce("pfcEnabled", event.target.value === "true")}>
                    <option value="true">开启</option>
                    <option value="false">关闭</option>
                  </select>
                </label>
                <label className="field">
                  <span>PFC 优先级</span>
                  <input
                    type="number"
                    min={0}
                    max={7}
                    value={draftCluster.network.roce.pfcPriority}
                    onChange={(event) => updateDraftRoce("pfcPriority", Number(event.target.value))}
                  />
                </label>
                <label className="field">
                  <span>ECN</span>
                  <select value={draftCluster.network.roce.ecnEnabled ? "true" : "false"} onChange={(event) => updateDraftRoce("ecnEnabled", event.target.value === "true")}>
                    <option value="true">开启</option>
                    <option value="false">关闭</option>
                  </select>
                </label>
                <label className="field">
                  <span>ECN 阈值</span>
                  <input value={draftCluster.network.roce.ecnThreshold} onChange={(event) => updateDraftRoce("ecnThreshold", event.target.value)} />
                </label>
                <label className="field">
                  <span>DSCP</span>
                  <input
                    type="number"
                    min={0}
                    max={63}
                    value={draftCluster.network.roce.dscp}
                    onChange={(event) => updateDraftRoce("dscp", Number(event.target.value))}
                  />
                </label>
                <label className="field">
                  <span>MTU</span>
                  <select value={draftCluster.network.roce.mtu} onChange={(event) => updateDraftRoce("mtu", event.target.value)}>
                    <option>9000</option>
                    <option>4200</option>
                  </select>
                </label>
                <label className="field cluster-span-3">
                  <span>跨域网关 / Overlay</span>
                  <input value={draftCluster.network.roce.gateway} onChange={(event) => updateDraftRoce("gateway", event.target.value)} />
                </label>
              </div>
            </section>

            <section className="cluster-config-section">
              <div className="section-header compact">
                <div>
                  <span className="eyebrow">NODE POLICY</span>
                  <h3>节点池绑定</h3>
                  <p>训练池一般绑定 IB，存储/跨云网关绑定 RoCE，推理池可按业务选择双平面。</p>
                </div>
              </div>
              <div className="cluster-edit-pool-list">
                {draftCluster.nodePools.map((pool) => (
                  <div key={pool.id} className="cluster-edit-pool-row">
                    <div>
                      <strong>{pool.name}</strong>
                      <span>{pool.role} · {pool.nodes} 节点 · {pool.rdmaNic}</span>
                    </div>
                    <label className="field">
                      <span>网络绑定</span>
                      <select value={pool.networkPolicy} onChange={(event) => updateNodePoolPolicy(pool.id, event.target.value as NodePoolFabricPolicy)}>
                        <option>IB 训练平面</option>
                        <option>RoCE 业务平面</option>
                        <option>双平面</option>
                      </select>
                    </label>
                  </div>
                ))}
              </div>
            </section>

            <LogPanel
              title="配置草案预览"
              lines={[
                `cluster=${draftCluster.name}`,
                `fabric_preference=${draftCluster.fabricPreference}`,
                `primary_fabric=${draftCluster.network.primaryFabric}`,
                `ib_enabled=${draftCluster.network.ib.enabled}`,
                `roce_enabled=${draftCluster.network.roce.enabled}`,
                `scheduler_policy=${draftCluster.network.schedulerPolicy}`,
                `node_pools=${draftCluster.nodePools.map((pool) => `${pool.name}:${pool.networkPolicy}`).join(", ")}`,
              ]}
            />

            <div className="modal-actions">
              <Button variant="ghost" onClick={closeConfig}>
                取消
              </Button>
              <Button variant="secondary" icon={Workflow} onClick={applyClusterConfig} disabled={validation.errors.length > 0}>
                生效配置
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </ModuleScaffold>
  );
}

function ComputePage({ tenant, addAudit }: { tenant: Tenant; addAudit: (event: Omit<AuditEvent, "id" | "time">) => void }) {
  const deviceCatalog: AcceleratorDevice[] = [
    {
      id: "nvidia-a100-80g",
      name: "NVIDIA A100 80GB",
      vendor: "NVIDIA",
      architecture: "Ampere",
      memory: "80GB HBM2e",
      interconnect: "NVLink / PCIe",
      inventory: 24,
      unitLabel: "GPU",
      maxVirtualSlices: 7,
      sliceProfiles: ["整卡", "1g.10gb", "2g.20gb", "3g.40gb", "7g.80gb"],
      supportedModes: ["GPU", "vGPU"],
    },
    {
      id: "nvidia-a800-80g",
      name: "NVIDIA A800 80GB",
      vendor: "NVIDIA",
      architecture: "Ampere",
      memory: "80GB HBM2e",
      interconnect: "NVLink / PCIe",
      inventory: 20,
      unitLabel: "GPU",
      maxVirtualSlices: 7,
      sliceProfiles: ["整卡", "1g.10gb", "2g.20gb", "3g.40gb", "7g.80gb"],
      supportedModes: ["GPU", "vGPU"],
    },
    {
      id: "nvidia-h100-80g",
      name: "NVIDIA H100 80GB",
      vendor: "NVIDIA",
      architecture: "Hopper",
      memory: "80GB HBM3",
      interconnect: "NVLink 4",
      inventory: 12,
      unitLabel: "GPU",
      maxVirtualSlices: 7,
      sliceProfiles: ["整卡", "1g.10gb", "2g.20gb", "3g.40gb", "7g.80gb"],
      supportedModes: ["GPU", "vGPU"],
    },
    {
      id: "nvidia-h200-141g",
      name: "NVIDIA H200 141GB",
      vendor: "NVIDIA",
      architecture: "Hopper",
      memory: "141GB HBM3e",
      interconnect: "NVLink 4",
      inventory: 16,
      unitLabel: "GPU",
      maxVirtualSlices: 8,
      sliceProfiles: ["整卡", "1g.17gb", "2g.35gb", "4g.70gb", "8g.141gb"],
      supportedModes: ["GPU", "vGPU"],
    },
    {
      id: "nvidia-l40s-48g",
      name: "NVIDIA L40S 48GB",
      vendor: "NVIDIA",
      architecture: "Ada Lovelace",
      memory: "48GB GDDR6",
      interconnect: "PCIe 4.0",
      inventory: 28,
      unitLabel: "GPU",
      maxVirtualSlices: 8,
      sliceProfiles: ["整卡", "1q.6gb", "2q.12gb", "4q.24gb", "8q.48gb"],
      supportedModes: ["GPU", "vGPU"],
    },
    {
      id: "nvidia-a30-24g",
      name: "NVIDIA A30 24GB",
      vendor: "NVIDIA",
      architecture: "Ampere",
      memory: "24GB HBM2",
      interconnect: "PCIe 4.0",
      inventory: 36,
      unitLabel: "GPU",
      maxVirtualSlices: 4,
      sliceProfiles: ["整卡", "1g.6gb", "2g.12gb", "4g.24gb"],
      supportedModes: ["GPU", "vGPU"],
    },
    {
      id: "ascend-910b",
      name: "昇腾 910B",
      vendor: "华为昇腾",
      architecture: "Da Vinci",
      memory: "64GB HBM",
      interconnect: "HCCS",
      inventory: 32,
      unitLabel: "NPU",
      maxVirtualSlices: 8,
      sliceProfiles: ["整卡", "1c.8gb", "2c.16gb", "4c.32gb", "8c.64gb"],
      supportedModes: ["NPU", "vNPU"],
    },
    {
      id: "ascend-910c",
      name: "昇腾 910C",
      vendor: "华为昇腾",
      architecture: "Da Vinci",
      memory: "128GB HBM",
      interconnect: "HCCS",
      inventory: 16,
      unitLabel: "NPU",
      maxVirtualSlices: 8,
      sliceProfiles: ["整卡", "1c.16gb", "2c.32gb", "4c.64gb", "8c.128gb"],
      supportedModes: ["NPU", "vNPU"],
    },
    {
      id: "ascend-310p",
      name: "昇腾 310P",
      vendor: "华为昇腾",
      architecture: "Da Vinci",
      memory: "16GB LPDDR4X",
      interconnect: "PCIe 4.0",
      inventory: 48,
      unitLabel: "NPU",
      maxVirtualSlices: 4,
      sliceProfiles: ["整卡", "1c.4gb", "2c.8gb", "4c.16gb"],
      supportedModes: ["NPU", "vNPU"],
    },
  ];

  const initialSpecs: ResourceSpec[] = [
    {
      id: "rs-001",
      name: "a100-train-standard",
      type: "GPU",
      deviceId: "nvidia-a100-80g",
      deviceName: "NVIDIA A100 80GB",
      vendor: "NVIDIA",
      architecture: "Ampere",
      cpu: 32,
      memory: 256,
      acceleratorUnits: 4,
      sliceProfile: "整卡",
      tenantBindings: [
        { tenantId: "tenant-a", tenantName: "智能制造租户", tenantLevel: "租户", limit: 4 },
        { tenantId: "workspace-a", tenantName: "大模型研发空间", tenantLevel: "工作空间", limit: 2 },
      ],
      tenantLimit: 6,
      scope: "智能制造租户、大模型研发空间",
      status: "已生效",
    },
    {
      id: "rs-002",
      name: "ascend-910b-vnpu-balanced",
      type: "vNPU",
      deviceId: "ascend-910b",
      deviceName: "昇腾 910B",
      vendor: "华为昇腾",
      architecture: "Da Vinci",
      cpu: 16,
      memory: 96,
      acceleratorUnits: 2,
      sliceProfile: "2c.16gb",
      tenantBindings: [
        { tenantId: "tenant-b", tenantName: "城市治理租户", tenantLevel: "租户", limit: 18 },
        { tenantId: "workspace-a", tenantName: "大模型研发空间", tenantLevel: "工作空间", limit: 6 },
      ],
      tenantLimit: 24,
      scope: "城市治理租户、大模型研发空间",
      status: "已生效",
    },
    {
      id: "rs-003",
      name: "h200-vgpu-inference",
      type: "vGPU",
      deviceId: "nvidia-h200-141g",
      deviceName: "NVIDIA H200 141GB",
      vendor: "NVIDIA",
      architecture: "Hopper",
      cpu: 16,
      memory: 96,
      acceleratorUnits: 1,
      sliceProfile: "1g.17gb",
      tenantBindings: [{ tenantId: "tenant-b", tenantName: "城市治理租户", tenantLevel: "租户", limit: 18 }],
      tenantLimit: 18,
      scope: "城市治理租户",
      status: "已生效",
    },
  ];
  const assignableTenants = tenants.filter((item) => item.level !== "集团");
  const defaultTenant = tenant.level === "集团" ? assignableTenants[0] : tenant;
  const initialDraftName = "a100-custom-sku";
  const initialDeviceId = "nvidia-a100-80g";
  const initialMode: ResourceSpec["type"] = "vGPU";
  const initialCpu = 24;
  const initialMemory = 128;
  const initialUnits = 2;
  const [specs, setSpecs] = useState<ResourceSpec[]>(() => cloneSpecs(initialSpecs));
  const [draftName, setDraftName] = useState(initialDraftName);
  const [selectedDeviceId, setSelectedDeviceId] = useState(initialDeviceId);
  const [draftMode, setDraftMode] = useState<ResourceSpec["type"]>(initialMode);
  const [draftCpu, setDraftCpu] = useState(initialCpu);
  const [draftMemory, setDraftMemory] = useState(initialMemory);
  const [draftUnits, setDraftUnits] = useState(initialUnits);
  const [selectedSpecId, setSelectedSpecId] = useState(initialSpecs[0].id);
  const [selectedSliceProfile, setSelectedSliceProfile] = useState("2g.20gb");
  const [isSkuConfigOpen, setIsSkuConfigOpen] = useState(false);
  const [isDeliveryDrawerOpen, setIsDeliveryDrawerOpen] = useState(false);
  const [tenantLimits, setTenantLimits] = useState<Record<string, { enabled: boolean; limit: number }>>(() =>
    buildTenantLimitState(assignableTenants, initialSpecs[0].tenantBindings, defaultTenant?.id),
  );

  const selectedDevice = deviceCatalog.find((item) => item.id === selectedDeviceId) ?? deviceCatalog[0];
  const selectedSpec = specs.find((item) => item.id === selectedSpecId) ?? specs[0];
  const policyState = selectedSpec?.status ?? "草稿";
  const selectedSpecDevice = deviceCatalog.find((item) => item.id === selectedSpec?.deviceId);
  const draftCapacity = getSpecCapacity(
    { type: draftMode, acceleratorUnits: draftUnits, sliceProfile: draftMode.startsWith("v") ? selectedSliceProfile : "整卡" },
    selectedDevice,
  );
  const selectedSpecCapacity = selectedSpec ? getSpecCapacity(selectedSpec, selectedSpecDevice) : 0;
  const draftAssignedLimit = useMemo(
    () =>
      Object.values(tenantLimits)
        .filter((item) => item.enabled)
        .reduce((sum, item) => sum + Math.max(item.limit, 0), 0),
    [tenantLimits],
  );
  const remainingCapacity = Math.max(selectedSpecCapacity - draftAssignedLimit, 0);
  const publishDisabled = policyState === "下发中" || draftAssignedLimit === 0 || draftAssignedLimit > selectedSpecCapacity;
  const selectedBindings = selectedSpec?.tenantBindings ?? [];
  const deliveryProgress = policyState === "已生效" ? 100 : policyState === "下发中" ? 64 : 18;
  const deliverySummary =
    policyState === "已生效"
      ? "资源调度器已完成租户额度下发，实例创建准入策略已正式生效。"
      : policyState === "下发中"
        ? "系统正在校验切分能力并下发租户准入额度，请稍候。"
        : "当前 SKU 尚未开始下发，完成租户额度配置后可执行生效。";

  useEffect(() => {
    if (!selectedDevice.supportedModes.includes(draftMode)) {
      setDraftMode(selectedDevice.supportedModes[0]);
    }
    if (!selectedDevice.sliceProfiles.includes(selectedSliceProfile)) {
      setSelectedSliceProfile(selectedDevice.sliceProfiles[0]);
    }
  }, [selectedDevice, draftMode, selectedSliceProfile]);

  useEffect(() => {
    if (!selectedSpec) {
      setTenantLimits(buildTenantLimitState(assignableTenants, [], defaultTenant?.id));
      return;
    }
    setTenantLimits(buildTenantLimitState(assignableTenants, selectedSpec.tenantBindings, defaultTenant?.id));
  }, [selectedSpecId, specs, tenant.id]);

  const addSpec = () => {
    const acceleratorLabel = acceleratorLabelForType(draftMode);
    if (!draftName.trim()) {
      addAudit({ actor: "平台运营员", action: "创建规格失败，名称为空", target: selectedDevice.name, result: "告警" });
      return;
    }
    if (draftCapacity <= 0) {
      addAudit({ actor: "平台运营员", action: "创建规格失败，规格超出库存能力", target: selectedDevice.name, result: "告警" });
      return;
    }
    const next: ResourceSpec = {
      id: `rs-${Date.now()}`,
      name: draftName.trim(),
      type: draftMode,
      deviceId: selectedDevice.id,
      deviceName: selectedDevice.name,
      vendor: selectedDevice.vendor,
      architecture: selectedDevice.architecture,
      cpu: draftCpu,
      memory: draftMemory,
      acceleratorUnits: draftUnits,
      sliceProfile: draftMode.startsWith("v") ? selectedSliceProfile : "整卡",
      tenantBindings: [],
      tenantLimit: 0,
      scope: "未关联租户",
      status: "草稿",
    };
    setSpecs((items) => [next, ...items]);
    setSelectedSpecId(next.id);
    setTenantLimits(buildTenantLimitState(assignableTenants, [], defaultTenant?.id));
    addAudit({
      actor: "平台运营员",
      action: `创建自定义 ${draftMode} 规格`,
      target: `${selectedDevice.name} / ${acceleratorLabel} / 最大可建 ${draftCapacity} 个`,
      result: "处理中",
    });
  };

  const publishPolicy = () => {
    if (!selectedSpec) {
      return;
    }
    const bindings = assignableTenants
      .map((item) => ({
        tenantId: item.id,
        tenantName: item.name,
        tenantLevel: item.level,
        limit: tenantLimits[item.id]?.limit ?? 0,
        enabled: tenantLimits[item.id]?.enabled ?? false,
      }))
      .filter((item) => item.enabled && item.limit > 0)
      .map(({ enabled: _enabled, ...binding }) => binding);

    if (bindings.length === 0) {
      addAudit({ actor: "资源调度器", action: "下发规格失败，未配置租户额度", target: selectedSpec.name, result: "告警" });
      return;
    }
    const assigned = bindings.reduce((sum, binding) => sum + binding.limit, 0);
    const specCapacity = getSpecCapacity(selectedSpec, selectedSpecDevice);
    if (assigned > specCapacity) {
      addAudit({
        actor: "资源调度器",
        action: `下发规格失败，租户额度 ${assigned} 超出可建上限 ${specCapacity}`,
        target: selectedSpec.name,
        result: "告警",
      });
      return;
    }

    setSpecs((items) =>
      items.map((item) =>
        item.id === selectedSpec.id
          ? {
              ...item,
              status: "下发中",
              tenantBindings: cloneBindings(bindings),
              tenantLimit: bindings.reduce((sum, binding) => sum + binding.limit, 0),
              scope: bindings.map((binding) => binding.tenantName).join("、"),
            }
          : item,
      ),
    );
    addAudit({ actor: "资源调度器", action: "下发租户算力规格策略", target: selectedSpec.name, result: "处理中" });
    setIsSkuConfigOpen(false);
    setIsDeliveryDrawerOpen(true);
    window.setTimeout(() => {
      setSpecs((items) =>
        items.map((item) =>
          item.id === selectedSpec.id
            ? {
                ...item,
                status: "已生效",
              }
            : item,
        ),
      );
      addAudit({ actor: "资源调度器", action: "租户算力规格策略生效", target: selectedSpec.name, result: "成功" });
    }, 900);
  };

  const openSkuConfig = (specId: string) => {
    setSelectedSpecId(specId);
    setIsSkuConfigOpen(true);
  };

  return (
    <ModuleScaffold scenarioKey="compute">
      <section className="surface-panel">
        <SectionHeader eyebrow="DEVICE CATALOG" title="设备与自定义 SKU" description="基于真实 GPU / NPU 设备创建 GPU、vGPU、NPU、vNPU 规格。" />
        <div className="device-grid">
          {deviceCatalog.map((device) => (
            <button
              key={device.id}
              className={`device-card ${selectedDeviceId === device.id ? "selected" : ""}`}
              onClick={() => setSelectedDeviceId(device.id)}
            >
              <div className="device-card-top">
                <strong>{device.name}</strong>
                <StatusBadge tone={device.unitLabel === "GPU" ? "blue" : "amber"}>{device.unitLabel}</StatusBadge>
              </div>
              <p>{device.vendor} · {device.architecture}</p>
              <div className="device-meta">
                <span>{device.memory}</span>
                <span>{device.interconnect}</span>
                <span>库存 {device.inventory}</span>
                <span>{device.unitLabel === "GPU" ? "MIG" : "vNPU"} {device.maxVirtualSlices} 切分</span>
              </div>
            </button>
          ))}
        </div>
        <div className="allocation-summary compact">
          <KeyValue label="设备库存" value={`${selectedDevice.inventory} ${selectedDevice.unitLabel}`} />
          <KeyValue label="虚拟切分能力" value={`${selectedDevice.maxVirtualSlices} / 卡`} />
          <KeyValue label="当前规格最大可建" value={`${draftCapacity} 个`} />
          <KeyValue label="推荐模式" value={selectedDevice.supportedModes.join(" / ")} />
        </div>
        <div className="segmented compact">
          {selectedDevice.supportedModes.map((mode) => (
            <button key={mode} className={draftMode === mode ? "active" : ""} onClick={() => setDraftMode(mode)}>
              {mode}
            </button>
          ))}
        </div>
        <div className="form-grid three">
          <label className="field">
            <span>规格名称</span>
            <input value={draftName} onChange={(event) => setDraftName(event.target.value)} />
          </label>
          <label className="field">
            <span>CPU</span>
            <input type="number" min={2} max={128} value={draftCpu} onChange={(event) => setDraftCpu(Number(event.target.value))} />
          </label>
          <label className="field">
            <span>内存 (GB)</span>
            <input type="number" min={8} max={1024} value={draftMemory} onChange={(event) => setDraftMemory(Number(event.target.value))} />
          </label>
          <label className="field">
            <span>{acceleratorLabelForType(draftMode)} 数量</span>
            <input type="number" min={1} max={8} value={draftUnits} onChange={(event) => setDraftUnits(Number(event.target.value))} />
          </label>
          <label className="field">
            <span>{draftMode.startsWith("v") ? "切分档位" : "资源形态"}</span>
            <select value={draftMode.startsWith("v") ? selectedSliceProfile : "整卡"} onChange={(event) => setSelectedSliceProfile(event.target.value)} disabled={!draftMode.startsWith("v")}>
              {(draftMode.startsWith("v") ? selectedDevice.sliceProfiles : ["整卡"]).map((profile) => (
                <option key={profile}>{profile}</option>
              ))}
            </select>
          </label>
          <div className="field readonly-field">
            <span>设备信息</span>
            <strong>{selectedDevice.name} · {selectedDevice.memory}</strong>
          </div>
        </div>
        <div className="action-row">
          <Button icon={Plus} onClick={addSpec}>
            创建 SKU
          </Button>
          <StatusBadge tone={draftMode.includes("NPU") ? "amber" : "blue"}>
            {draftMode}
          </StatusBadge>
          <StatusBadge tone="slate">{selectedDevice.vendor}</StatusBadge>
        </div>
        <div className={`inline-notice ${draftCapacity > 0 ? "ok" : "warn"}`}>
          <strong>容量校验</strong>
          <span>
            当前 {draftMode} 规格基于 {selectedDevice.name} 最多可下发 {draftCapacity} 个可创建额度，超出库存或切分能力时将阻止生效。
          </span>
        </div>
        <DataTable
          columns={["SKU 名称", "设备 / 模式", "切分", "资源", "已关联租户", "租户总额度", "状态", "操作"]}
          rows={specs.map((spec) => [
            spec.name,
            `${spec.deviceName} / ${spec.type}`,
            spec.sliceProfile,
            `${spec.cpu}C / ${spec.memory}GB / ${spec.acceleratorUnits} ${spec.type.includes("NPU") ? "NPU" : "GPU"}`,
            spec.scope,
            `${spec.tenantLimit} 个`,
            <StatusBadge key={spec.id} tone={spec.status === "已生效" ? "emerald" : spec.status === "下发中" ? "blue" : "slate"}>
              {spec.status}
            </StatusBadge>,
            <button
              key={`${spec.id}-config`}
              className="inline-action"
              onClick={() => openSkuConfig(spec.id)}
            >
              生效配置
            </button>,
          ])}
        />
      </section>
      {isSkuConfigOpen && selectedSpec ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsSkuConfigOpen(false)}>
          <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="sku-config-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">SKU ACTIVATION</span>
                <h3 id="sku-config-title">SKU 生效配置</h3>
                <p>{selectedSpec.name} · 关联一个或多个租户，并设置该租户可创建的实例数量。</p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={() => setIsSkuConfigOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="form-grid two">
              <div className="field readonly-field">
                <span>目标 SKU</span>
                <strong>{selectedSpec.name}</strong>
              </div>
              <div className="field readonly-field">
                <span>当前状态</span>
                <strong>{selectedSpec.status}</strong>
              </div>
            </div>
            <div className={`inline-notice ${draftAssignedLimit > selectedSpecCapacity ? "warn" : "ok"}`}>
              <strong>额度约束</strong>
              <span>
                当前已分配 {draftAssignedLimit} 个，规格最大可建 {selectedSpecCapacity} 个，剩余 {remainingCapacity} 个。
              </span>
            </div>
            <div className="tenant-binding-list">
              {assignableTenants.map((item) => {
                const binding = tenantLimits[item.id] ?? { enabled: false, limit: item.id === defaultTenant?.id ? 8 : 0 };
                const inputMax = Math.max(selectedSpecCapacity - draftAssignedLimit + binding.limit, 1);
                return (
                  <div key={item.id} className="tenant-binding-row">
                    <label className="tenant-binding-toggle">
                      <input
                        type="checkbox"
                        checked={binding.enabled}
                        onChange={(event) =>
                          setTenantLimits((current) => ({
                            ...current,
                            [item.id]: { enabled: event.target.checked, limit: event.target.checked ? Math.max(current[item.id]?.limit ?? 0, 1) : current[item.id]?.limit ?? 0 },
                          }))
                        }
                      />
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.level}</span>
                      </div>
                    </label>
                    <label className="binding-limit-input">
                      <span>可创建数量</span>
                      <input
                        type="number"
                        min={1}
                        max={inputMax}
                        value={binding.limit}
                        disabled={!binding.enabled}
                        onChange={(event) =>
                          setTenantLimits((current) => ({
                            ...current,
                            [item.id]: {
                              enabled: current[item.id]?.enabled ?? false,
                              limit: Math.max(1, Math.min(Number(event.target.value), inputMax)),
                            },
                          }))
                        }
                      />
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="allocation-summary compact">
              <KeyValue label="设备" value={selectedSpec.deviceName} />
              <KeyValue label="资源形态" value={`${selectedSpec.type} / ${selectedSpec.sliceProfile}`} />
              <KeyValue label="规格最大可建" value={`${selectedSpecCapacity} 个`} />
              <KeyValue label="当前租户总额度" value={`${draftAssignedLimit} 个`} />
            </div>
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setIsSkuConfigOpen(false)}>
                取消
              </Button>
              <Button variant="secondary" icon={Workflow} onClick={publishPolicy} disabled={publishDisabled}>
                生效 SKU
              </Button>
            </div>
          </section>
        </div>
      ) : null}
      {isDeliveryDrawerOpen && selectedSpec ? (
        <div className="drawer-backdrop" role="presentation" onClick={() => setIsDeliveryDrawerOpen(false)}>
          <aside className="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="delivery-drawer-title" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className="eyebrow">DELIVERY</span>
                <h3 id="delivery-drawer-title">资源下发窗口</h3>
                <p>{selectedSpec.name} · 查看当前租户分配、生效状态和调度结果。</p>
              </div>
              <button className="icon-button" aria-label="关闭下发窗口" onClick={() => setIsDeliveryDrawerOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <section className="delivery-status-card">
              <div className="delivery-status-head">
                <div>
                  <span>下发状态</span>
                  <strong>{policyState === "已生效" ? "成功" : policyState === "下发中" ? "处理中" : "待下发"}</strong>
                </div>
                <StatusBadge tone={policyState === "已生效" ? "emerald" : policyState === "下发中" ? "blue" : "slate"}>
                  {policyState === "已生效" ? "成功" : policyState === "下发中" ? "处理中" : "待下发"}
                </StatusBadge>
              </div>
              <p>{deliverySummary}</p>
              <div className="delivery-flow">
                <div className={`delivery-node ${policyState !== "草稿" ? "active" : ""}`}>
                  <span className="delivery-node-icon">
                    <CircleDot size={15} />
                  </span>
                  <div>
                    <strong>处理中</strong>
                    <small>校验切分与租户额度</small>
                  </div>
                </div>
                <ChevronRight className={`delivery-arrow ${policyState !== "草稿" ? "active" : ""}`} size={16} />
                <div className={`delivery-node ${policyState === "已生效" ? "success" : ""}`}>
                  <span className="delivery-node-icon">
                    <CheckCircle2 size={15} />
                  </span>
                  <div>
                    <strong>成功</strong>
                    <small>准入策略正式生效</small>
                  </div>
                </div>
              </div>
              <div className="progress-wrap delivery-progress-wrap">
                <div className="progress-label">
                  <span>策略推进</span>
                  <strong>{deliveryProgress}%</strong>
                </div>
                <div className="progress-track delivery-progress-track">
                  <span style={{ width: `${deliveryProgress}%` }} />
                </div>
              </div>
            </section>
            <div className="allocation-summary">
              <KeyValue label="设备" value={selectedSpec.deviceName} />
              <KeyValue label="切分模式" value={selectedSpec.type} />
              <KeyValue label="规格最大可建" value={`${selectedSpecCapacity}`} />
              <KeyValue label="已关联租户数" value={`${selectedBindings.length}`} />
              <KeyValue label="租户总额度" value={`${selectedSpec.tenantLimit}`} />
            </div>
            <DataTable
              columns={["租户 / 空间", "层级", "可创建数量", "资源形态"]}
              rows={selectedBindings.length > 0
                ? selectedBindings.map((binding) => [
                    binding.tenantName,
                    binding.tenantLevel,
                    `${binding.limit} 个`,
                    `${selectedSpec.type} / ${selectedSpec.sliceProfile}`,
                  ])
                : [["未关联租户", "-", "-", "-"]]}
            />
            <QuotaBars tenant={tenant} />
            <StepRail
              steps={["设备选型", "SKU 创建", "租户关联", "额度下发", "策略生效"]}
              active={policyState === "已生效" ? 4 : policyState === "下发中" ? 3 : selectedSpec ? 2 : 1}
            />
            <LogPanel
              title="调度策略日志"
              lines={[
                `scheduler: validate ${selectedSpec.type} fragmentation profile`,
                `device: ${selectedSpec.deviceName}`,
                `tenant-scope: ${selectedSpec.scope}`,
                `tenant-limit: ${selectedSpec.tenantLimit}`,
                `policy: status ${policyState}`,
              ]}
            />
          </aside>
        </div>
      ) : null}
    </ModuleScaffold>
  );
}

function EncryptionPage({ addAudit }: { addAudit: (event: Omit<AuditEvent, "id" | "time">) => void }) {
  const [models, setModels] = useState<ModelAsset[]>(() => modelAssets.map((model) => ({ ...model })));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [modelType, setModelType] = useState<ModelAsset["type"]>("PyTorch");
  const [algorithm, setAlgorithm] = useState<NonNullable<ModelAsset["algorithm"]>>("SM4-CBC");
  const [passphrase, setPassphrase] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"待上传" | "上传中" | "加密中" | "上传完成">("待上传");
  const [deployTarget, setDeployTarget] = useState<ModelAsset | null>(null);
  const [deployPassphrase, setDeployPassphrase] = useState("");
  const [deployError, setDeployError] = useState("");

  const canUpload = Boolean(selectedFile && passphrase.trim()) && uploadStatus !== "上传中" && uploadStatus !== "加密中";

  const startUpload = () => {
    if (!selectedFile || !passphrase.trim()) {
      return;
    }

    const file = selectedFile;
    setUploadProgress(0);
    const secret = passphrase;
    setUploadStatus("上传中");
    addAudit({ actor: "模型仓库", action: "模型文件上传中", target: file.name, result: "处理中" });

    let nextProgress = 0;
    const uploadTimer = window.setInterval(() => {
      nextProgress = Math.min(nextProgress + 10, 50);
      setUploadProgress(nextProgress);

      if (nextProgress < 50) {
        return;
      }

      window.clearInterval(uploadTimer);
      setUploadStatus("加密中");
      addAudit({ actor: "模型仓库", action: `${algorithm} 加密处理中`, target: file.name, result: "处理中" });

      const encryptTimer = window.setInterval(() => {
        nextProgress = Math.min(nextProgress + 10, 100);
        setUploadProgress(nextProgress);

        if (nextProgress < 100) {
          return;
        }

        window.clearInterval(encryptTimer);
        const uploadedModel: ModelAsset = {
          id: `m-${Date.now()}`,
          name: file.name.replace(/\.[^.]+$/, "") || file.name,
          type: modelType,
          size: formatBytes(file.size),
          encrypted: true,
          algorithm,
          passphrase: secret,
          status: "未部署",
          uploadedAt: nowTime(),
        };
        setModels((items) => [uploadedModel, ...items]);
        setUploadStatus("上传完成");
        setSelectedFile(null);
        setFileInputKey((value) => value + 1);
        setPassphrase("");
        addAudit({ actor: "模型仓库", action: "模型文件加密上传完成", target: uploadedModel.name, result: "成功" });
      }, 250);
    }, 220);
  };

  const completeDeployment = (model: ModelAsset) => {
    const endpoint = `https://models.pai.local/v1/${model.id}/infer`;
    setModels((items) =>
      items.map((item) =>
        item.id === model.id
          ? {
              ...item,
              status: item.encrypted ? "加密部署" : "已部署",
              endpoint,
            }
          : item,
      ),
    );
    addAudit({ actor: "模型部署服务", action: "模型部署完成并生成访问地址", target: model.name, result: "成功" });
  };

  const requestDeploy = (model: ModelAsset) => {
    if (model.encrypted) {
      setDeployTarget(model);
      setDeployPassphrase("");
      setDeployError("");
      return;
    }

    setModels((items) => items.map((item) => (item.id === model.id ? { ...item, status: "部署中" } : item)));
    addAudit({ actor: "模型部署服务", action: "提交模型部署", target: model.name, result: "处理中" });
    window.setTimeout(() => completeDeployment(model), 60000);
  };

  const deployEncryptedModel = () => {
    if (!deployTarget) {
      return;
    }

    if (!deployPassphrase.trim()) {
      setDeployError("请输入加密口令后再部署模型。");
      return;
    }

    if (deployPassphrase !== deployTarget.passphrase) {
      setDeployError("加密口令错误，无法部署当前模型。");
      addAudit({ actor: "模型部署服务", action: "加密模型口令校验失败", target: deployTarget.name, result: "拦截" });
      return;
    }

    const model = deployTarget;
    setDeployTarget(null);
    setDeployPassphrase("");
    setDeployError("");
    setModels((items) => items.map((item) => (item.id === model.id ? { ...item, status: "模型下载中" } : item)));
    addAudit({ actor: "模型部署服务", action: "提交加密模型部署", target: model.name, result: "处理中" });
    window.setTimeout(() => {
      setModels((items) => items.map((item) => (item.id === model.id ? { ...item, status: "模型解密中" } : item)));
      addAudit({ actor: "模型部署服务", action: "模型下载完成，进入解密流程", target: model.name, result: "处理中" });
    }, 22000);
    window.setTimeout(() => {
      setModels((items) => items.map((item) => (item.id === model.id ? { ...item, status: "模型部署中" } : item)));
      addAudit({ actor: "模型部署服务", action: "模型解密完成，进入部署阶段", target: model.name, result: "处理中" });
    }, 48000);
    window.setTimeout(() => completeDeployment(model), 60000);
  };

  const lastEndpoint = models.find((model) => model.endpoint)?.endpoint ?? "等待模型部署完成后生成";

  return (
    <ModuleScaffold scenarioKey="encryption">
      <section className="surface-panel">
        <SectionHeader
          eyebrow="MODEL ENCRYPTION"
          title="模型文件加密上传"
          description="上传模型文件后先进入上传中，上传完成后进入加密中，进度到 100% 后写入下方模型列表。"
        />
        <div className="form-grid three">
          <label className="field file-field">
            <span>模型文件</span>
            <input
              key={fileInputKey}
              type="file"
              accept=".pt,.pth,.onnx,.safetensors,.mindir,.pb,.bin,.zip"
              onChange={(event) => {
                setSelectedFile(event.target.files?.[0] ?? null);
                setUploadProgress(0);
                setUploadStatus("待上传");
              }}
            />
          </label>
          <label className="field">
            <span>模型类型</span>
            <select value={modelType} onChange={(event) => setModelType(event.target.value as ModelAsset["type"])}>
              <option>PyTorch</option>
              <option>MindSpore</option>
              <option>TensorFlow</option>
              <option>ONNX</option>
              <option>Safetensors</option>
            </select>
          </label>
          <label className="field">
            <span>加密算法</span>
            <select value={algorithm} onChange={(event) => setAlgorithm(event.target.value as NonNullable<ModelAsset["algorithm"]>)}>
              <option>AES-256-GCM</option>
              <option>SM4-CBC</option>
              <option>ChaCha20-Poly1305</option>
            </select>
          </label>
          <label className="field">
            <span>加密口令</span>
            <input
              type="password"
              value={passphrase}
              placeholder="请输入加密口令"
              onChange={(event) => setPassphrase(event.target.value)}
            />
          </label>
          <div className="field readonly-field">
            <span>上传状态</span>
            <strong className={uploadStatus === "上传完成" ? "text-emerald-700" : ""}>{uploadStatus}</strong>
          </div>
          <div className="field readonly-field">
            <span>文件信息</span>
            <strong>{selectedFile ? `${selectedFile.name} / ${formatBytes(selectedFile.size)}` : "未选择文件"}</strong>
          </div>
        </div>
        <ProgressBar label="上传与加密进度" value={uploadProgress} />
        <div className="action-row">
          <Button icon={UploadCloud} onClick={startUpload} disabled={!canUpload}>
            上传文件
          </Button>
          {uploadStatus === "上传完成" && <StatusBadge tone="emerald">加密成功</StatusBadge>}
          {uploadStatus === "上传中" && <StatusBadge tone="amber">上传中</StatusBadge>}
          {uploadStatus === "加密中" && <StatusBadge tone="amber">加密中</StatusBadge>}
        </div>
      </section>

      <section className="surface-panel">
        <SectionHeader
          eyebrow="MODEL LIST"
          title="模型列表"
          description="加密模型部署时先校验口令，再按模型下载中、模型解密中、模型部署中、部署完成顺序执行。"
        />
        <div className="table-wrap">
          <table className="model-table">
            <thead>
              <tr>
                <th>模型</th>
                <th>类型</th>
                <th>大小</th>
                <th>加密状态</th>
                <th>部署状态</th>
                <th>访问地址</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id}>
                  <td>
                    <div className="model-name-cell">
                      <strong>{model.name}</strong>
                      <span>{model.uploadedAt}</span>
                    </div>
                  </td>
                  <td>{model.type}</td>
                  <td>{model.size}</td>
                  <td>
                    <StatusBadge tone={model.encrypted ? "emerald" : "slate"}>
                      {model.encrypted ? `已加密 · ${model.algorithm}` : "未加密"}
                    </StatusBadge>
                  </td>
                  <td>
                    <StatusBadge tone={deploymentTone(model.status)} animated={isDeploymentInProgress(model.status)}>
                      {model.status}
                    </StatusBadge>
                  </td>
                  <td>
                    {model.endpoint ? (
                      <a className="deployment-url" href={model.endpoint}>
                        {model.endpoint}
                      </a>
                    ) : (
                      <span className="text-slate-400">待生成</span>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="secondary"
                      icon={Rocket}
                      onClick={() => requestDeploy(model)}
                      disabled={model.status !== "未部署"}
                    >
                      部署
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="result-box mt-4">
          <span>最近访问地址</span>
          <strong>{lastEndpoint}</strong>
        </div>
      </section>

      {deployTarget && (
        <div className="modal-backdrop" role="presentation" onClick={() => setDeployTarget(null)}>
          <section className="modal-panel password-dialog" role="dialog" aria-modal="true" aria-labelledby="deploy-password-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">ENCRYPTED DEPLOYMENT</span>
                <h3 id="deploy-password-title">输入加密口令</h3>
                <p>{deployTarget.name} 是加密模型，部署前需要校验加密口令。</p>
              </div>
              <button className="icon-button" aria-label="关闭" onClick={() => setDeployTarget(null)}>
                <X size={18} />
              </button>
            </div>
            <label className="field">
              <span>加密口令</span>
              <input
                type="password"
                value={deployPassphrase}
                autoFocus
                placeholder="请输入加密口令"
                onChange={(event) => {
                  setDeployPassphrase(event.target.value);
                  setDeployError("");
                }}
              />
            </label>
            {deployError && <div className="field-error">{deployError}</div>}
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setDeployTarget(null)}>
                取消
              </Button>
              <Button icon={Rocket} onClick={deployEncryptedModel}>
                部署模型
              </Button>
            </div>
          </section>
        </div>
      )}
    </ModuleScaffold>
  );
}

function SafetyPage({ addAudit }: { addAudit: (event: Omit<AuditEvent, "id" | "time">) => void }) {
  const initialWords: SensitiveWord[] = [
    {
      id: "sw-001",
      word: "涉密",
      category: "涉密信息",
      behavior: "拦截请求",
      source: "手动添加",
      hits: 126,
      blocked: 118,
      updatedAt: "14:08",
    },
    {
      id: "sw-002",
      word: "内部资料",
      category: "涉密信息",
      behavior: "替换敏感词",
      source: "文件导入",
      hits: 88,
      blocked: 41,
      updatedAt: "13:52",
    },
    {
      id: "sw-003",
      word: "密钥",
      category: "账号凭据",
      behavior: "拦截请求",
      source: "手动添加",
      hits: 72,
      blocked: 68,
      updatedAt: "13:31",
    },
    {
      id: "sw-004",
      word: "身份证号",
      category: "个人隐私",
      behavior: "记录日志",
      source: "文件导入",
      hits: 54,
      blocked: 12,
      updatedAt: "12:47",
    },
    {
      id: "sw-005",
      word: "越权",
      category: "违规指令",
      behavior: "第三方安全服务",
      source: "手动添加",
      hits: 63,
      blocked: 39,
      updatedAt: "12:05",
    },
  ];
  const initialPolicies: SecurityPolicy[] = [
    {
      id: "sp-001",
      name: "拦截请求策略",
      behavior: "拦截请求",
      words: ["涉密", "密钥"],
      scope: "全部租户",
      priority: 1,
      actionDetail: "命中高危词后终止请求，返回统一拦截提示，不进入模型推理。",
      status: "启用",
      updatedAt: "14:20",
    },
    {
      id: "sp-002",
      name: "替换敏感词策略",
      behavior: "替换敏感词",
      words: ["内部资料"],
      scope: "政务问答服务",
      priority: 2,
      actionDetail: "命中中风险词后替换为 **，保留上下文并继续请求模型。",
      status: "启用",
      updatedAt: "14:16",
    },
    {
      id: "sp-003",
      name: "第三方服务策略",
      behavior: "第三方安全服务",
      words: ["越权"],
      scope: "模型 API 网关",
      priority: 3,
      actionDetail: "将命中内容提交至安全模型网关，按第三方服务返回结果决定放行或拒绝。",
      status: "启用",
      updatedAt: "14:10",
    },
    {
      id: "sp-004",
      name: "记录日志策略",
      behavior: "记录日志",
      words: ["身份证号"],
      scope: "审计留痕链路",
      priority: 4,
      actionDetail: "允许低风险请求继续执行，同时写入审计日志并标记后续复核。",
      status: "启用",
      updatedAt: "14:02",
    },
  ];
  const behaviorOptions: SensitiveBehavior[] = ["拦截请求", "替换敏感词", "第三方安全服务", "记录日志"];
  const categoryOptions: SensitiveCategory[] = ["涉密信息", "账号凭据", "个人隐私", "违规指令"];
  const policyScopes = ["全部请求链路", "政务问答服务", "模型 API 网关", "第三方安全服务通道", "审计留痕链路"];
  const [activeTab, setActiveTab] = useState<SafetyTab>("library");
  const [words, setWords] = useState<SensitiveWord[]>(() => cloneSensitiveWords(initialWords));
  const [policies, setPolicies] = useState<SecurityPolicy[]>(() => clonePolicies(initialPolicies));
  const [newWord, setNewWord] = useState("高密项目");
  const [newCategory, setNewCategory] = useState<SensitiveCategory>("涉密信息");
  const [newBehavior, setNewBehavior] = useState<SensitiveBehavior>("拦截请求");
  const [uploadName, setUploadName] = useState("待选择词库文件");

  const totalHits = useMemo(() => words.reduce((sum, item) => sum + item.hits, 0), [words]);
  const totalBlocked = useMemo(() => words.reduce((sum, item) => sum + item.blocked, 0), [words]);
  const categorySummary = useMemo(
    () =>
      categoryOptions.map((category) => {
        const matched = words.filter((item) => item.category === category);
        return {
          category,
          count: matched.length,
          hits: matched.reduce((sum, item) => sum + item.hits, 0),
          blocked: matched.reduce((sum, item) => sum + item.blocked, 0),
        };
      }),
    [words],
  );
  const behaviorSummary = useMemo(
    () =>
      behaviorOptions.map((item) => {
        const matched = words.filter((word) => word.behavior === item);
        return {
          behavior: item,
          count: matched.length,
          hits: matched.reduce((sum, word) => sum + word.hits, 0),
        };
      }),
    [words],
  );
  const interceptRate = totalHits === 0 ? "0%" : `${((totalBlocked / totalHits) * 100).toFixed(1)}%`;

  const addWord = () => {
    const value = newWord.trim();
    if (!value) {
      return;
    }

    const blocked = newBehavior === "记录日志" ? 0 : newBehavior === "替换敏感词" ? 6 : newBehavior === "第三方安全服务" ? 11 : 18;
    setWords((items) => [
      {
        id: `sw-${Date.now()}`,
        word: value,
        category: newCategory,
        behavior: newBehavior,
        source: "手动添加",
        hits: 24,
        blocked,
        updatedAt: nowTime().slice(0, 5),
      },
      ...items,
    ]);
    setNewWord("");
    addAudit({ actor: "安全管理员", action: `添加敏感词：${value}`, target: newCategory, result: "成功" });
  };

  const importWords = () => {
    const importedAt = nowTime().slice(0, 5);
    const importedWords: SensitiveWord[] = [
      {
        id: `sw-${Date.now()}-1`,
        word: "数据库口令",
        category: "账号凭据",
        behavior: "拦截请求",
        source: "文件导入",
        hits: 36,
        blocked: 35,
        updatedAt: importedAt,
      },
      {
        id: `sw-${Date.now()}-2`,
        word: "联系方式",
        category: "个人隐私",
        behavior: "记录日志",
        source: "文件导入",
        hits: 27,
        blocked: 4,
        updatedAt: importedAt,
      },
    ];
    setWords((items) => [...importedWords, ...items]);
    addAudit({ actor: "安全管理员", action: "导入敏感词库文件", target: uploadName, result: "成功" });
  };

  const updatePolicy = (id: string, patch: Partial<SecurityPolicy>) => {
    setPolicies((items) => items.map((item) => (item.id === id ? { ...item, ...patch, updatedAt: nowTime().slice(0, 5) } : item)));
  };

  const savePolicies = () => {
    addAudit({
      actor: "安全管理员",
      action: "保存敏感词触发行为策略组",
      target: "拦截 / 替换 / 第三方服务 / 日志",
      result: "成功",
    });
  };

  return (
    <ModuleScaffold scenarioKey="safety">
      <section className="surface-panel safety-tab-shell">
        <div className="safety-tabs" role="tablist" aria-label="敏感词策略模块">
          <button className={activeTab === "library" ? "active" : ""} type="button" role="tab" aria-selected={activeTab === "library"} onClick={() => setActiveTab("library")}>
            <Database size={16} />
            <span>敏感词库</span>
          </button>
          <button className={activeTab === "policy" ? "active" : ""} type="button" role="tab" aria-selected={activeTab === "policy"} onClick={() => setActiveTab("policy")}>
            <SlidersHorizontal size={16} />
            <span>策略编辑</span>
          </button>
        </div>
      </section>

      {activeTab === "library" ? (
        <div className="page-grid" role="tabpanel" aria-label="敏感词库">
          <section className="metric-grid safety-metrics">
            <MetricCard icon={Database} label="敏感词总数" value={String(words.length)} unit="个" tone="rose" />
            <MetricCard icon={Boxes} label="词库类别" value={String(categorySummary.filter((item) => item.count > 0).length)} unit="类" tone="violet" />
            <MetricCard icon={ShieldAlert} label="拦截次数" value={String(totalBlocked)} unit="次" tone="amber" />
            <MetricCard icon={BarChart3} label="拦截率" value={interceptRate} unit="累计命中" tone="emerald" />
          </section>

          <div className="two-column wide-left">
            <section className="surface-panel">
              <SectionHeader eyebrow="SENSITIVE LIBRARY" title="敏感词库管理" description="支持手动添加或文件导入敏感词，并同步维护类别与触发行为。" />
              <div className="inline-notice ok">
                <strong>当前词库已覆盖 {categorySummary.filter((item) => item.count > 0).length} 类敏感词场景</strong>
                <span>累计命中 {totalHits} 次，累计拦截 {totalBlocked} 次，整体拦截率 {interceptRate}。</span>
              </div>
              <div className="sensitive-entry-grid">
                <label className="field">
                  <span>敏感词</span>
                  <input value={newWord} placeholder="输入敏感词" onChange={(event) => setNewWord(event.target.value)} />
                </label>
                <label className="field">
                  <span>类别</span>
                  <select value={newCategory} onChange={(event) => setNewCategory(event.target.value as SensitiveCategory)}>
                    {categoryOptions.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>触发行为</span>
                  <select value={newBehavior} onChange={(event) => setNewBehavior(event.target.value as SensitiveBehavior)}>
                    {behaviorOptions.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <Button icon={Plus} onClick={addWord}>
                  添加
                </Button>
              </div>

              <div className="library-upload-row">
                <label className="file-drop">
                  <UploadCloud size={20} />
                  <span>
                    <strong>{uploadName}</strong>
                    <small>CSV / TXT</small>
                  </span>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        setUploadName(file.name);
                      }
                    }}
                  />
                </label>
                <Button variant="secondary" icon={UploadCloud} onClick={importWords}>
                  导入词库
                </Button>
              </div>

              <DataTable
                columns={["敏感词", "类别", "触发行为", "来源", "命中 / 拦截", "更新时间"]}
                rows={words.map((item) => [
                  item.word,
                  <StatusBadge key={`${item.id}-category`} tone={categoryTone(item.category)}>
                    {item.category}
                  </StatusBadge>,
                  <StatusBadge key={`${item.id}-behavior`} tone={behaviorTone(item.behavior)}>
                    {item.behavior}
                  </StatusBadge>,
                  item.source,
                  `${item.hits} / ${item.blocked}`,
                  item.updatedAt,
                ])}
              />
            </section>

            <section className="surface-panel">
              <SectionHeader eyebrow="STATISTICS" title="整体敏感词统计" description="按类别汇总敏感词数量、拦截次数和四类触发行为覆盖情况。" />
              <div className="category-stat-list">
                {categorySummary.map((item) => (
                  <div key={item.category} className={`category-stat-card ${toneClass(categoryTone(item.category))}`}>
                    <div>
                      <span>{item.category}</span>
                      <strong>{item.count} 个</strong>
                    </div>
                    <small>
                      命中 {item.hits} 次 / 拦截 {item.blocked} 次
                    </small>
                  </div>
                ))}
              </div>
              <div className="metric-strip">
                {behaviorSummary.map((item) => (
                  <MetricMini key={item.behavior} label={item.behavior} value={`${item.count} 词 / ${item.hits} 次`} />
                ))}
              </div>
              <LogPanel
                title="词库统计快照"
                lines={[
                  `library.total: ${words.length}`,
                  `category.count: ${categorySummary.filter((item) => item.count > 0).length}`,
                  `blocked.total: ${totalBlocked}`,
                  `blocked.rate: ${interceptRate}`,
                ]}
              />
            </section>
          </div>
        </div>
      ) : (
        <div className="page-grid" role="tabpanel" aria-label="策略编辑">
          <section className="surface-panel">
            <SectionHeader eyebrow="POLICY EDITOR" title="策略编辑" description="统一编排拦截请求策略、替换敏感词策略、第三方服务策略和记录日志策略。" />
            <div className="policy-editor-grid">
              {policies.map((policy) => {
                const Icon = behaviorIcon(policy.behavior);
                return (
                  <article key={policy.id} className={`policy-editor-card ${toneClass(behaviorTone(policy.behavior))}`}>
                    <div className="policy-card-head">
                      <div className="policy-icon">
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <strong>{policy.name}</strong>
                        <span>{policy.behavior}</span>
                      </div>
                      <StatusBadge tone={policy.status === "启用" ? "emerald" : "slate"}>{policy.status}</StatusBadge>
                    </div>

                    <label className="switch-row">
                      <input
                        type="checkbox"
                        checked={policy.status === "启用"}
                        onChange={(event) => updatePolicy(policy.id, { status: event.target.checked ? "启用" : "停用" })}
                      />
                      <span>启用策略</span>
                    </label>

                    <div className="form-grid two compact-form">
                      <label className="field">
                        <span>策略名称</span>
                        <input value={policy.name} onChange={(event) => updatePolicy(policy.id, { name: event.target.value })} />
                      </label>
                      <label className="field">
                        <span>生效范围</span>
                        <select value={policy.scope} onChange={(event) => updatePolicy(policy.id, { scope: event.target.value })}>
                          {policyScopes.map((scope) => (
                            <option key={scope}>{scope}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="form-grid two compact-form">
                      <label className="field">
                        <span>优先级</span>
                        <input
                          type="number"
                          min={1}
                          max={9}
                          value={policy.priority}
                          onChange={(event) => updatePolicy(policy.id, { priority: Number(event.target.value) || 1 })}
                        />
                      </label>
                      <div className="field readonly-field">
                        <span>关联敏感词</span>
                        <strong>{policy.words.join("、")}</strong>
                      </div>
                    </div>

                    <label className="field">
                      <span>处置动作</span>
                      <textarea value={policy.actionDetail} rows={3} onChange={(event) => updatePolicy(policy.id, { actionDetail: event.target.value })} />
                    </label>

                    <div className="policy-card-foot">
                      <span>更新时间 {policy.updatedAt}</span>
                      <StatusBadge tone={behaviorTone(policy.behavior)}>{policy.scope}</StatusBadge>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="action-row">
              <Button icon={ShieldAlert} onClick={savePolicies}>
                保存策略组
              </Button>
              <Button variant="ghost" icon={RefreshCcw} onClick={() => setPolicies(clonePolicies(initialPolicies))}>
                恢复默认
              </Button>
            </div>
          </section>

          <div className="two-column">
            <section className="surface-panel">
              <SectionHeader eyebrow="POLICY FLOW" title="策略执行顺序" description="请求进入网关后，按优先级依次执行四类敏感词处置策略。" />
              <div className="security-chain safety-policy-chain">
                {policies.map((policy) => (
                  <SecurityNode key={policy.id} icon={behaviorIcon(policy.behavior)} label={`P${policy.priority} ${policy.status}`} value={policy.name} tone={behaviorTone(policy.behavior)} />
                ))}
              </div>
            </section>

            <section className="surface-panel">
              <SectionHeader eyebrow="GATEWAY" title="策略运行概览" description="查看当前启用策略数量、词库覆盖规模和策略编排日志。" />
              <div className="allocation-summary compact">
                <KeyValue label="启用策略" value={`${policies.filter((item) => item.status === "启用").length} / ${policies.length}`} positive />
                <KeyValue label="词库覆盖" value={`${words.length} 个`} positive />
              </div>
              <div className="metric-strip">
                {policies.map((policy) => (
                  <MetricMini key={policy.id} label={policy.name} value={`${policy.status} / P${policy.priority}`} />
                ))}
              </div>
              <LogPanel
                title="策略编排日志"
                lines={[...policies]
                  .sort((left, right) => left.priority - right.priority)
                  .map((policy) => `P${policy.priority} ${policy.name}: ${policy.status} -> ${policy.scope}`)}
              />
            </section>
          </div>
        </div>
      )}
    </ModuleScaffold>
  );
}

function DevInstancePage({ addAudit }: { addAudit: (event: Omit<AuditEvent, "id" | "time">) => void }) {
  const initialInstances: DevInstance[] = [
    {
      id: "dev-001",
      name: "llm-train-dev-01",
      skuType: "a100-train-standard",
      imageType: "PyTorch 2.4 CUDA 12.4",
      resource: "32C / 256GB / 4 GPU",
      ipAddress: "10.21.18.34",
      owner: "算法研发",
      status: "运行中",
      deeplink: buildVsCodeDeeplink("10.21.18.34", "llm-train-dev-01"),
      lastEvent: "2 分钟前完成镜像启动",
    },
    {
      id: "dev-002",
      name: "cv-debug-vgpu-02",
      skuType: "h200-vgpu-inference",
      imageType: "MindSpore 2.3 CANN 8.0",
      resource: "16C / 96GB / 1 vGPU",
      ipAddress: "10.21.18.41",
      owner: "视觉算法",
      status: "运行中",
      deeplink: buildVsCodeDeeplink("10.21.18.41", "cv-debug-vgpu-02"),
      lastEvent: "12 分钟前完成镜像启动",
    },
  ];
  const initialSelected = "dev-001";
  const [instances, setInstances] = useState<DevInstance[]>(() => cloneInstances(initialInstances));
  const [selected, setSelected] = useState(initialSelected);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draftName, setDraftName] = useState("vscode-dev-03");
  const [draftSkuId, setDraftSkuId] = useState(devSkuOptions[0].id);
  const [draftImageId, setDraftImageId] = useState(devImageOptions[0].id);
  const [createError, setCreateError] = useState("");
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalSessions, setTerminalSessions] = useState<Record<string, TerminalSession>>(() =>
    Object.fromEntries(initialInstances.map((instance) => [instance.id, createTerminalSession(instance)])),
  );
  const [isTerminalWindowOpen, setIsTerminalWindowOpen] = useState(false);
  const [terminalTargetId, setTerminalTargetId] = useState<string | null>(null);
  const timerRefs = useRef<number[]>([]);
  const current = instances.find((item) => item.id === selected) ?? instances[0];
  const selectedDraftSku = devSkuOptions.find((item) => item.id === draftSkuId) ?? devSkuOptions[0];
  const selectedDraftImage = devImageOptions.find((item) => item.id === draftImageId) ?? devImageOptions[0];
  const runningCount = instances.filter((item) => item.status === "运行中").length;
  const provisioningCount = instances.filter((item) => item.status !== "运行中").length;
  const terminalInstance = instances.find((item) => item.id === terminalTargetId) ?? null;
  const terminalSession = terminalTargetId ? terminalSessions[terminalTargetId] : null;
  useEffect(() => {
    return () => {
      timerRefs.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const openCreateModal = () => {
    setDraftName(`vscode-dev-${String(instances.length + 1).padStart(2, "0")}`);
    setDraftSkuId(devSkuOptions[0].id);
    setDraftImageId(devImageOptions[0].id);
    setCreateError("");
    setIsCreateOpen(true);
  };

  const connect = (instance: DevInstance) => {
    if (instance.status !== "运行中" || !instance.deeplink) {
      return;
    }
    setSelected(instance.id);
    setInstances((items) =>
      items.map((item) => (item.id === instance.id ? { ...item, lastEvent: "本地 VS Code 已唤起" } : item)),
    );
    addAudit({ actor: "研发工程师", action: "唤醒本地 VS Code", target: instance.name, result: "成功" });
    window.location.href = instance.deeplink;
  };

  const openTerminal = (instance: DevInstance) => {
    setSelected(instance.id);
    setTerminalTargetId(instance.id);
    setTerminalInput("");
    setIsTerminalWindowOpen(true);
  };

  const runTerminalCommand = () => {
    if (!terminalInstance || !terminalSession) {
      return;
    }
    const command = terminalInput.trim().replace(/\s+/g, " ");
    if (!command) {
      return;
    }

    const promptPath = terminalSession.cwd;
    const promptLine = buildTerminalLine("command", `root@${terminalInstance.name}:${promptPath}# ${command}`);

    if (command === "clear") {
      setTerminalSessions((items) => ({
        ...items,
        [terminalInstance.id]: {
          ...items[terminalInstance.id],
          lines: buildDevTerminalWelcome(terminalInstance),
          logVersion: 0,
        },
      }));
      setTerminalInput("");
      return;
    }

    const output: TerminalLine[] = [];
    let nextLogVersion = terminalSession.logVersion;

    const pushOut = (text: string, kind: TerminalLine["kind"] = "stdout") => {
      output.push(buildTerminalLine(kind, text));
    };

    switch (command) {
      case "help":
        [
          "accepted demo commands:",
          "help",
          "pwd",
          "ls",
          "status",
          "kubectl get pod",
          "kubectl logs code-server --tail=20",
          "cat README.md",
          "ip addr",
          "nvidia-smi",
          "code .",
          "clear",
        ].forEach((line) => pushOut(line));
        break;
      case "pwd":
        pushOut(terminalSession.cwd);
        break;
      case "ls":
        pushOut("README.md  src/  notebooks/  scripts/  logs/  .vscode/");
        break;
      case "status":
        buildTerminalStatusLines(terminalInstance).forEach((line) => pushOut(line));
        break;
      case "kubectl get pod":
        pushOut("NAME                 READY   STATUS    RESTARTS   AGE");
        pushOut(`${terminalInstance.name}   1/1     ${terminalInstance.status === "运行中" ? "Running" : "Pending"}   0          12m`);
        break;
      case "kubectl logs code-server --tail=20":
        buildTerminalLogs(terminalInstance, nextLogVersion).forEach((line) => pushOut(line));
        nextLogVersion += 1;
        break;
      case "cat README.md":
        buildTerminalReadme(terminalInstance).forEach((line) => pushOut(line));
        break;
      case "ip addr":
        pushOut(
          terminalInstance.status === "运行中"
            ? `eth0: inet ${terminalInstance.ipAddress}/24 brd 10.21.18.255 scope global eth0`
            : "eth0: waiting for network assignment",
        );
        break;
      case "nvidia-smi":
        if (terminalInstance.status !== "运行中") {
          pushOut("GPU device is not ready yet.", "stderr");
        } else if (!terminalInstance.resource.includes("GPU")) {
          pushOut("No NVIDIA GPU detected in current SKU.", "stderr");
        } else {
          [
            "Fri Apr 24 15:18:22 2026",
            "| GPU   Name                    Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |",
            `|  0    ${terminalInstance.skuType.padEnd(22, " ")} On   | 00000000:00:1E.0 Off |                    0 |`,
            "| 41C   P8                       78W / 400W    |   6144MiB / 81920MiB |     12%      Default |",
          ].forEach((line) => pushOut(line));
        }
        break;
      case "code .":
        if (terminalInstance.status !== "运行中") {
          pushOut("VS Code deeplink is unavailable until the instance reaches 运行中.", "stderr");
        } else {
          pushOut(`Launching VS Code for ${terminalInstance.name} ...`);
          pushOut(terminalInstance.deeplink);
          connect(terminalInstance);
        }
        break;
      default:
        pushOut(`Unsupported demo command: ${command}`, "stderr");
        pushOut("This terminal only accepts the fixed demo commands in `help`.");
        break;
    }

    setTerminalSessions((items) => ({
      ...items,
      [terminalInstance.id]: {
        cwd: items[terminalInstance.id].cwd,
        lines: [...items[terminalInstance.id].lines, promptLine, ...output],
        logVersion: nextLogVersion,
      },
    }));
    setTerminalInput("");
  };

  const createInstance = () => {
    const name = draftName.trim();
    if (!name) {
      setCreateError("请填写实例名称。");
      return;
    }
    if (instances.some((item) => item.name === name)) {
      setCreateError("实例名称已存在，请更换一个名称。");
      return;
    }

    const nextIpAddress = buildDevInstanceIp(instances.length + 34);
    const nextDeeplink = buildVsCodeDeeplink(nextIpAddress, name);
    const createdInstance: DevInstance = {
      id: `dev-${Date.now()}`,
      name,
      skuType: selectedDraftSku.name,
      imageType: selectedDraftImage.name,
      resource: selectedDraftSku.resource,
      ipAddress: "待分配",
      owner: "研发工程师",
      status: "调度中",
      deeplink: "",
      lastEvent: "创建申请已提交",
    };

    setInstances((items) => [createdInstance, ...items]);
    setTerminalSessions((items) => ({
      ...items,
      [createdInstance.id]: createTerminalSession(createdInstance),
    }));
    setSelected(createdInstance.id);
    setIsCreateOpen(false);
    setCreateError("");
    addAudit({ actor: "研发工程师", action: "提交远端开发实例创建", target: name, result: "处理中" });

    const scheduleTimer = window.setTimeout(() => {
      setInstances((items) =>
        items.map((item) =>
          item.id === createdInstance.id ? { ...item, status: "部署中", lastEvent: "资源调度完成，开始拉取镜像" } : item,
        ),
      );
      addAudit({ actor: "资源调度器", action: "开发实例进入部署阶段", target: name, result: "处理中" });

      const deployTimer = window.setTimeout(() => {
        setInstances((items) =>
          items.map((item) =>
            item.id === createdInstance.id
              ? {
                  ...item,
                  status: "运行中",
                  ipAddress: nextIpAddress,
                  deeplink: nextDeeplink,
                  lastEvent: "实例运行就绪，可唤起 VS Code",
                }
              : item,
          ),
        );
        addAudit({ actor: "开发控制器", action: "开发实例部署完成", target: name, result: "成功" });
      }, 1400);
      timerRefs.current.push(deployTimer);
    }, 1200);

    timerRefs.current.push(scheduleTimer);
  };

  return (
    <ModuleScaffold scenarioKey="dev">
      <div>
        <section className="surface-panel">
          <SectionHeader eyebrow="DEVELOPMENT INSTANCE" title="开发实例管理" />
          <div className="allocation-summary compact">
            <KeyValue label="实例总数" value={`${instances.length} 个`} positive />
            <KeyValue label="运行中" value={`${runningCount} 个`} positive />
            <KeyValue label="处理中" value={`${provisioningCount} 个`} />
            <KeyValue label="默认入口" value="VS Code Deeplink" />
          </div>
          <div className="inline-notice ok">
            <strong>创建流程</strong>
            <span>用户提交名称、SKU 类型和镜像类型后，实例会依次经历调度中、部署中和运行中。运行中实例展示 IP 地址和 VS Code 连接按钮。</span>
          </div>
          <DataTable
            columns={["实例名称", "SKU 类型", "镜像类型", "IP 地址", "状态", "操作"]}
            rows={instances.map((instance) => [
              <button key={instance.id} className="table-link" onClick={() => setSelected(instance.id)}>
                {instance.name}
              </button>,
              `${instance.skuType} · ${instance.resource}`,
              instance.imageType,
              instance.ipAddress,
              <StatusBadge key={`${instance.id}-status`} tone={instance.status === "运行中" ? "emerald" : "blue"} animated={instance.status !== "运行中"}>
                {instance.status}
              </StatusBadge>,
              instance.status === "运行中" ? (
                <div key={`${instance.id}-actions`} className="table-action-stack">
                  <button className="inline-action" onClick={() => connect(instance)}>
                    连接 VS Code
                  </button>
                  <button className="inline-action" onClick={() => openTerminal(instance)}>
                    WebTerminal
                  </button>
                </div>
              ) : (
                <span key={`${instance.id}-pending`} className="table-note">
                  {instance.status === "调度中" ? "等待调度" : "镜像部署中"}
                </span>
              ),
            ])}
          />
          <div className="action-row">
            <Button icon={Plus} onClick={openCreateModal}>
              创建实例
            </Button>
            <StatusBadge tone="blue">{current.skuType}</StatusBadge>
            <StatusBadge tone="slate">{current.imageType}</StatusBadge>
          </div>
        </section>
      </div>

      {isCreateOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsCreateOpen(false)}>
          <section className="modal-panel dev-create-modal" role="dialog" aria-modal="true" aria-labelledby="dev-create-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">CREATE INSTANCE</span>
                <h3 id="dev-create-title">创建 VS Code 开发实例</h3>
                <p>填写实例名称，并选择前面已定义好的 SKU 类型和镜像类型。提交后实例会自动进入调度和部署流程。</p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={() => setIsCreateOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="form-grid two">
              <label className="field">
                <span>实例名称</span>
                <input
                  value={draftName}
                  autoFocus
                  placeholder="请输入实例名称"
                  onChange={(event) => {
                    setDraftName(event.target.value);
                    setCreateError("");
                  }}
                />
              </label>
              <label className="field">
                <span>SKU 类型</span>
                <select value={draftSkuId} onChange={(event) => setDraftSkuId(event.target.value)}>
                  {devSkuOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>镜像类型</span>
                <select value={draftImageId} onChange={(event) => setDraftImageId(event.target.value)}>
                  {devImageOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="field readonly-field">
                <span>资源摘要</span>
                <strong>{selectedDraftSku.resource}</strong>
              </div>
            </div>
            <div className="allocation-summary compact">
              <KeyValue label="目标设备" value={selectedDraftSku.zone} />
              <KeyValue label="镜像栈" value={selectedDraftImage.stack} />
              <KeyValue label="提交流程" value="调度中 -> 部署中 -> 运行中" />
              <KeyValue label="连接方式" value="VS Code Deeplink" />
            </div>
            {createError ? <div className="field-error">{createError}</div> : null}
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                取消
              </Button>
              <Button variant="secondary" icon={Plus} onClick={createInstance}>
                提交创建
              </Button>
            </div>
          </section>
        </div>
      ) : null}

      {isTerminalWindowOpen && terminalInstance && terminalSession ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsTerminalWindowOpen(false)}>
          <section className="modal-panel terminal-window-modal" role="dialog" aria-modal="true" aria-labelledby="terminal-window-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">WEB TERMINAL</span>
                <h3 id="terminal-window-title">终端窗口</h3>
                <p>{terminalInstance.name} 的高仿真 WebTerminal，只接受固定演示命令，用于展示远端开发接入流程。</p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={() => setIsTerminalWindowOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <TerminalWorkbench
              instance={terminalInstance}
              workspace={terminalSession.cwd}
              lines={terminalSession.lines}
              inputValue={terminalInput}
              onInputChange={setTerminalInput}
              onRunCommand={runTerminalCommand}
              modal
            />
          </section>
        </div>
      ) : null}
    </ModuleScaffold>
  );
}

function TerminalWorkbench({
  instance,
  workspace,
  lines,
  inputValue,
  onInputChange,
  onRunCommand,
  modal = false,
}: {
  instance: DevInstance;
  workspace: string;
  lines: TerminalLine[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onRunCommand: () => void;
  modal?: boolean;
}) {
  const quickCommands = ["help", "status", "kubectl get pod", "kubectl logs code-server --tail=20", "cat README.md", "code ."];

  return (
    <div className={`terminal-workbench ${modal ? "is-modal" : ""}`}>
      <div className="terminal-workbench-header">
        <div>
          <span className="eyebrow">WEB TERMINAL</span>
          <h3>{instance.name}</h3>
          <p>{instance.status === "运行中" ? `${instance.ipAddress} · ${instance.imageType}` : "实例未就绪时仅支持查看状态类命令。"}</p>
        </div>
      </div>

      <div className="terminal-note">受控演示，仅支持固定命令：实例状态、Pod 查询、日志查看、README 查看、GPU 查看和 VS Code attached。</div>

      <div className="terminal-shortcuts">
        {quickCommands.map((command) => (
          <button key={command} type="button" onClick={() => onInputChange(command)}>
            {command}
          </button>
        ))}
      </div>

      <div className="terminal-card terminal-shell">
        <div className="terminal-bar">
          <span />
          <span />
          <span />
        </div>
        <div className="terminal-session">
          {lines.map((line, index) => (
            <div key={`${line.id}-${index}`} className={`terminal-line ${line.kind === "command" ? "is-command" : ""} ${line.kind === "stderr" ? "is-error" : ""}`}>
              {line.text}
            </div>
          ))}
        </div>
        <form
          className="terminal-command-form"
          onSubmit={(event) => {
            event.preventDefault();
            onRunCommand();
          }}
        >
          <span className="terminal-prompt">{`root@${instance.name}:${workspace}#`}</span>
          <input
            value={inputValue}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="输入固定命令，例如 status / kubectl get pod / code ."
          />
          <button type="submit">运行</button>
        </form>
      </div>
    </div>
  );
}

function FineTunePage({ addAudit }: { addAudit: (event: Omit<AuditEvent, "id" | "time">) => void }) {
  const baseModelOptions = [
    { id: "qwen25-7b", name: "Qwen2.5-7B-Instruct", family: "通用中文指令模型", slug: "qwen25-7b" },
    { id: "qwen25-14b", name: "Qwen2.5-14B-Instruct", family: "长上下文增强模型", slug: "qwen25-14b" },
    { id: "ds-r1-32b", name: "DeepSeek-R1-Distill-Qwen-32B", family: "推理增强模型", slug: "dsr1-32b" },
    { id: "internvl-8b", name: "InternVL2.5-8B", family: "多模态图文模型", slug: "internvl-8b" },
  ];
  const datasetOptions = [
    { id: "gov-hotline", name: "市政热线问答精选集", sampleCount: 52800, storageGb: 6.1, domain: "政务问答 / 中文", shortName: "热线问答", slug: "hotline-qa" },
    { id: "ops-maint", name: "装备运维知识库构建集", sampleCount: 148000, storageGb: 22.4, domain: "工业运维 / 指令式 SFT", shortName: "运维知识", slug: "ops-maint" },
    { id: "ticket-routing", name: "工单分类与处置轨迹集", sampleCount: 76400, storageGb: 8.7, domain: "分类 / 路由", shortName: "工单处置", slug: "ticket-routing" },
    { id: "vision-quality", name: "多模态质检图文对齐集", sampleCount: 182000, storageGb: 96, domain: "图像 + 文本", shortName: "质检图文", slug: "vision-quality" },
  ];

  const createHyperParams = (mode: FineTuneMode): FineTuneHyperParams =>
    mode === "快速微调"
      ? {
          learningRate: "2e-4",
          epochs: "3",
          batchSize: "16",
          loraRank: "16",
          warmupRatio: "0.03",
          scheduler: "cosine",
          precision: "bf16",
          maxSeqLength: "4096",
          gpuCount: "1",
          optimizer: "paged_adamw_32bit",
          weightDecay: "0.01",
          gradientAccumulation: "4",
          deepspeed: "关闭",
          validationSplit: "5%",
        }
      : {
          learningRate: "8e-5",
          epochs: "8",
          batchSize: "64",
          loraRank: "32",
          warmupRatio: "0.08",
          scheduler: "cosine_with_restarts",
          precision: "bf16",
          maxSeqLength: "8192",
          gpuCount: "4",
          optimizer: "adamw_torch_fused",
          weightDecay: "0.05",
          gradientAccumulation: "16",
          deepspeed: "ZeRO Stage 2",
          validationSplit: "10%",
        };

  const buildDatasetSummary = (datasetIds: string[]) => {
    const selected = datasetIds.map((id) => datasetOptions.find((item) => item.id === id)).filter(Boolean) as typeof datasetOptions;
    const fallback = [datasetOptions[0]];
    const finalSelected = selected.length > 0 ? selected : fallback;
    const totalSamples = finalSelected.reduce((sum, item) => sum + item.sampleCount, 0);
    const totalStorage = finalSelected.reduce((sum, item) => sum + item.storageGb, 0);
    const domains = Array.from(new Set(finalSelected.map((item) => item.domain)));
    return {
      selected: finalSelected,
      names: finalSelected.map((item) => item.name),
      shortNames: finalSelected.map((item) => item.shortName),
      slugs: finalSelected.map((item) => item.slug),
      label: finalSelected.map((item) => item.name).join("、"),
      shortLabel: finalSelected.length === 1 ? finalSelected[0].shortName : `${finalSelected[0].shortName}等${finalSelected.length}套数据`,
      sizeLabel: `${finalSelected.length} 个数据集 / ${totalSamples.toLocaleString("zh-CN")} 条样本 / ${totalStorage.toFixed(1)}GB`,
      domainLabel: domains.join(" + "),
    };
  };

  const buildTaskName = (mode: FineTuneMode, datasetIds: string[]) => {
    const summary = buildDatasetSummary(datasetIds);
    return mode === "快速微调" ? `${summary.shortLabel}快速增强微调` : `${summary.shortLabel}专家微调任务`;
  };

  const buildOutputModelName = (mode: FineTuneMode, modelId: string, datasetIds: string[]) => {
    const model = baseModelOptions.find((item) => item.id === modelId) ?? baseModelOptions[0];
    const summary = buildDatasetSummary(datasetIds);
    return `${summary.slugs[0]}${summary.slugs.length > 1 ? `-mix${summary.slugs.length}` : ""}-${model.slug}-${mode === "快速微调" ? "lora" : "sft"}-v${String(Date.now()).slice(-4)}`;
  };

  const initialTasks: FineTuneTask[] = [
    {
      id: "ft-201",
      name: "运维知识专家微调任务",
      mode: "专家微调",
      baseModel: "Qwen2.5-14B-Instruct",
      dataset: "装备运维知识库构建集",
      datasetSize: "148,000 条 / 22.4GB",
      progress: 12,
      status: "调度中",
      metric: "等待算力配额与数据快照",
      resourceSpec: "4 GPU / ZeRO Stage 2 / 预计 6 小时",
      queueLabel: "专家训练队列 #03",
      submittedAt: "2026-04-24 15:05:12",
      submittedBy: "算法工程师-张楠",
      outputModelName: "ops-maint-qwen25-14b-sft-v2",
      description: "针对运维知识问答、工单归因和复杂检索链路做专家级参数调优。",
      hyperParams: {
        ...createHyperParams("专家微调"),
        epochs: "10",
        batchSize: "48",
        gradientAccumulation: "24",
      },
      logLines: [
        "15:05:12 | 已提交专家微调任务，开始生成数据集快照。",
        "15:05:38 | 数据集校验完成，命中 148,000 条训练样本与 16,400 条验证样本。",
        "15:06:04 | 正在申请 4 张 A100 80GB 训练卡并初始化 ZeRO Stage 2 拓扑。",
      ],
      chart: [98, 97, 96, 95, 94, 93],
    },
    {
      id: "ft-202",
      name: "热线问答快速增强微调",
      mode: "快速微调",
      baseModel: "Qwen2.5-7B-Instruct",
      dataset: "市政热线问答精选集",
      datasetSize: "52,800 条 / 6.1GB",
      progress: 63,
      status: "训练中",
      metric: "loss 0.428 / eval 87.2%",
      resourceSpec: "1 GPU / LoRA / 预计 90 分钟",
      queueLabel: "快速微调通道 #01",
      submittedAt: "2026-04-24 14:48:26",
      submittedBy: "应用运营-陈雨",
      outputModelName: "hotline-qa-qwen25-7b-lora-v4",
      description: "面向市政热线问答场景的轻量增强，强调问答命中率和口语化表达。",
      hyperParams: createHyperParams("快速微调"),
      logLines: [
        "14:48:26 | 已进入快速微调通道，开始执行 LoRA 训练。",
        "14:49:10 | 模型权重挂载完成，已冻结基础层。",
        "14:50:02 | 第 1 轮训练完成，校验集准确率升至 81.4%。",
        "14:50:46 | 第 2 轮训练中，当前 loss 下降到 0.428。",
      ],
      chart: [95, 88, 78, 65, 54, 43],
    },
    {
      id: "ft-203",
      name: "工单处置快速增强微调",
      mode: "快速微调",
      baseModel: "Qwen2.5-7B-Instruct",
      dataset: "工单分类与处置轨迹集",
      datasetSize: "76,400 条 / 8.7GB",
      progress: 100,
      status: "训练结束",
      metric: "eval 93.6% / f1 0.918",
      resourceSpec: "1 GPU / LoRA / 实耗 68 分钟",
      queueLabel: "快速微调通道 #02",
      submittedAt: "2026-04-24 13:30:41",
      submittedBy: "平台管理员-刘杰",
      outputModelName: "ticket-routing-qwen25-7b-lora-v7",
      description: "用于工单分类、优先级判定和处置建议生成的快速增强版本。",
      hyperParams: {
        ...createHyperParams("快速微调"),
        epochs: "4",
      },
      logLines: [
        "13:30:41 | 已提交快速微调任务。",
        "13:31:12 | LoRA 训练容器启动完成。",
        "13:58:24 | 训练完成，开始离线评测。",
        "14:03:18 | 模型已注册到租户模型仓，并生成推理标签。",
      ],
      chart: [96, 82, 69, 51, 38, 27],
      trainedModel: {
        name: "ticket-routing-qwen25-7b-lora-v7",
        version: "v2026.04.24-203",
        registry: "registry://finetune/ticket-routing-qwen25-7b-lora-v7",
        adapter: "LoRA Adapter",
        quantization: "INT4 Serving + LoRA Merge",
        score: "eval 93.6% / f1 0.918",
        owner: "平台管理员-刘杰",
        visibility: "租户模型仓",
        readyAt: "2026-04-24 14:03:18",
        tags: ["Qwen2.5-7B-Instruct", "工单分类与处置轨迹集", "快速微调"],
      },
    },
    {
      id: "ft-204",
      name: "质检图文专家微调",
      mode: "专家微调",
      baseModel: "InternVL2.5-8B",
      dataset: "多模态质检图文对齐集",
      datasetSize: "182,000 对 / 96GB",
      progress: 28,
      status: "停止",
      metric: "已在 warmup 阶段手动停止",
      resourceSpec: "8 GPU / 多模态混合训练",
      queueLabel: "专家训练队列 #05",
      submittedAt: "2026-04-24 11:12:08",
      submittedBy: "视觉算法组-王舟",
      outputModelName: "vision-quality-internvl-sft-v1",
      description: "多模态质检问答与缺陷定位联合微调，已在 warmup 阶段停止。",
      hyperParams: {
        ...createHyperParams("专家微调"),
        gpuCount: "8",
        batchSize: "24",
        maxSeqLength: "6144",
      },
      logLines: [
        "11:12:08 | 已提交专家微调任务，开始准备视觉编码器权重。",
        "11:13:42 | 数据集切分完成，图文对齐样本通过率 98.4%。",
        "11:15:03 | 任务已手动停止，释放 GPU 与中间缓存。",
      ],
      chart: [99, 98, 97, 95, 94, 93],
    },
  ];

  const [tasks, setTasks] = useState<FineTuneTask[]>(initialTasks);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState("");
  const [draftMode, setDraftMode] = useState<FineTuneMode>("快速微调");
  const [draftBaseModelId, setDraftBaseModelId] = useState(baseModelOptions[0].id);
  const [draftDatasetIds, setDraftDatasetIds] = useState<string[]>([datasetOptions[0].id]);
  const [draftHyperParams, setDraftHyperParams] = useState<FineTuneHyperParams>(createHyperParams("快速微调"));
  const [modelTaskId, setModelTaskId] = useState<string | null>(null);
  const [logTaskId, setLogTaskId] = useState<string | null>(null);
  const [streamedLogLines, setStreamedLogLines] = useState<string[]>([]);
  const liveTasksRef = useRef<FineTuneTask[]>(tasks);
  const taskTimersRef = useRef<Record<string, number[]>>({});
  const pendingLifecycleTaskIdRef = useRef<string | null>(null);
  const logStreamTimerRef = useRef<number | null>(null);
  const logStreamCursorRef = useRef(0);
  const logStreamTailRef = useRef(0);

  const selectedDraftModel = baseModelOptions.find((item) => item.id === draftBaseModelId) ?? baseModelOptions[0];
  const selectedDraftDatasetSummary = buildDatasetSummary(draftDatasetIds);
  const previewTaskName = buildTaskName(draftMode, draftDatasetIds);
  const previewOutputModel = buildOutputModelName(draftMode, draftBaseModelId, draftDatasetIds);
  const modelTask = modelTaskId ? tasks.find((item) => item.id === modelTaskId) ?? null : null;
  const logTask = logTaskId ? tasks.find((item) => item.id === logTaskId) ?? null : null;
  const taskSummary = useMemo(() => {
    const scheduling = tasks.filter((item) => item.status === "调度中").length;
    const training = tasks.filter((item) => item.status === "训练中").length;
    const finished = tasks.filter((item) => item.status === "训练结束").length;
    const stopped = tasks.filter((item) => item.status === "停止").length;
    const averageProgress =
      tasks.filter((item) => item.status === "调度中" || item.status === "训练中").reduce((sum, item) => sum + item.progress, 0) /
      Math.max(1, scheduling + training);
    return {
      scheduling,
      training,
      finished,
      stopped,
      averageProgress: Math.round(averageProgress),
    };
  }, [tasks]);

  const resetCreateDraft = (mode: FineTuneMode = "快速微调") => {
    setDraftMode(mode);
    setDraftBaseModelId(baseModelOptions[0].id);
    setDraftDatasetIds([datasetOptions[0].id]);
    setDraftHyperParams(createHyperParams(mode));
    setCreateError("");
  };

  const clearTaskTimers = (taskId: string) => {
    const timers = taskTimersRef.current[taskId];
    if (timers) {
      timers.forEach((timer) => window.clearTimeout(timer));
      delete taskTimersRef.current[taskId];
    }
  };

  const updateHyperParam = (key: keyof FineTuneHyperParams, value: string) => {
    setDraftHyperParams((current) => ({ ...current, [key]: value }));
  };

  const toggleDraftDataset = (datasetId: string) => {
    setDraftDatasetIds((current) => {
      if (current.includes(datasetId)) {
        return current.length === 1 ? current : current.filter((id) => id !== datasetId);
      }
      return [...current, datasetId];
    });
  };

  const clearLogStream = () => {
    if (logStreamTimerRef.current) {
      window.clearTimeout(logStreamTimerRef.current);
      logStreamTimerRef.current = null;
    }
  };

  const scheduleTaskLifecycle = (taskId: string) => {
    clearTaskTimers(taskId);
    const task = liveTasksRef.current.find((item) => item.id === taskId);
    if (!task || task.status === "停止" || task.status === "训练结束") {
      return;
    }

    const isExpert = task.mode === "专家微调";
    const steps =
      task.status === "调度中"
        ? isExpert
          ? [
              {
                delay: 1800,
                patch: { progress: 18, metric: "数据快照完成 / 锁定专家队列资源" },
                log: "调度中心已完成数据快照，开始锁定 4 张训练卡和 ZeRO 拓扑。",
              },
              {
                delay: 5400,
                patch: { status: "训练中" as FineTuneTaskStatus, progress: 31, metric: "loss 1.246 / step 180" },
                chart: 88,
                log: "训练容器启动完成，开始执行专家级 warmup。",
                audit: { actor: "训练编排器", action: "专家微调任务进入训练阶段", target: task.name, result: "处理中" as const },
              },
              {
                delay: 11200,
                patch: { progress: 47, metric: "loss 0.864 / eval 78.3%" },
                chart: 73,
                log: "训练中：已完成第 2 个保存点，正在同步中间权重与验证集结果。",
              },
              {
                delay: 18600,
                patch: { progress: 68, metric: "loss 0.512 / eval 86.7%" },
                chart: 54,
                log: "训练中：梯度逐步收敛，开始回收低价值 checkpoint。",
              },
              {
                delay: 26200,
                patch: { progress: 91, metric: "loss 0.286 / eval 91.8%" },
                chart: 34,
                log: "训练中：进入最后评测阶段，准备生成最终模型版本。",
              },
              {
                delay: 32400,
                patch: { status: "训练结束" as FineTuneTaskStatus, progress: 100, metric: "eval 93.4% / ppl 3.6" },
                chart: 26,
                log: "训练完成，专家版模型已注册到模型仓并生成可部署版本。",
                audit: { actor: "训练编排器", action: "微调任务完成并生成模型版本", target: task.name, result: "成功" as const },
                complete: true,
              },
            ]
          : [
              {
                delay: 1500,
                patch: { progress: 15, metric: "队列检查通过 / 等待 GPU" },
                log: "快速微调通道已完成鉴权，准备锁定 1 张 GPU。",
              },
              {
                delay: 4200,
                patch: { status: "训练中" as FineTuneTaskStatus, progress: 28, metric: "loss 1.182 / step 96" },
                chart: 84,
                log: "训练容器已拉起，开始加载 LoRA 适配器。",
                audit: { actor: "训练编排器", action: "快速微调任务进入训练阶段", target: task.name, result: "处理中" as const },
              },
              {
                delay: 9800,
                patch: { progress: 52, metric: "loss 0.716 / eval 81.4%" },
                chart: 67,
                log: "训练中：已完成第 1 次评测，问答准确率开始稳定提升。",
              },
              {
                delay: 14800,
                patch: { progress: 79, metric: "loss 0.402 / eval 88.9%" },
                chart: 48,
                log: "训练中：开始导出最佳 LoRA checkpoint，并执行离线回放。",
              },
              {
                delay: 18800,
                patch: { status: "训练结束" as FineTuneTaskStatus, progress: 100, metric: "eval 92.3% / ppl 3.8" },
                chart: 36,
                log: "训练完成，模型版本已入库并生成推理标签。",
                audit: { actor: "训练编排器", action: "微调任务完成并生成模型版本", target: task.name, result: "成功" as const },
                complete: true,
              },
            ]
        : isExpert
          ? [
              {
                delay: 4200,
                patch: { progress: Math.max(task.progress, 74), metric: "loss 0.441 / eval 88.2%" },
                chart: 46,
                log: "训练中：分布式梯度同步正常，正在拉高专家评测集得分。",
              },
              {
                delay: 10600,
                patch: { progress: 92, metric: "loss 0.254 / eval 92.5%" },
                chart: 30,
                log: "训练中：开始导出最终专家检查点并执行全量回归评测。",
              },
              {
                delay: 16600,
                patch: { status: "训练结束" as FineTuneTaskStatus, progress: 100, metric: "eval 94.1% / rougeL 91.0" },
                chart: 22,
                log: "训练完成，专家版模型已推送到模型仓并准备部署。",
                audit: { actor: "训练编排器", action: "微调任务完成并生成模型版本", target: task.name, result: "成功" as const },
                complete: true,
              },
            ]
          : [
              {
                delay: 3200,
                patch: { progress: Math.max(task.progress, 76), metric: "loss 0.391 / eval 89.6%" },
                chart: 49,
                log: "训练中：进入最后微调轮次，梯度已明显收敛。",
              },
              {
                delay: 8600,
                patch: { progress: 93, metric: "loss 0.268 / eval 91.1%" },
                chart: 33,
                log: "训练中：开始导出最佳 checkpoint 并执行离线评测。",
              },
              {
                delay: 12200,
                patch: { status: "训练结束" as FineTuneTaskStatus, progress: 100, metric: "eval 93.0% / ppl 3.4" },
                chart: 27,
                log: "训练完成，LoRA 适配器已推送到租户模型仓。",
                audit: { actor: "训练编排器", action: "微调任务完成并生成模型版本", target: task.name, result: "成功" as const },
                complete: true,
              },
            ];

    taskTimersRef.current[taskId] = steps.map((step) =>
      window.setTimeout(() => {
        setTasks((items) =>
          items.map((item) => {
            if (item.id !== taskId) {
              return item;
            }

            const nextTask: FineTuneTask = {
              ...item,
              ...step.patch,
              chart: step.chart === undefined ? item.chart : [...item.chart, step.chart].slice(-8),
              logLines: step.log ? [...item.logLines, buildFineTuneLogLine(step.log)].slice(-36) : item.logLines,
            };

            if (step.complete) {
              nextTask.trainedModel = item.trainedModel ?? buildFineTuneModelVersion(nextTask);
            }

            return nextTask;
          }),
        );

        if (step.audit) {
          addAudit(step.audit);
        }
        if (step.complete) {
          clearTaskTimers(taskId);
        }
      }, step.delay),
    );
  };

  const stopTask = (task: FineTuneTask) => {
    if (task.status === "停止" || task.status === "训练结束") {
      return;
    }
    clearTaskTimers(task.id);
    setTasks((items) =>
      items.map((item) =>
        item.id === task.id
          ? {
              ...item,
              status: "停止",
              metric: `已在 ${item.progress}% 手动停止`,
              logLines: [...item.logLines, buildFineTuneLogLine("任务已被手动停止，资源已释放并保留当前日志。")].slice(-36),
            }
          : item,
      ),
    );
    addAudit({ actor: "训练编排器", action: "手动停止微调任务", target: task.name, result: "成功" });
  };

  const createTask = () => {
    if (!selectedDraftModel || draftDatasetIds.length === 0) {
      setCreateError("请至少选择一个数据集后再提交任务。");
      return;
    }

    const datasetSummary = buildDatasetSummary(draftDatasetIds);
    const nextTask: FineTuneTask = {
      id: `ft-${Date.now()}`,
      name: previewTaskName,
      mode: draftMode,
      baseModel: selectedDraftModel.name,
      dataset: datasetSummary.label,
      datasetSize: datasetSummary.sizeLabel,
      progress: 6,
      status: "调度中",
      metric: "任务已提交，等待调度",
      resourceSpec: draftMode === "快速微调" ? "1 GPU / LoRA / 预计 90 分钟" : `4 GPU / ${draftHyperParams.deepspeed} / 预计 6 小时`,
      queueLabel: draftMode === "快速微调" ? "快速微调通道 #03" : "专家训练队列 #06",
      submittedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
      submittedBy: "平台演示账号",
      outputModelName: previewOutputModel,
      description:
        draftMode === "快速微调"
          ? `基于 ${datasetSummary.domainLabel} 数据集进行轻量增强，只保留推荐参数。`
          : `基于 ${datasetSummary.domainLabel} 数据集进行专家级调优，可覆盖调度、训练和交付全流程。`,
      hyperParams: draftMode === "快速微调" ? createHyperParams("快速微调") : { ...draftHyperParams },
      logLines: [
        buildFineTuneLogLine(`已提交${draftMode}任务，准备处理 ${datasetSummary.label}。`),
        buildFineTuneLogLine(`基础模型已选为 ${selectedDraftModel.name}，共挂载 ${datasetSummary.selected.length} 个数据集。`),
      ],
      chart: draftMode === "快速微调" ? [97, 94, 91, 88, 84, 80] : [99, 98, 97, 96, 95, 94],
    };

    pendingLifecycleTaskIdRef.current = nextTask.id;
    setTasks((items) => [nextTask, ...items]);
    setIsCreateOpen(false);
    addAudit({ actor: "训练编排器", action: `提交${draftMode}任务`, target: `${nextTask.name} / ${nextTask.baseModel}`, result: "处理中" });
    resetCreateDraft();
  };

  useEffect(() => {
    liveTasksRef.current = tasks;
    if (pendingLifecycleTaskIdRef.current) {
      const targetTask = tasks.find((item) => item.id === pendingLifecycleTaskIdRef.current);
      if (targetTask) {
        scheduleTaskLifecycle(targetTask.id);
        pendingLifecycleTaskIdRef.current = null;
      }
    }
  }, [tasks]);

  useEffect(() => {
    setDraftHyperParams(createHyperParams(draftMode));
  }, [draftMode]);

  useEffect(() => {
    clearLogStream();
    if (!logTaskId) {
      setStreamedLogLines([]);
      return;
    }

    const cadence = [140, 760, 110, 320, 920, 180, 520, 120, 1280, 240, 460, 160, 680, 210];
    const chunkPattern = [3, 12, 2, 18, 4, 9, 1, 15, 5, 20, 2, 11, 6, 14];
    const currentTask = () => liveTasksRef.current.find((item) => item.id === logTaskId) ?? null;
    const task = currentTask();
    if (!task || (task.status !== "训练中" && task.status !== "训练结束")) {
      setStreamedLogLines(["[guard] 仅运行中和已完成任务可以查看日志监控"]);
      return;
    }

    const script = buildFineTunePlaybackScript(task);
    const initialBurst = Math.min(36, script.length);
    logStreamCursorRef.current = initialBurst;
    logStreamTailRef.current = 0;
    setStreamedLogLines(script.slice(0, initialBurst));

    const tick = () => {
      const latestTask = currentTask();
      if (!latestTask) {
        return;
      }

      setStreamedLogLines((lines) => {
        if (logStreamCursorRef.current < script.length) {
          const chunkSize = chunkPattern[(logStreamCursorRef.current + logStreamTailRef.current) % chunkPattern.length];
          const nextLines = script.slice(logStreamCursorRef.current, logStreamCursorRef.current + chunkSize);
          logStreamCursorRef.current += nextLines.length;
          return [...lines, ...nextLines].slice(-1000);
        }

        if (latestTask.status === "训练中") {
          const tailCount = 1 + ((logStreamTailRef.current + latestTask.progress) % 4);
          const nextTailStart = logStreamTailRef.current;
          const tailLines = Array.from({ length: tailCount }, (_, index) => buildFineTuneLiveTailLine(latestTask, nextTailStart + index + 1));
          logStreamTailRef.current += tailLines.length;
          return [...lines, ...tailLines].slice(-1000);
        }

        return lines;
      });

      const latestStatus = currentTask()?.status;
      if (logStreamCursorRef.current < script.length || latestStatus === "训练中") {
        const delay = cadence[(logStreamCursorRef.current + logStreamTailRef.current) % cadence.length];
        logStreamTimerRef.current = window.setTimeout(tick, delay);
      }
    };

    logStreamTimerRef.current = window.setTimeout(tick, 90);
    return () => clearLogStream();
  }, [logTaskId]);

  useEffect(() => {
    scheduleTaskLifecycle("ft-201");
    scheduleTaskLifecycle("ft-202");
    return () => {
      Object.keys(taskTimersRef.current).forEach((taskId) => clearTaskTimers(taskId));
      clearLogStream();
    };
  }, []);

  return (
    <ModuleScaffold scenarioKey="finetune">
      <section className="surface-panel">
        <SectionHeader
          eyebrow="FINE-TUNE CENTER"
          title="模型微调任务中心"
          description="主界面统一展示快速微调与专家微调任务，支持创建任务、查看训练后模型以及查看训练过程日志监控。"
        />
        <div className="inline-notice warn">
          <strong>训练中阶段等待更长</strong>
          <span>调度阶段主要完成数据快照、资源锁定和训练容器拉起；进入训练中后日志与指标会持续刷新，完成时间明显更长，以符合演示场景中的真实节奏。</span>
        </div>
        <div className="ft-status-grid">
          <div className="ft-status-card">
            <span>调度中</span>
            <strong>{taskSummary.scheduling}</strong>
            <small>平均进度 {taskSummary.averageProgress}%</small>
          </div>
          <div className="ft-status-card">
            <span>训练中</span>
            <strong>{taskSummary.training}</strong>
            <small>日志实时刷新</small>
          </div>
          <div className="ft-status-card">
            <span>训练结束</span>
            <strong>{taskSummary.finished}</strong>
            <small>可查看训练后模型</small>
          </div>
          <div className="ft-status-card">
            <span>停止</span>
            <strong>{taskSummary.stopped}</strong>
            <small>保留日志与中间进度</small>
          </div>
        </div>
        <div className="action-row">
          <Button
            icon={Plus}
            onClick={() => {
              resetCreateDraft("快速微调");
              setIsCreateOpen(true);
            }}
          >
            创建微调任务
          </Button>
          <StatusBadge tone="blue">{`${taskSummary.scheduling + taskSummary.training} 个进行中任务`}</StatusBadge>
          <StatusBadge tone="slate">快速微调与专家微调双模式</StatusBadge>
          <StatusBadge tone="emerald">数据集支持多选提交</StatusBadge>
        </div>
        <div className="allocation-summary compact">
          <KeyValue label="当前推荐基础模型" value={selectedDraftModel.name} />
          <KeyValue label="当前已选数据集" value={selectedDraftDatasetSummary.shortLabel} />
          <KeyValue label="数据集汇总" value={selectedDraftDatasetSummary.sizeLabel} />
          <KeyValue label="日志查看限制" value="仅训练中 / 训练结束可看日志" />
        </div>
      </section>

      <section className="surface-panel">
        <SectionHeader eyebrow="TASK LIST" title="调优任务列表" description="任务支持停止、调度中、训练中和训练结束等状态，右侧提供训练后模型查看与日志监控入口。" />
          <DataTable
          columns={["任务", "模式", "基础模型 / 数据集", "状态 / 进度", "资源 / 指标", "操作"]}
          rows={tasks.map((task) => [
            <div key={`${task.id}-name`} className="ft-task-cell">
                <strong>{task.name}</strong>
                <span>{task.outputModelName}</span>
                <small>{task.description}</small>
            </div>,
            <div key={`${task.id}-mode`} className="ft-mode-stack">
              <StatusBadge tone={task.mode === "快速微调" ? "blue" : "violet"}>{task.mode}</StatusBadge>
              <span className="table-note">{task.mode === "快速微调" ? "推荐参数提交" : "超参数自定义"}</span>
            </div>,
            <div key={`${task.id}-source`} className="ft-task-cell">
              <strong>{task.baseModel}</strong>
              <span>{task.dataset}</span>
              <small>{task.datasetSize}</small>
            </div>,
            <div key={`${task.id}-status`} className="ft-progress-cell">
              <StatusBadge tone={fineTuneStatusTone(task.status)} animated={task.status === "调度中" || task.status === "训练中"}>
                {task.status}
              </StatusBadge>
              <div className="ft-inline-progress">
                <span style={{ width: `${task.progress}%` }} />
              </div>
              <span className="table-note">{task.progress}%</span>
            </div>,
            <div key={`${task.id}-metric`} className="ft-task-cell">
              <strong>{task.resourceSpec}</strong>
              <span>{task.metric}</span>
              <small>{`${task.queueLabel} · ${task.submittedAt}`}</small>
            </div>,
            <div key={`${task.id}-actions`} className="table-action-stack">
              <button className="inline-action" disabled={!task.trainedModel} onClick={() => setModelTaskId(task.id)}>
                查看训练后模型
              </button>
              <button
                className="inline-action"
                disabled={task.status !== "训练中" && task.status !== "训练结束"}
                onClick={() => {
                  setLogTaskId(task.id);
                }}
              >
                查看日志监控
              </button>
              <button className="inline-action" disabled={task.status === "停止" || task.status === "训练结束"} onClick={() => stopTask(task)}>
                停止任务
              </button>
            </div>,
          ])}
        />
      </section>

      {isCreateOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsCreateOpen(false)}>
          <section className="modal-panel dev-create-modal" role="dialog" aria-modal="true" aria-labelledby="finetune-create-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">CREATE FINE-TUNE</span>
                <h3 id="finetune-create-title">创建微调任务</h3>
                <p>先选择快速微调或专家微调。快速微调只需要选择基础模型和一个或多个数据集；专家微调则可以继续配置各类模型超参数。</p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={() => setIsCreateOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ft-mode-grid">
              {(["快速微调", "专家微调"] as const).map((item) => (
                <button key={item} className={`ft-mode-card ${draftMode === item ? "is-active" : ""}`} onClick={() => setDraftMode(item)}>
                  <strong>{item}</strong>
                  <span>{item === "快速微调" ? "仅需选择基础模型和数据集，推荐参数自动填充。" : "在基础模型和数据集之外，开放多种训练超参数控制。"}</span>
                  <small>{item === "快速微调" ? "更快提交，更轻量" : "更细控制，更适合复杂场景"}</small>
                </button>
              ))}
            </div>

            {draftMode === "快速微调" ? (
              <>
                <div className="form-grid one-plus">
                  <label className="field">
                    <span>基础模型</span>
                    <select value={draftBaseModelId} onChange={(event) => setDraftBaseModelId(event.target.value)}>
                      {baseModelOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="field">
                  <span>数据集（可多选）</span>
                  <div className="ft-dataset-grid">
                    {datasetOptions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`ft-dataset-chip ${draftDatasetIds.includes(item.id) ? "is-active" : ""}`}
                        onClick={() => toggleDraftDataset(item.id)}
                      >
                        <strong>{item.name}</strong>
                        <span>{`${item.sampleCount.toLocaleString("zh-CN")} 条 / ${item.storageGb}GB`}</span>
                        <small>{item.domain}</small>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="allocation-summary compact">
                  <KeyValue label="资源规格" value="1 GPU / LoRA / 推荐参数" />
                  <KeyValue label="预计耗时" value="约 90 分钟，训练中阶段等待更长" />
                  <KeyValue label="已选数据集" value={selectedDraftDatasetSummary.shortLabel} />
                  <KeyValue label="输出模型" value={previewOutputModel} />
                </div>
                <div className="inline-notice ok">
                  <strong>快速微调仅需选择基础模型和数据集</strong>
                  <span>学习率、Epoch、LoRA Rank、调度优先级等参数由系统按推荐策略自动生成，提交后直接进入调度阶段。</span>
                </div>
              </>
            ) : (
              <>
                <div className="form-grid one-plus">
                  <label className="field">
                    <span>基础模型</span>
                    <select value={draftBaseModelId} onChange={(event) => setDraftBaseModelId(event.target.value)}>
                      {baseModelOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="field">
                  <span>数据集（可多选）</span>
                  <div className="ft-dataset-grid">
                    {datasetOptions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`ft-dataset-chip ${draftDatasetIds.includes(item.id) ? "is-active" : ""}`}
                        onClick={() => toggleDraftDataset(item.id)}
                      >
                        <strong>{item.name}</strong>
                        <span>{`${item.sampleCount.toLocaleString("zh-CN")} 条 / ${item.storageGb}GB`}</span>
                        <small>{item.domain}</small>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ft-hyper-grid">
                  <label className="field">
                    <span>学习率</span>
                    <input value={draftHyperParams.learningRate} onChange={(event) => updateHyperParam("learningRate", event.target.value)} />
                  </label>
                  <label className="field">
                    <span>Epoch</span>
                    <input value={draftHyperParams.epochs} onChange={(event) => updateHyperParam("epochs", event.target.value)} />
                  </label>
                  <label className="field">
                    <span>Batch Size</span>
                    <input value={draftHyperParams.batchSize} onChange={(event) => updateHyperParam("batchSize", event.target.value)} />
                  </label>
                  <label className="field">
                    <span>LoRA Rank</span>
                    <input value={draftHyperParams.loraRank} onChange={(event) => updateHyperParam("loraRank", event.target.value)} />
                  </label>
                  <label className="field">
                    <span>Warmup Ratio</span>
                    <input value={draftHyperParams.warmupRatio} onChange={(event) => updateHyperParam("warmupRatio", event.target.value)} />
                  </label>
                  <label className="field">
                    <span>Scheduler</span>
                    <input value={draftHyperParams.scheduler} onChange={(event) => updateHyperParam("scheduler", event.target.value)} />
                  </label>
                  <label className="field">
                    <span>Precision</span>
                    <input value={draftHyperParams.precision} onChange={(event) => updateHyperParam("precision", event.target.value)} />
                  </label>
                  <label className="field">
                    <span>Max Seq Length</span>
                    <input value={draftHyperParams.maxSeqLength} onChange={(event) => updateHyperParam("maxSeqLength", event.target.value)} />
                  </label>
                  <label className="field">
                    <span>GPU 数量</span>
                    <input value={draftHyperParams.gpuCount} onChange={(event) => updateHyperParam("gpuCount", event.target.value)} />
                  </label>
                  <label className="field">
                    <span>Optimizer</span>
                    <input value={draftHyperParams.optimizer} onChange={(event) => updateHyperParam("optimizer", event.target.value)} />
                  </label>
                  <label className="field">
                    <span>Weight Decay</span>
                    <input value={draftHyperParams.weightDecay} onChange={(event) => updateHyperParam("weightDecay", event.target.value)} />
                  </label>
                  <label className="field">
                    <span>Grad Accumulation</span>
                    <input value={draftHyperParams.gradientAccumulation} onChange={(event) => updateHyperParam("gradientAccumulation", event.target.value)} />
                  </label>
                  <label className="field">
                    <span>DeepSpeed</span>
                    <input value={draftHyperParams.deepspeed} onChange={(event) => updateHyperParam("deepspeed", event.target.value)} />
                  </label>
                  <label className="field">
                    <span>Validation Split</span>
                    <input value={draftHyperParams.validationSplit} onChange={(event) => updateHyperParam("validationSplit", event.target.value)} />
                  </label>
                </div>
              </>
            )}

            <div className="ft-preview-card">
              <span className="eyebrow">SUBMIT PREVIEW</span>
              <h4>{previewTaskName}</h4>
              <p>{`${selectedDraftModel.family} · ${selectedDraftDatasetSummary.domainLabel} · ${draftMode === "快速微调" ? "推荐参数自动提交" : "使用专家超参提交"}`}</p>
              <div className="allocation-summary compact">
                <KeyValue label="基础模型" value={selectedDraftModel.name} />
                <KeyValue label="数据集" value={selectedDraftDatasetSummary.label} />
                <KeyValue label="数据集汇总" value={selectedDraftDatasetSummary.sizeLabel} />
                <KeyValue label="输出模型" value={previewOutputModel} />
                <KeyValue label="任务状态" value="提交后先进入调度中" />
              </div>
            </div>

            {createError ? <div className="field-error">{createError}</div> : null}
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                取消
              </Button>
              <Button variant="secondary" icon={Wand2} onClick={createTask}>
                提交任务
              </Button>
            </div>
          </section>
        </div>
      ) : null}

      {modelTask ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setModelTaskId(null)}>
          <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="finetune-model-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">MODEL OUTPUT</span>
                <h3 id="finetune-model-title">训练后模型</h3>
                <p>{modelTask.name} 训练完成后的模型版本、模型仓地址、交付形态和评测结果。</p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={() => setModelTaskId(null)}>
                <X size={18} />
              </button>
            </div>
            {modelTask.trainedModel ? (
              <>
                <div className="allocation-summary compact">
                  <KeyValue label="模型名称" value={modelTask.trainedModel.name} />
                  <KeyValue label="模型版本" value={modelTask.trainedModel.version} />
                  <KeyValue label="模型仓地址" value={modelTask.trainedModel.registry} />
                  <KeyValue label="交付形态" value={modelTask.trainedModel.quantization} />
                  <KeyValue label="评测结果" value={modelTask.trainedModel.score} />
                  <KeyValue label="可见范围" value={modelTask.trainedModel.visibility} />
                  <KeyValue label="责任人" value={modelTask.trainedModel.owner} />
                  <KeyValue label="完成时间" value={modelTask.trainedModel.readyAt} />
                </div>
                <div className="ft-tag-strip">
                  {modelTask.trainedModel.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <LogPanel
                  title="模型交付说明"
                  lines={[
                    `model: ${modelTask.trainedModel.name}`,
                    `registry: ${modelTask.trainedModel.registry}`,
                    `adapter: ${modelTask.trainedModel.adapter}`,
                    `score: ${modelTask.trainedModel.score}`,
                    "next: 可直接进入模型部署或模型市场模块继续演示。",
                  ]}
                />
              </>
            ) : (
              <EmptyState icon={Eye} title="当前任务尚未产出模型" text="请等待任务进入训练结束状态后，再查看训练后模型。" />
            )}
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setModelTaskId(null)}>
                关闭
              </Button>
            </div>
          </section>
        </div>
      ) : null}

      {logTask ? (
        <div className="drawer-backdrop" role="presentation" onClick={() => setLogTaskId(null)}>
          <aside className="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="finetune-log-title" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className="eyebrow">LOG MONITOR</span>
                <h3 id="finetune-log-title">训练过程日志监控</h3>
                <p>{logTask.name} 的训练过程日志以流式方式播放，模拟真实训练中的突发输出、短暂停顿和长耗时评测阶段，单次打开最多保留约 1000 行。</p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={() => setLogTaskId(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="action-row">
              <StatusBadge tone={fineTuneStatusTone(logTask.status)} animated={logTask.status === "训练中"}>
                {logTask.status}
              </StatusBadge>
              <StatusBadge tone={logTask.mode === "快速微调" ? "blue" : "violet"}>{logTask.mode}</StatusBadge>
              <StatusBadge tone="slate">{logTask.queueLabel}</StatusBadge>
            </div>
            <ProgressBar value={logTask.progress} label="当前任务进度" />
            <div className="metric-strip">
              <MetricMini label="当前指标" value={logTask.metric} />
              <MetricMini label="基础模型" value={logTask.baseModel} />
              <MetricMini label="数据集" value={logTask.dataset} />
              <MetricMini label="输出模型" value={logTask.outputModelName} />
            </div>
            <StepRail steps={["任务提交", "资源调度", "训练执行", "模型产出"]} active={fineTuneStepIndex(logTask.status)} />
            <LogPanel title="训练日志监控（最多保留 1000 行）" lines={streamedLogLines} />
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setLogTaskId(null)}>
                关闭监控
              </Button>
              <Button variant="secondary" icon={Eye} disabled={!logTask.trainedModel} onClick={() => setModelTaskId(logTask.id)}>
                查看训练后模型
              </Button>
              <Button variant="secondary" icon={StopCircle} disabled={logTask.status === "停止" || logTask.status === "训练结束"} onClick={() => stopTask(logTask)}>
                停止任务
              </Button>
            </div>
          </aside>
        </div>
      ) : null}
    </ModuleScaffold>
  );
}

function InferenceTaskPage({ addAudit }: { addAudit: (event: Omit<AuditEvent, "id" | "time">) => void }) {
  const engineOptions = ["vLLM 0.8.5", "vLLM 0.8.4", "vLLM 0.8.3"];
  const modeOptions: Array<{ mode: InferenceMode; title: string; description: string }> = [
    {
      mode: "单机模式",
      title: "单机模式",
      description: "单个 vLLM 服务同时承担 Prefill 和 Decode，适合验证环境和低并发业务。",
    },
    {
      mode: "PD 分离模式",
      title: "PD 分离模式",
      description: "通过 Router 接入流量，将 Prefill 和 Decode 拆分为独立实例池，适合生产级高并发推理。",
    },
  ];
  const modelOptions = ["Qwen2.5-72B-Instruct", "Qwen2.5-14B-Instruct", "DeepSeek-R1-Distill-Qwen-32B", "InternVL2.5-8B", "Llama-3.3-70B-Instruct"];
  const clusterOptions = ["跨云推理集群 B", "华东训练集群 A", "政务专有集群 C"];
  const routePolicyOptions = ["TTFT 优先 + Decode 负载均衡", "按租户优先级 + Prefill 热点分桶", "首包时延优先 + 空闲 Decode 回填"];
  const kvCacheOptions = ["FP8 E5M2", "BF16", "FP16"];
  const parseCount = (value: string) => Math.max(0, Number(value) || 0);
  const createDefaultDraft = (mode: InferenceMode = "PD 分离模式") => ({
    taskName: mode === "PD 分离模式" ? "政务问答-pd-vllm" : "政务问答-single-vllm",
    mode,
    model: mode === "PD 分离模式" ? "Qwen2.5-72B-Instruct" : "Qwen2.5-14B-Instruct",
    cluster: "跨云推理集群 B",
    namespace: "inference-prod",
    serviceName: mode === "PD 分离模式" ? "gov-qa-pd" : "gov-qa-single",
    engineVersion: engineOptions[0],
    maxModelLen: mode === "PD 分离模式" ? "32768" : "16384",
    maxNumSeqs: mode === "PD 分离模式" ? "256" : "96",
    kvCache: mode === "PD 分离模式" ? "FP8 E5M2" : "FP16",
    routePolicy: routePolicyOptions[0],
    routerReplicas: 2,
    routerMin: 2,
    routerMax: 4,
    routerSpec: "4C / 8GB",
    prefillReplicas: 2,
    prefillMin: 2,
    prefillMax: 6,
    prefillSpec: "L40S x2 / 96GB",
    decodeReplicas: 6,
    decodeMin: 4,
    decodeMax: 12,
    decodeSpec: "L40S x1 / 48GB",
    singleReplicas: 2,
    singleMin: 2,
    singleMax: 4,
    singleSpec: "L40S x4 / 192GB",
    notes:
      mode === "PD 分离模式"
        ? "优先保证首 Token 时延，Decode 池随并发流量自动扩展。"
        : "适用于低并发验证环境，统一通过单机服务承载推理链路。",
  });

  const [tasks, setTasks] = useState<InferenceTask[]>(() => cloneInferenceTasks(initialInferenceTasks));
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [createError, setCreateError] = useState("");
  const [createDraft, setCreateDraft] = useState(() => createDefaultDraft());
  const [monitorTaskId, setMonitorTaskId] = useState<string | null>(null);
  const [monitorTick, setMonitorTick] = useState(0);
  const timerRefs = useRef<number[]>([]);

  const runningCount = tasks.filter((item) => item.status === "运行中").length;
  const pdCount = tasks.filter((item) => item.mode === "PD 分离模式").length;
  const scalingCount = tasks.filter((item) => item.status === "扩缩容中").length;
  const totalRolePools = tasks.reduce((sum, item) => sum + (item.mode === "PD 分离模式" ? 3 : 1), 0);
  const isPdMode = createDraft.mode === "PD 分离模式";
  const monitorTask = monitorTaskId ? tasks.find((item) => item.id === monitorTaskId) ?? null : null;
  const monitorSnapshot = useMemo(() => (monitorTask ? buildInferenceMonitorSnapshot(monitorTask, monitorTick) : null), [monitorTask, monitorTick]);
  const createPreviewEndpoint = buildInferenceEndpoint(createDraft.serviceName, createDraft.namespace);
  const createPreviewLines = isPdMode
    ? [
        "framework: vllm",
        "mode: pd-disaggregation",
        `engine: ${createDraft.engineVersion}`,
        `model: ${createDraft.model}`,
        `router: ${createDraft.routerReplicas} replicas (${createDraft.routerMin}-${createDraft.routerMax}) / ${createDraft.routerSpec}`,
        `prefill: ${createDraft.prefillReplicas} replicas (${createDraft.prefillMin}-${createDraft.prefillMax}) / ${createDraft.prefillSpec}`,
        `decode: ${createDraft.decodeReplicas} replicas (${createDraft.decodeMin}-${createDraft.decodeMax}) / ${createDraft.decodeSpec}`,
        `route_policy: ${createDraft.routePolicy}`,
        `kv_cache: ${createDraft.kvCache}`,
        `endpoint: ${createPreviewEndpoint}`,
      ]
    : [
        "framework: vllm",
        "mode: single-instance",
        `engine: ${createDraft.engineVersion}`,
        `model: ${createDraft.model}`,
        `replicas: ${createDraft.singleReplicas} (${createDraft.singleMin}-${createDraft.singleMax}) / ${createDraft.singleSpec}`,
        `max_model_len: ${createDraft.maxModelLen}`,
        `max_num_seqs: ${createDraft.maxNumSeqs}`,
        `kv_cache: ${createDraft.kvCache}`,
        `endpoint: ${createPreviewEndpoint}`,
      ];

  const resetCreateDraft = (mode: InferenceMode = "PD 分离模式") => {
    setCreateStep(1);
    setCreateError("");
    setCreateDraft(createDefaultDraft(mode));
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setCreateError("");
    setCreateStep(1);
  };

  const openCreateModal = () => {
    resetCreateDraft("PD 分离模式");
    setIsCreateOpen(true);
  };

  useEffect(() => {
    return () => {
      timerRefs.current.forEach((timer) => window.clearTimeout(timer));
      timerRefs.current = [];
    };
  }, []);

  useEffect(() => {
    if (!monitorTaskId) {
      return;
    }

    const timer = window.setInterval(() => {
      setMonitorTick((value) => value + 1);
    }, 1800);

    return () => window.clearInterval(timer);
  }, [monitorTaskId]);

  const scheduleInferenceStatus = (taskId: string, nextStatus: InferenceTaskStatus, delay = 1400) => {
    const timer = window.setTimeout(() => {
      setTasks((items) => items.map((item) => (item.id === taskId ? { ...item, status: nextStatus } : item)));
    }, delay);
    timerRefs.current.push(timer);
  };

  const handleLifecycleAction = (task: InferenceTask, action: InferenceLifecycleAction) => {
    if (action === "start") {
      setTasks((items) => items.map((item) => (item.id === task.id ? { ...item, status: "创建中" } : item)));
      scheduleInferenceStatus(task.id, "运行中", 1500);
      addAudit({ actor: "实例生命周期", action: "启动推理实例", target: task.name, result: "处理中" });
      return;
    }

    if (action === "stop") {
      setTasks((items) => items.map((item) => (item.id === task.id ? { ...item, status: "待调整" } : item)));
      addAudit({ actor: "实例生命周期", action: "停止推理实例", target: task.name, result: "成功" });
      return;
    }

    if (action === "delete") {
      setTasks((items) => items.filter((item) => item.id !== task.id));
      setMonitorTaskId((current) => (current === task.id ? null : current));
      addAudit({ actor: "实例生命周期", action: "删除推理实例", target: task.name, result: "成功" });
      return;
    }
  };

  const createTask = () => {
    const taskName = createDraft.taskName.trim();
    const namespace = createDraft.namespace.trim();
    const serviceName = createDraft.serviceName.trim();

    if (!taskName) {
      setCreateError("请填写推理任务名称。");
      return;
    }

    if (!namespace) {
      setCreateError("请填写命名空间。");
      return;
    }

    if (!serviceName || !/^[a-z0-9-]+$/.test(serviceName)) {
      setCreateError("服务名仅支持小写字母、数字和中划线。");
      return;
    }

    if (tasks.some((item) => item.name === taskName || item.serviceName === serviceName)) {
      setCreateError("任务名称或服务名已存在，请调整后再创建。");
      return;
    }

    if (isPdMode) {
      if (createDraft.routerReplicas < 1 || createDraft.prefillReplicas < 1 || createDraft.decodeReplicas < 1) {
        setCreateError("PD 分离模式下 Router、Prefill 和 Decode 副本数均需大于 0。");
        return;
      }

      if (createDraft.routerMin > createDraft.routerMax || createDraft.prefillMin > createDraft.prefillMax || createDraft.decodeMin > createDraft.decodeMax) {
        setCreateError("请检查各角色的扩缩容区间，最小副本数不能大于最大副本数。");
        return;
      }

      if (createDraft.decodeReplicas < createDraft.prefillReplicas) {
        setCreateError("PD 分离模式建议 Decode 副本数不少于 Prefill，以保证续写吞吐。");
        return;
      }
    } else {
      if (createDraft.singleReplicas < 1) {
        setCreateError("单机模式至少需要 1 个实例副本。");
        return;
      }

      if (createDraft.singleMin > createDraft.singleMax) {
        setCreateError("单机模式的最小副本数不能大于最大副本数。");
        return;
      }
    }

    const nextTask: InferenceTask = {
      id: `inf-${Date.now()}`,
      name: taskName,
      framework: "vLLM",
      engineVersion: createDraft.engineVersion,
      mode: createDraft.mode,
      model: createDraft.model,
      cluster: createDraft.cluster,
      namespace,
      serviceName,
      endpoint: buildInferenceEndpoint(serviceName, namespace),
      createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
      createdBy: "平台运营员",
      status: "创建中",
      routePolicy: isPdMode ? createDraft.routePolicy : "单机直连",
      maxModelLen: createDraft.maxModelLen,
      maxNumSeqs: createDraft.maxNumSeqs,
      kvCache: createDraft.kvCache,
      routerReplicas: isPdMode ? createDraft.routerReplicas : 0,
      routerMin: isPdMode ? createDraft.routerMin : 0,
      routerMax: isPdMode ? createDraft.routerMax : 0,
      routerSpec: isPdMode ? createDraft.routerSpec : "",
      prefillReplicas: isPdMode ? createDraft.prefillReplicas : 0,
      prefillMin: isPdMode ? createDraft.prefillMin : 0,
      prefillMax: isPdMode ? createDraft.prefillMax : 0,
      prefillSpec: isPdMode ? createDraft.prefillSpec : "",
      decodeReplicas: isPdMode ? createDraft.decodeReplicas : 0,
      decodeMin: isPdMode ? createDraft.decodeMin : 0,
      decodeMax: isPdMode ? createDraft.decodeMax : 0,
      decodeSpec: isPdMode ? createDraft.decodeSpec : "",
      singleReplicas: isPdMode ? 0 : createDraft.singleReplicas,
      singleMin: isPdMode ? 0 : createDraft.singleMin,
      singleMax: isPdMode ? 0 : createDraft.singleMax,
      singleSpec: isPdMode ? "" : createDraft.singleSpec,
      notes: createDraft.notes.trim(),
    };

    setTasks((items) => [nextTask, ...items]);
    setIsCreateOpen(false);
    resetCreateDraft(createDraft.mode);
    addAudit({
      actor: "推理编排器",
      action: `提交${nextTask.mode}推理任务`,
      target: `${nextTask.name} / ${nextTask.model}`,
      result: "处理中",
    });

    const timer = window.setTimeout(() => {
      setTasks((items) => items.map((item) => (item.id === nextTask.id ? { ...item, status: "运行中" } : item)));
    }, 1600);
    timerRefs.current.push(timer);
  };

  return (
    <ModuleScaffold scenarioKey="inference">
      <section className="surface-panel inference-summary-panel">
        <div className="cloud-panel-head">
          <div className="inference-summary-head">
            <span className="eyebrow">VLLM INFERENCE</span>
            <h2>模型推理任务</h2>
            <p>vLLM 单机与 PD 分离推理任务，重点演示 Router / Prefill / Decode 扩缩容。</p>
          </div>
          <div className="inference-summary-actions">
            <StatusBadge tone="cyan">{`${pdCount} 个 PD 分离`}</StatusBadge>
            <Button icon={Plus} onClick={openCreateModal}>
              创建推理任务
            </Button>
          </div>
        </div>
        <div className="inference-summary-strip">
          <StatusBadge tone="blue">{`${tasks.length} 个推理任务`}</StatusBadge>
          <StatusBadge tone="emerald">{`${runningCount} 个运行中`}</StatusBadge>
          <StatusBadge tone="amber">{`${scalingCount} 个扩缩容中`}</StatusBadge>
          <StatusBadge tone="slate">{`${totalRolePools} 个角色池`}</StatusBadge>
          <span className="inference-summary-tip">PD 模式创建后会直接进入实例列表。</span>
        </div>
      </section>

      <section className="surface-panel">
        <SectionHeader eyebrow="INSTANCE LIST" title="推理实例列表" description="统一展示当前 vLLM 推理任务、部署模式、角色实例规模和服务入口，右侧直接提供启动、停止、删除和服务监控操作。" />
        <DataTable
          columns={["任务", "模式 / 框架", "模型 / 集群", "角色实例", "扩缩容区间", "服务地址", "状态", "操作"]}
          rows={tasks.map((task) => [
            <div key={`${task.id}-name`} className="inference-list-cell">
              <strong>{task.name}</strong>
              <span>{`${task.namespace} / ${task.serviceName}`}</span>
            </div>,
            <div key={`${task.id}-mode`} className="inference-list-cell">
              <strong>{task.mode}</strong>
              <span>{`${task.framework} · ${task.engineVersion}`}</span>
            </div>,
            <div key={`${task.id}-model`} className="inference-list-cell">
              <strong>{task.model}</strong>
              <span>{task.cluster}</span>
            </div>,
            <div key={`${task.id}-roles`} className="inference-list-cell">
              <strong>
                {task.mode === "PD 分离模式"
                  ? `Router ${task.routerReplicas} / Prefill ${task.prefillReplicas} / Decode ${task.decodeReplicas}`
                  : `单机 ${task.singleReplicas} 实例`}
              </strong>
              <span>{task.mode === "PD 分离模式" ? task.routePolicy : "单机统一服务"}</span>
            </div>,
            <div key={`${task.id}-scaling`} className="inference-list-cell">
              <strong>
                {task.mode === "PD 分离模式"
                  ? `R ${task.routerMin}-${task.routerMax} / P ${task.prefillMin}-${task.prefillMax} / D ${task.decodeMin}-${task.decodeMax}`
                  : `${task.singleMin}-${task.singleMax}`}
              </strong>
              <span>{task.mode === "PD 分离模式" ? "按角色独立扩缩" : "单机副本扩缩"}</span>
            </div>,
            <span key={`${task.id}-endpoint`} className="deployment-url">
              {task.endpoint}
            </span>,
            <StatusBadge key={`${task.id}-status`} tone={inferenceStatusTone(task.status)} animated={task.status !== "运行中"}>
              {task.status}
            </StatusBadge>,
            <div key={`${task.id}-actions`} className="table-action-stack">
              <button className="inline-action" disabled={task.status === "运行中" || task.status === "创建中"} onClick={() => handleLifecycleAction(task, "start")}>
                启动
              </button>
              <button className="inline-action" disabled={task.status === "待调整" || task.status === "创建中"} onClick={() => handleLifecycleAction(task, "stop")}>
                停止
              </button>
              <button className="inline-action" onClick={() => handleLifecycleAction(task, "delete")}>
                删除
              </button>
              <button className="inline-action" onClick={() => setMonitorTaskId(task.id)}>
                服务监控
              </button>
            </div>,
          ])}
        />
      </section>

      {monitorTask && monitorSnapshot ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setMonitorTaskId(null)}>
          <section className="modal-panel inference-monitor-modal" role="dialog" aria-modal="true" aria-labelledby="inference-monitor-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">SERVICE MONITOR</span>
                <h3 id="inference-monitor-title">服务监控</h3>
                <p>基于实例模式和角色规模生成真实风格监控数据，覆盖请求负载、时延、GPU 利用率、告警和最近变更；趋势数据会按真实监控节奏自动滚动刷新。</p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={() => setMonitorTaskId(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="action-row">
              <StatusBadge tone={inferenceStatusTone(monitorTask.status)} animated={monitorTask.status !== "运行中"}>
                {monitorTask.status}
              </StatusBadge>
              <StatusBadge tone={monitorTask.mode === "PD 分离模式" ? "cyan" : "blue"}>{monitorTask.mode}</StatusBadge>
              <StatusBadge tone="slate">{`${monitorTask.namespace} / ${monitorTask.serviceName}`}</StatusBadge>
            </div>
            <section className="metric-grid inference-monitor-metrics">
              <MetricCard icon={Activity} label="当前 QPS" value={monitorSnapshot.currentQps} unit="req/s" tone="blue" />
              <MetricCard icon={Zap} label="TTFT P95" value={monitorSnapshot.ttftP95} unit="" tone="amber" />
              <MetricCard icon={Gauge} label="端到端 P95" value={monitorSnapshot.e2eP95} unit="" tone="emerald" />
              <MetricCard icon={CheckCircle2} label="成功率" value={monitorSnapshot.successRate} unit="" tone="emerald" />
              <MetricCard icon={Cpu} label="GPU 利用率" value={monitorSnapshot.gpuUtilization} unit="" tone="violet" />
              <MetricCard icon={Database} label="KV Cache 命中" value={monitorSnapshot.kvHitRate} unit="" tone="cyan" />
            </section>
            <section className="surface-panel inference-inner-panel">
              <SectionHeader eyebrow="REALTIME TREND" title="实时趋势" description="模拟最近 15 分钟的实时走势，弹窗打开后会持续刷新，便于演示线上服务波动与负载变化。" />
              <MiniChart values={monitorSnapshot.trend} />
              <div className="metric-strip">
                <MetricMini label="排队深度" value={monitorSnapshot.queueDepth} />
                <MetricMini label="并发请求" value={monitorSnapshot.inflightRequests} />
                <MetricMini label="输出吞吐" value={monitorSnapshot.outputTokens} />
              </div>
            </section>
            <section className="surface-panel inference-inner-panel">
              <SectionHeader eyebrow="ROLE METRICS" title="角色级监控" description="按 Router、Prefill、Decode 或单机实例池拆分观察请求量、关键时延和吞吐。" />
              <div className="inference-runtime-grid">
                {monitorSnapshot.roles.map((role) => (
                  <article key={role.id} className="inference-runtime-card">
                    <div className="inference-runtime-head">
                      <div>
                        <span>{role.role}</span>
                        <strong>{role.summary}</strong>
                      </div>
                      <StatusBadge tone="blue">{role.replicas}</StatusBadge>
                    </div>
                    <div className="allocation-summary compact">
                      <KeyValue label="规格" value={role.spec} />
                      <KeyValue label="QPS" value={role.qps} />
                      <KeyValue label="时延" value={role.latency} />
                      <KeyValue label="利用率" value={role.utilization} />
                      <KeyValue label="吞吐" value={role.throughput} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className="surface-panel inference-inner-panel">
              <SectionHeader eyebrow="ALERTS" title="当前告警" description="汇总当前扩缩容提示、SLO 状态和缓存命中情况，便于快速识别是否需要人工干预。" />
              <div className="inference-alert-list">
                {monitorSnapshot.alerts.map((alert) => (
                  <article key={alert.id} className="inference-alert-item">
                    <div>
                      <strong>{alert.title}</strong>
                      <p>{alert.detail}</p>
                    </div>
                    <div className="inference-event-meta">
                      <span>{alert.time}</span>
                      <StatusBadge tone={inferenceAlertTone(alert.level)}>{alert.level}</StatusBadge>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className="surface-panel inference-inner-panel">
              <SectionHeader eyebrow="CHANGE EVENTS" title="最近变更" description="保留服务发布、策略变更和健康巡检记录，便于和生命周期动作做联动演示。" />
              <div className="inference-event-list">
                {monitorSnapshot.events.map((event) => (
                  <article key={event.id} className="inference-event-item">
                    <div>
                      <strong>{event.title}</strong>
                      <p>{event.detail}</p>
                    </div>
                    <div className="inference-event-meta">
                      <span>{event.time}</span>
                      <StatusBadge tone={resultTone(event.result)}>{event.result}</StatusBadge>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setMonitorTaskId(null)}>
                关闭监控
              </Button>
            </div>
          </section>
        </div>
      ) : null}

      {isCreateOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={closeCreateModal}>
          <section className="modal-panel inference-create-modal" role="dialog" aria-modal="true" aria-labelledby="inference-create-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">CREATE INFERENCE</span>
                <h3 id="inference-create-title">创建推理任务</h3>
                <p>基于 vLLM 选择单机模式或 PD 分离模式。第 11 条重点能力默认落在 PD 分离模式，支持 Router、Prefill、Decode 角色的副本与扩缩容配置。</p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={closeCreateModal}>
                <X size={18} />
              </button>
            </div>
            <StepRail steps={["选择模式与基础信息", "配置角色与扩缩容"]} active={createStep - 1} />

            {createStep === 1 ? (
              <>
                <div className="inference-mode-grid">
                  {modeOptions.map((item) => (
                    <button
                      key={item.mode}
                      type="button"
                      className={`inference-mode-card ${createDraft.mode === item.mode ? "selected" : ""}`}
                      onClick={() => {
                        setCreateDraft(createDefaultDraft(item.mode));
                        setCreateError("");
                      }}
                    >
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </button>
                  ))}
                </div>
                <div className="form-grid two">
                  <label className="field">
                    <span>推理任务名称</span>
                    <input value={createDraft.taskName} onChange={(event) => setCreateDraft((current) => ({ ...current, taskName: event.target.value }))} />
                  </label>
                  <div className="field readonly-field">
                    <span>推理框架</span>
                    <strong>vLLM</strong>
                  </div>
                  <label className="field">
                    <span>引擎版本</span>
                    <select value={createDraft.engineVersion} onChange={(event) => setCreateDraft((current) => ({ ...current, engineVersion: event.target.value }))}>
                      {engineOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>模型名称</span>
                    <select value={createDraft.model} onChange={(event) => setCreateDraft((current) => ({ ...current, model: event.target.value }))}>
                      {modelOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>目标集群</span>
                    <select value={createDraft.cluster} onChange={(event) => setCreateDraft((current) => ({ ...current, cluster: event.target.value }))}>
                      {clusterOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>命名空间</span>
                    <input value={createDraft.namespace} onChange={(event) => setCreateDraft((current) => ({ ...current, namespace: event.target.value }))} />
                  </label>
                  <label className="field">
                    <span>服务名</span>
                    <input value={createDraft.serviceName} onChange={(event) => setCreateDraft((current) => ({ ...current, serviceName: event.target.value }))} />
                  </label>
                  <div className="field readonly-field">
                    <span>服务预览地址</span>
                    <strong>{createPreviewEndpoint}</strong>
                  </div>
                </div>
                <div className="allocation-summary compact">
                  <KeyValue label="当前模式" value={createDraft.mode} />
                  <KeyValue label="推荐架构" value={isPdMode ? "Router + Prefill + Decode" : "单机统一服务"} />
                  <KeyValue label="目标模型" value={createDraft.model} />
                  <KeyValue label="目标集群" value={createDraft.cluster} />
                </div>
                <div className={`inline-notice ${isPdMode ? "ok" : "warn"}`}>
                  <strong>{isPdMode ? "PD 模式填写顺序" : "单机模式提示"}</strong>
                  <span>
                    {isPdMode
                      ? "先固定 Router 接入与命名空间，再按 Prefill 首包能力和 Decode 吞吐能力分别填写副本数与扩缩容上限。"
                      : "单机模式只需要设置统一实例池，适合快速验证，不单独拆分 Prefill 与 Decode 角色。"}
                  </span>
                </div>
              </>
            ) : (
              <>
                {isPdMode ? (
                  <>
                    <SectionHeader
                      eyebrow="PD ROLE CONFIG"
                      title="Router / Prefill / Decode 角色编排"
                      description="按第 11 条要求分别管理三类角色的当前实例、副本区间和资源规格，形成 PD 分离推理实例。"
                    />
                    <div className="inference-role-grid">
                      <article className="inference-role-card">
                        <span>Router</span>
                        <strong>统一接入与流量编排</strong>
                        <div className="form-grid three">
                          <label className="field">
                            <span>当前副本</span>
                            <input type="number" min="1" value={createDraft.routerReplicas} onChange={(event) => setCreateDraft((current) => ({ ...current, routerReplicas: parseCount(event.target.value) }))} />
                          </label>
                          <label className="field">
                            <span>最小副本</span>
                            <input type="number" min="1" value={createDraft.routerMin} onChange={(event) => setCreateDraft((current) => ({ ...current, routerMin: parseCount(event.target.value) }))} />
                          </label>
                          <label className="field">
                            <span>最大副本</span>
                            <input type="number" min="1" value={createDraft.routerMax} onChange={(event) => setCreateDraft((current) => ({ ...current, routerMax: parseCount(event.target.value) }))} />
                          </label>
                        </div>
                        <label className="field">
                          <span>资源规格</span>
                          <input value={createDraft.routerSpec} onChange={(event) => setCreateDraft((current) => ({ ...current, routerSpec: event.target.value }))} />
                        </label>
                      </article>
                      <article className="inference-role-card">
                        <span>Prefill</span>
                        <strong>首 Token 与长上下文预填充</strong>
                        <div className="form-grid three">
                          <label className="field">
                            <span>当前副本</span>
                            <input type="number" min="1" value={createDraft.prefillReplicas} onChange={(event) => setCreateDraft((current) => ({ ...current, prefillReplicas: parseCount(event.target.value) }))} />
                          </label>
                          <label className="field">
                            <span>最小副本</span>
                            <input type="number" min="1" value={createDraft.prefillMin} onChange={(event) => setCreateDraft((current) => ({ ...current, prefillMin: parseCount(event.target.value) }))} />
                          </label>
                          <label className="field">
                            <span>最大副本</span>
                            <input type="number" min="1" value={createDraft.prefillMax} onChange={(event) => setCreateDraft((current) => ({ ...current, prefillMax: parseCount(event.target.value) }))} />
                          </label>
                        </div>
                        <label className="field">
                          <span>资源规格</span>
                          <input value={createDraft.prefillSpec} onChange={(event) => setCreateDraft((current) => ({ ...current, prefillSpec: event.target.value }))} />
                        </label>
                      </article>
                      <article className="inference-role-card">
                        <span>Decode</span>
                        <strong>续写吞吐与稳定输出</strong>
                        <div className="form-grid three">
                          <label className="field">
                            <span>当前副本</span>
                            <input type="number" min="1" value={createDraft.decodeReplicas} onChange={(event) => setCreateDraft((current) => ({ ...current, decodeReplicas: parseCount(event.target.value) }))} />
                          </label>
                          <label className="field">
                            <span>最小副本</span>
                            <input type="number" min="1" value={createDraft.decodeMin} onChange={(event) => setCreateDraft((current) => ({ ...current, decodeMin: parseCount(event.target.value) }))} />
                          </label>
                          <label className="field">
                            <span>最大副本</span>
                            <input type="number" min="1" value={createDraft.decodeMax} onChange={(event) => setCreateDraft((current) => ({ ...current, decodeMax: parseCount(event.target.value) }))} />
                          </label>
                        </div>
                        <label className="field">
                          <span>资源规格</span>
                          <input value={createDraft.decodeSpec} onChange={(event) => setCreateDraft((current) => ({ ...current, decodeSpec: event.target.value }))} />
                        </label>
                      </article>
                    </div>
                    <div className="form-grid two">
                      <label className="field">
                        <span>路由策略</span>
                        <select value={createDraft.routePolicy} onChange={(event) => setCreateDraft((current) => ({ ...current, routePolicy: event.target.value }))}>
                          {routePolicyOptions.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        <span>KV Cache 精度</span>
                        <select value={createDraft.kvCache} onChange={(event) => setCreateDraft((current) => ({ ...current, kvCache: event.target.value }))}>
                          {kvCacheOptions.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        <span>Max Model Len</span>
                        <input value={createDraft.maxModelLen} onChange={(event) => setCreateDraft((current) => ({ ...current, maxModelLen: event.target.value }))} />
                      </label>
                      <label className="field">
                        <span>Max Num Seqs</span>
                        <input value={createDraft.maxNumSeqs} onChange={(event) => setCreateDraft((current) => ({ ...current, maxNumSeqs: event.target.value }))} />
                      </label>
                      <label className="field inference-span-2">
                        <span>备注说明</span>
                        <textarea rows={3} value={createDraft.notes} onChange={(event) => setCreateDraft((current) => ({ ...current, notes: event.target.value }))} />
                      </label>
                    </div>
                    <div className="allocation-summary compact">
                      <KeyValue label="Router" value={`${createDraft.routerReplicas} 副本 / ${createDraft.routerMin}-${createDraft.routerMax}`} />
                      <KeyValue label="Prefill" value={`${createDraft.prefillReplicas} 副本 / ${createDraft.prefillMin}-${createDraft.prefillMax}`} />
                      <KeyValue label="Decode" value={`${createDraft.decodeReplicas} 副本 / ${createDraft.decodeMin}-${createDraft.decodeMax}`} />
                      <KeyValue label="扩容重点" value="Decode 优先承接高并发" />
                    </div>
                  </>
                ) : (
                  <>
                    <SectionHeader eyebrow="SINGLE INSTANCE" title="单机模式配置" description="统一设置单机实例池的副本数、扩缩容区间和运行参数。" />
                    <div className="form-grid two">
                      <label className="field">
                        <span>当前副本</span>
                        <input type="number" min="1" value={createDraft.singleReplicas} onChange={(event) => setCreateDraft((current) => ({ ...current, singleReplicas: parseCount(event.target.value) }))} />
                      </label>
                      <label className="field">
                        <span>资源规格</span>
                        <input value={createDraft.singleSpec} onChange={(event) => setCreateDraft((current) => ({ ...current, singleSpec: event.target.value }))} />
                      </label>
                      <label className="field">
                        <span>最小副本</span>
                        <input type="number" min="1" value={createDraft.singleMin} onChange={(event) => setCreateDraft((current) => ({ ...current, singleMin: parseCount(event.target.value) }))} />
                      </label>
                      <label className="field">
                        <span>最大副本</span>
                        <input type="number" min="1" value={createDraft.singleMax} onChange={(event) => setCreateDraft((current) => ({ ...current, singleMax: parseCount(event.target.value) }))} />
                      </label>
                      <label className="field">
                        <span>Max Model Len</span>
                        <input value={createDraft.maxModelLen} onChange={(event) => setCreateDraft((current) => ({ ...current, maxModelLen: event.target.value }))} />
                      </label>
                      <label className="field">
                        <span>Max Num Seqs</span>
                        <input value={createDraft.maxNumSeqs} onChange={(event) => setCreateDraft((current) => ({ ...current, maxNumSeqs: event.target.value }))} />
                      </label>
                      <label className="field">
                        <span>KV Cache 精度</span>
                        <select value={createDraft.kvCache} onChange={(event) => setCreateDraft((current) => ({ ...current, kvCache: event.target.value }))}>
                          {kvCacheOptions.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        <span>备注说明</span>
                        <textarea rows={3} value={createDraft.notes} onChange={(event) => setCreateDraft((current) => ({ ...current, notes: event.target.value }))} />
                      </label>
                    </div>
                    <div className="allocation-summary compact">
                      <KeyValue label="实例池" value={`${createDraft.singleReplicas} 副本`} />
                      <KeyValue label="扩缩容区间" value={`${createDraft.singleMin}-${createDraft.singleMax}`} />
                      <KeyValue label="资源规格" value={createDraft.singleSpec} />
                      <KeyValue label="服务形态" value="单机统一推理服务" />
                    </div>
                  </>
                )}
                <LogPanel title="vLLM 编排预览" lines={createPreviewLines} />
              </>
            )}

            {createError ? <div className="field-error">{createError}</div> : null}

            <div className="modal-actions">
              {createStep === 1 ? (
                <>
                  <Button variant="ghost" onClick={closeCreateModal}>
                    取消
                  </Button>
                  <Button variant="secondary" onClick={() => setCreateStep(2)} disabled={!createDraft.taskName.trim() || !createDraft.serviceName.trim()}>
                    进入角色配置
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => setCreateStep(1)}>
                    返回上一步
                  </Button>
                  <Button variant="secondary" icon={Plus} onClick={createTask}>
                    创建推理任务
                  </Button>
                </>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </ModuleScaffold>
  );
}

function SchedulerPage({ addAudit }: { addAudit: (event: Omit<AuditEvent, "id" | "time">) => void }) {
  const schedulerProfiles = [
    {
      id: "quick-lora",
      title: "快速微调默认模板",
      mode: "快速微调",
      queue: "ft-fast",
      priority: "P2 / 可回填",
      minMember: "1",
      fairness: "DRF + weight=2",
      network: "普通 GPU 池 / RoCE 兼容",
      summary: "面向 1-2 卡 LoRA 任务，优先压缩排队时间，允许进入 backfill 池消化碎片资源。",
      dispatch: "短任务优先，允许温和抢占与回填。",
      plugins: ["predicates", "priority", "binpack", "overcommit"],
      gangRule: "单副本即可启动，不阻塞大任务。",
      reclaimRule: "允许被高优先级专家任务回收。",
      topologyRule: "不绑定机架，仅要求同类卡型。",
      sla: "2.8 分钟",
      success: "97.2%",
    },
    {
      id: "expert-train",
      title: "专家微调主模板",
      mode: "专家微调",
      queue: "ft-expert",
      priority: "P1 / 抢占保护",
      minMember: "4",
      fairness: "Queue deserved + weight=4",
      network: "大卡训练池 / 本地 NVMe 优先",
      summary: "面向 4-8 卡分布式微调，按 Gang 规则整队后启动，优先保证训练稳定性和配额公平性。",
      dispatch: "整队满足后一次性放行，不接受低优先级回填打断。",
      plugins: ["gang", "drf", "priority", "nodeorder"],
      gangRule: "minAvailable=4，未满足前保持等待。",
      reclaimRule: "仅允许 P0 任务触发抢占，默认关闭被回收。",
      topologyRule: "优先同机架、同交换域和本地缓存盘。",
      sla: "6.4 分钟",
      success: "91.8%",
    },
    {
      id: "rdma-fusion",
      title: "多模态 RDMA 模板",
      mode: "专家微调",
      queue: "ft-rdma",
      priority: "P0 / 强拓扑约束",
      minMember: "8",
      fairness: "专用队列 + capacity fence",
      network: "IB 训练平面 / rdma=true",
      summary: "面向 8 卡以上多模态和长时训练任务，结合 Volcano Gang 与节点标签实现拓扑一致性调度。",
      dispatch: "严格按 IB 标签、机架和 NVMe 约束选点。",
      plugins: ["gang", "predicates", "proportion", "topology-hint"],
      gangRule: "minAvailable=8，需整机架资源同时满足。",
      reclaimRule: "关闭 reclaim，避免 RDMA 任务被打散。",
      topologyRule: "锁定 ib=true / rack=training-a / nvme-cache=hot。",
      sla: "8.1 分钟",
      success: "95.4%",
    },
  ] as const;

  const initialJobs = [
    {
      id: "sj-301",
      name: "热线问答快速增强微调",
      mode: "快速微调",
      queue: "ft-fast",
      priority: "P2",
      members: "1 / 1",
      network: "RoCE 或普通 GPU",
      wait: "03m 18s",
      status: "等待碎片卡",
      decision: "可送入 backfill 池",
    },
    {
      id: "sj-302",
      name: "运维知识专家微调任务",
      mode: "专家微调",
      queue: "ft-expert",
      priority: "P1",
      members: "4 / 4",
      network: "本地 NVMe 优先",
      wait: "11m 42s",
      status: "Gang 待满足",
      decision: "等待整队 4 GPU",
    },
    {
      id: "sj-303",
      name: "质检图文专家微调",
      mode: "专家微调",
      queue: "ft-rdma",
      priority: "P0",
      members: "8 / 8",
      network: "IB + 同机架约束",
      wait: "07m 09s",
      status: "拓扑待满足",
      decision: "等待同机架 8 卡",
    },
    {
      id: "sj-304",
      name: "工单路由基线回灌",
      mode: "快速微调",
      queue: "ft-backfill",
      priority: "P3",
      members: "1 / 1",
      network: "普通 GPU 池",
      wait: "01m 11s",
      status: "回填候选",
      decision: "可立即插入碎片资源",
    },
  ];

  const [selectedProfileId, setSelectedProfileId] = useState<string>(schedulerProfiles[1].id);
  const [appliedProfileId, setAppliedProfileId] = useState<string>(schedulerProfiles[1].id);
  const [jobs, setJobs] = useState(initialJobs);
  const [rebalanceCount, setRebalanceCount] = useState(2);
  const [backfillCount, setBackfillCount] = useState(3);
  const [dispatchMessage, setDispatchMessage] = useState("专家微调主模板已生效，Volcano 正按 ft-expert 队列执行 Gang 规则与公平配额校验。");

  const selectedProfile = schedulerProfiles.find((item) => item.id === selectedProfileId) ?? schedulerProfiles[0];
  const appliedProfile = schedulerProfiles.find((item) => item.id === appliedProfileId) ?? schedulerProfiles[0];
  const waitingJobs = jobs.filter((item) => item.status !== "已回填入队").length;
  const pendingGpu =
    jobs.reduce((sum, item) => {
      if (item.status === "已回填入队") {
        return sum;
      }
      return sum + Number(item.members.split("/")[0].trim());
    }, 0) + (selectedProfile.id === "rdma-fusion" ? 8 : 0);
  const activeBackfill = jobs.filter((item) => item.queue === "ft-backfill").length;

  const queueRows = [
    {
      id: "ft-fast",
      name: "快速微调通道",
      workload: "1-2 卡 LoRA / SFT",
      deserved: "16 GPU",
      capability: "24 GPU",
      weight: "2",
      policy: "Binpack + Backfill",
      runtime: `11 运行 / ${jobs.filter((item) => item.queue === "ft-fast").length} 等待`,
      guard: "允许回填与温和抢占",
    },
    {
      id: "ft-expert",
      name: "专家训练主队列",
      workload: "4-8 卡分布式微调",
      deserved: "48 GPU",
      capability: "64 GPU",
      weight: "4",
      policy: "Gang + DRF + Priority",
      runtime: `14 运行 / ${jobs.filter((item) => item.queue === "ft-expert").length} 等待`,
      guard: "优先保证公平与整队启动",
    },
    {
      id: "ft-rdma",
      name: "RDMA 专用队列",
      workload: "8 卡以上多模态训练",
      deserved: "64 GPU",
      capability: "96 GPU",
      weight: "5",
      policy: "Gang + 拓扑感知",
      runtime: `9 运行 / ${jobs.filter((item) => item.queue === "ft-rdma").length} 等待`,
      guard: "按 rdma=true / fabric=ib 锁定",
    },
    {
      id: "ft-backfill",
      name: "碎片资源回填池",
      workload: "单卡短任务 / 补洞任务",
      deserved: "8 GPU",
      capability: "12 GPU",
      weight: "1",
      policy: "Backfill + Binpack",
      runtime: `${activeBackfill} 候选 / ${backfillCount} 次已触发`,
      guard: "只接受可中断短任务",
    },
  ];

  const schedulerJobTone = (status: string): Tone => {
    if (status.includes("已回填") || status.includes("已锁定")) {
      return "emerald";
    }
    if (status.includes("拓扑") || status.includes("碎片")) {
      return "amber";
    }
    if (status.includes("Gang")) {
      return "blue";
    }
    return "slate";
  };

  const applyProfile = () => {
    setAppliedProfileId(selectedProfile.id);
    setDispatchMessage(`已下发 ${selectedProfile.title} 到 ${selectedProfile.queue}，Volcano 将按 ${selectedProfile.dispatch}`);
    addAudit({
      actor: "调度编排器",
      action: "下发 Volcano 调度模板",
      target: `${selectedProfile.title} / ${selectedProfile.queue}`,
      result: "成功",
    });
  };

  const rebalanceQueues = () => {
    setRebalanceCount((count) => count + 1);
    setDispatchMessage(`已执行第 ${rebalanceCount + 1} 次队列重平衡，等待任务会重新按 deserved/capability/priority 进入下一轮匹配。`);
    setJobs((items) =>
      items.map((item) =>
        item.id === "sj-302"
          ? {
              ...item,
              status: "Gang 二次匹配",
              decision: "已进入下一轮整队窗口",
            }
          : item,
      ),
    );
    addAudit({ actor: "调度编排器", action: "执行队列重平衡", target: "Volcano Queue / Fair Share", result: "处理中" });
  };

  const triggerBackfill = () => {
    let launched = false;
    setJobs((items) =>
      items.map((item) => {
        if (!launched && item.id === "sj-304" && item.status !== "已回填入队") {
          launched = true;
          return {
            ...item,
            status: "已回填入队",
            decision: "占用 1 卡碎片 GPU，准备拉起训练容器",
          };
        }
        return item;
      }),
    );
    if (launched) {
      setBackfillCount((count) => count + 1);
      setDispatchMessage("碎片资源回填已触发，短任务优先吃掉单卡空洞，不阻塞专家任务整队。");
      addAudit({ actor: "调度编排器", action: "触发 Backfill 回填", target: "工单路由基线回灌", result: "成功" });
    }
  };

  const operateJob = (jobId: string) => {
    let auditTarget = "";
    let auditAction = "";
    let nextDecision = "";

    setJobs((items) =>
      items.map((item) => {
        if (item.id !== jobId) {
          return item;
        }

        auditTarget = item.name;
        if (jobId === "sj-301") {
          auditAction = "切换作业到 Backfill 队列";
          nextDecision = "已降级到碎片资源池等待插队";
          return {
            ...item,
            queue: "ft-backfill",
            status: "等待回填窗口",
            decision: nextDecision,
          };
        }
        if (jobId === "sj-302") {
          auditAction = "提升专家任务优先级";
          nextDecision = "允许对低优先级单卡任务发起抢占";
          return {
            ...item,
            priority: "P0",
            status: "抢占候选",
            decision: nextDecision,
          };
        }
        if (jobId === "sj-303") {
          auditAction = "锁定 IB 训练标签";
          nextDecision = "只在 rdma=true / fabric=ib 节点投放";
          return {
            ...item,
            status: "已锁定 IB 标签",
            decision: nextDecision,
          };
        }

        auditAction = "确认回填执行";
        nextDecision = "碎片卡已分配，等待训练容器拉起";
        return {
          ...item,
          status: "已回填入队",
          decision: nextDecision,
        };
      }),
    );

    if (jobId === "sj-302") {
      setRebalanceCount((count) => count + 1);
    }
    if (jobId === "sj-304") {
      setBackfillCount((count) => count + 1);
    }

    setDispatchMessage(`已处理作业 ${auditTarget}，当前策略结果：${nextDecision}`);
    addAudit({ actor: "调度编排器", action: auditAction, target: auditTarget, result: "成功" });
  };

  const previewLines = [
    "schedulerName: volcano",
    `queue: ${selectedProfile.queue}`,
    `priorityClassName: ${selectedProfile.priority}`,
    `podGroup.minMember: ${selectedProfile.minMember}`,
    `plugins: ${selectedProfile.plugins.join(", ")}`,
    `dispatchPolicy: ${selectedProfile.dispatch}`,
    `networkAffinity: ${selectedProfile.network}`,
    `reclaimPolicy: ${selectedProfile.reclaimRule}`,
    `topologyRule: ${selectedProfile.topologyRule}`,
    `runtime: ${dispatchMessage}`,
  ];

  return (
    <ModuleScaffold scenarioKey="scheduler">
      <section className="surface-panel">
        <SectionHeader
          eyebrow="VOLCANO CONTROL"
          title="微调任务调度工作台"
          description="把快速微调与专家微调的任务模板、队列策略、Gang 规则和执行闭环放在同一个页面完成配置，避免把调度能力藏在训练参数背后。"
        />
        <div className="inline-notice ok">
          <strong>页面以纵向编排为主</strong>
          <span>入口、模板、策略、队列和待调度任务依次展开，适合演示 Volcano 的业务配置闭环，不使用左右对开布局。</span>
        </div>
        <div className="action-row">
          <Button icon={Play} onClick={applyProfile}>
            应用当前模板
          </Button>
          <Button variant="secondary" icon={RefreshCcw} onClick={rebalanceQueues}>
            执行队列重平衡
          </Button>
          <Button variant="secondary" icon={Zap} onClick={triggerBackfill}>
            触发回填模拟
          </Button>
          <StatusBadge tone="cyan">{`当前模板 ${selectedProfile.title}`}</StatusBadge>
          <StatusBadge tone="blue">{`已生效 ${appliedProfile.queue}`}</StatusBadge>
          <StatusBadge tone="slate">Volcano v1.11 / Gang 开启</StatusBadge>
        </div>
        <div className="allocation-summary compact">
          <KeyValue label="默认队列" value={selectedProfile.queue} />
          <KeyValue label="PodGroup 门槛" value={`minAvailable=${selectedProfile.minMember}`} />
          <KeyValue label="优先级策略" value={selectedProfile.priority} />
          <KeyValue label="网络约束" value={selectedProfile.network} />
          <KeyValue label="公平策略" value={selectedProfile.fairness} />
          <KeyValue label="当前调度结论" value={dispatchMessage} />
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard icon={Gauge} label="平均排队时延" value={selectedProfile.sla} unit="当前模板" tone="cyan" trend="-18%" />
        <MetricCard icon={Workflow} label="Gang 满足率" value={selectedProfile.success} unit="近 24 小时" tone="blue" trend="+4.6%" />
        <MetricCard icon={Boxes} label="待分配 GPU" value={`${pendingGpu}`} unit="卡" tone="amber" trend={`${waitingJobs} 个待调度`} />
        <MetricCard icon={GitBranch} label="抢占 / 回填动作" value={`${rebalanceCount + backfillCount}`} unit="次" tone="emerald" trend="自动决策中" />
      </section>

      <section className="surface-panel">
        <SectionHeader
          eyebrow="PROFILE MAPPING"
          title="模式与调度模板映射"
          description="第五条强调的是模式、参数和执行管理一体化，这里把不同微调模式直接映射为可下发的 Volcano 调度模板。"
        />
        <div className="scheduler-profile-grid">
          {schedulerProfiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              className={`scheduler-profile-card ${selectedProfileId === profile.id ? "is-active" : ""}`}
              onClick={() => setSelectedProfileId(profile.id)}
            >
              <div className="scheduler-profile-head">
                <div>
                  <span className="eyebrow">{profile.mode}</span>
                  <h3>{profile.title}</h3>
                </div>
                <StatusBadge tone={profile.mode === "快速微调" ? "blue" : "violet"}>{profile.queue}</StatusBadge>
              </div>
              <p>{profile.summary}</p>
              <div className="scheduler-tag-strip">
                <span>{profile.priority}</span>
                <span>{`Gang ${profile.minMember}`}</span>
                <span>{profile.network}</span>
              </div>
              <div className="scheduler-profile-meta">
                <MetricMini label="公平策略" value={profile.fairness} />
                <MetricMini label="调度插件" value={profile.plugins.join(" / ")} />
                <MetricMini label="执行策略" value={profile.dispatch} />
              </div>
            </button>
          ))}
        </div>
        <LogPanel title="调度模板预览" lines={previewLines} />
      </section>

      <section className="surface-panel">
        <SectionHeader
          eyebrow="POLICY BOARD"
          title="Volcano 关键策略编排"
          description="把队列公平、Gang、抢占/回收和拓扑约束拆成可讲清楚的业务策略，而不是仅暴露底层字段。"
        />
        <div className="scheduler-rule-grid">
          <article className="scheduler-rule-card">
            <div className="metric-icon">
              <BarChart3 size={18} />
            </div>
            <strong>队列公平与配额</strong>
            <p>{selectedProfile.fairness}</p>
            <small>按 deserved、capacity 和 weight 控制不同微调模式的资源份额。</small>
          </article>
          <article className="scheduler-rule-card">
            <div className="metric-icon">
              <Users size={18} />
            </div>
            <strong>Gang Scheduling</strong>
            <p>{selectedProfile.gangRule}</p>
            <small>专家任务必须整队成功后再启动，避免只起部分 worker 导致训练浪费。</small>
          </article>
          <article className="scheduler-rule-card">
            <div className="metric-icon">
              <AlertTriangle size={18} />
            </div>
            <strong>抢占与回收</strong>
            <p>{selectedProfile.reclaimRule}</p>
            <small>短任务可以回填，长任务受到保护，保证吞吐和稳定性之间的平衡。</small>
          </article>
          <article className="scheduler-rule-card">
            <div className="metric-icon">
              <Network size={18} />
            </div>
            <strong>拓扑与网络标签</strong>
            <p>{selectedProfile.topologyRule}</p>
            <small>结合 IB / RoCE、机架和本地缓存标签，保证分布式微调落在正确资源域。</small>
          </article>
        </div>
        <div className="scheduler-flow-grid">
          <div className="scheduler-flow-step">
            <span>1</span>
            <strong>任务模板</strong>
            <small>{selectedProfile.title}</small>
          </div>
          <div className="scheduler-flow-step">
            <span>2</span>
            <strong>绑定队列</strong>
            <small>{selectedProfile.queue}</small>
          </div>
          <div className="scheduler-flow-step">
            <span>3</span>
            <strong>PodGroup 校验</strong>
            <small>{`minAvailable=${selectedProfile.minMember}`}</small>
          </div>
          <div className="scheduler-flow-step">
            <span>4</span>
            <strong>插件决策</strong>
            <small>{selectedProfile.plugins.join(" / ")}</small>
          </div>
          <div className="scheduler-flow-step">
            <span>5</span>
            <strong>执行结果</strong>
            <small>{selectedProfile.dispatch}</small>
          </div>
        </div>
      </section>

      <section className="surface-panel">
        <SectionHeader
          eyebrow="QUEUE BOARD"
          title="队列与资源池策略"
          description="展示不同训练队列的 deserved/capability、权重和策略，方便说明 Volcano 如何对不同类型微调任务做资源治理。"
        />
        <DataTable
          columns={["队列", "适用任务", "Deserved / Capacity", "Weight / 策略", "当前负载", "当前状态"]}
          rows={queueRows.map((queue) => [
            <div key={`${queue.id}-name`} className="scheduler-job-cell">
              <strong>{queue.name}</strong>
              <span>{queue.id}</span>
            </div>,
            queue.workload,
            <div key={`${queue.id}-quota`} className="scheduler-job-cell">
              <strong>{queue.deserved}</strong>
              <span>{queue.capability}</span>
            </div>,
            <div key={`${queue.id}-policy`} className="scheduler-job-cell">
              <strong>{`weight=${queue.weight}`}</strong>
              <span>{queue.policy}</span>
            </div>,
            queue.runtime,
            <StatusBadge key={`${queue.id}-guard`} tone={selectedProfile.queue === queue.id ? "cyan" : "slate"}>
              {selectedProfile.queue === queue.id ? "当前模板命中" : queue.guard}
            </StatusBadge>,
          ])}
        />
      </section>

      <section className="surface-panel">
        <SectionHeader
          eyebrow="PENDING JOBS"
          title="待调度任务执行管理"
          description="这里直接展示待调度作业的业务操作位，支持升优先级、送入回填池、锁定 IB 标签等动作，体现执行管理能力。"
        />
        <DataTable
          columns={["任务", "模式 / 队列", "优先级 / Gang", "网络约束", "状态 / 决策", "操作"]}
          rows={jobs.map((job) => [
            <div key={`${job.id}-name`} className="scheduler-job-cell">
              <strong>{job.name}</strong>
              <span>{job.wait}</span>
            </div>,
            <div key={`${job.id}-queue`} className="scheduler-job-cell">
              <strong>{job.mode}</strong>
              <span>{job.queue}</span>
            </div>,
            <div key={`${job.id}-priority`} className="scheduler-job-cell">
              <strong>{job.priority}</strong>
              <span>{`minAvailable ${job.members}`}</span>
            </div>,
            job.network,
            <div key={`${job.id}-status`} className="scheduler-job-cell">
              <StatusBadge tone={schedulerJobTone(job.status)}>{job.status}</StatusBadge>
              <small>{job.decision}</small>
            </div>,
            <div key={`${job.id}-action`} className="table-action-stack">
              <button className="inline-action" onClick={() => operateJob(job.id)}>
                {job.id === "sj-301" ? "送入回填池" : job.id === "sj-302" ? "提升优先级" : job.id === "sj-303" ? "锁定 IB 标签" : "确认回填"}
              </button>
            </div>,
          ])}
        />
      </section>
    </ModuleScaffold>
  );
}

function DataManagementPage({ addAudit }: { addAudit: (event: Omit<AuditEvent, "id" | "time">) => void }) {
  type DataBrowserNode = {
    id: string;
    name: string;
    kind: "folder" | "file";
    size: number;
    updatedAt: string;
    children?: DataBrowserNode[];
  };

  type UploadDraft = {
    name: string;
    size: number;
    relativePath: string;
  };

  const buildNodeId = () => `node-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const buildFolderNode = (name: string, updatedAt: string, children: DataBrowserNode[] = []): DataBrowserNode => ({
    id: buildNodeId(),
    name,
    kind: "folder",
    size: 0,
    updatedAt,
    children,
  });
  const buildFileNode = (name: string, size: number, updatedAt: string): DataBrowserNode => ({
    id: buildNodeId(),
    name,
    kind: "file",
    size,
    updatedAt,
  });
  const sortBrowserNodes = (nodes: DataBrowserNode[]) =>
    [...nodes].sort((left, right) => {
      if (left.kind !== right.kind) {
        return left.kind === "folder" ? -1 : 1;
      }
      return left.name.localeCompare(right.name, "zh-CN");
    });

  const initialUpdatedAt = "2026-04-25 09:30";
  const initialTree: DataBrowserNode[] = sortBrowserNodes([
    buildFolderNode("datasets", initialUpdatedAt, [
      buildFolderNode("nlp", initialUpdatedAt, [
        buildFileNode("train.jsonl", 1024 * 1024 * 186, "2026-04-24 20:18"),
        buildFileNode("eval.jsonl", 1024 * 1024 * 42, "2026-04-24 20:21"),
        buildFileNode("instruct-sft.parquet", 1024 * 1024 * 328, "2026-04-25 08:11"),
        buildFileNode("reward-model.csv", 1024 * 1024 * 18, "2026-04-24 17:42"),
      ]),
      buildFolderNode("speech", initialUpdatedAt, [
        buildFileNode("asr-train.tar", 1024 * 1024 * 920, "2026-04-25 07:33"),
        buildFileNode("vad-labels.json", 1024 * 1024 * 5, "2026-04-24 16:54"),
      ]),
      buildFolderNode("vision", initialUpdatedAt, [buildFileNode("quality-images.zip", 1024 * 1024 * 860, "2026-04-25 08:42")]),
      buildFolderNode("multimodal", initialUpdatedAt, [
        buildFileNode("image-text-pairs.arrow", 1024 * 1024 * 1408, "2026-04-25 06:48"),
        buildFileNode("caption-cleaned.jsonl", 1024 * 1024 * 76, "2026-04-24 22:35"),
      ]),
    ]),
    buildFolderNode("models", initialUpdatedAt, [
      buildFileNode("qwen25-7b-adapter.safetensors", 1024 * 1024 * 760, "2026-04-24 22:06"),
      buildFileNode("internvl-rdma-checkpoint.bin", 1024 * 1024 * 2048, "2026-04-25 07:28"),
      buildFileNode("ops-expert-sft-v12.ckpt", 1024 * 1024 * 1536, "2026-04-25 08:58"),
      buildFolderNode("exports", initialUpdatedAt, [
        buildFileNode("ticket-routing-lora-v7.tar", 1024 * 1024 * 688, "2026-04-24 21:15"),
        buildFileNode("gov-qa-int4.gguf", 1024 * 1024 * 1190, "2026-04-24 23:44"),
      ]),
    ]),
    buildFolderNode("logs", initialUpdatedAt, [
      buildFileNode("train-20260425.log", 1024 * 1024 * 8, "2026-04-25 09:06"),
      buildFileNode("preempt-events.log", 1024 * 512, "2026-04-25 09:10"),
      buildFileNode("upload-audit.log", 1024 * 256, "2026-04-25 09:18"),
      buildFileNode("space-build.log", 1024 * 1024 * 3, "2026-04-25 08:26"),
    ]),
    buildFolderNode("exports", initialUpdatedAt, [
      buildFileNode("release-manifest.json", 1024 * 128, "2026-04-24 18:12"),
      buildFileNode("dataset-index.csv", 1024 * 1024 * 2, "2026-04-25 07:12"),
      buildFileNode("space-runtime-bundle.tgz", 1024 * 1024 * 412, "2026-04-24 19:56"),
    ]),
    buildFolderNode("checkpoints", initialUpdatedAt, [
      buildFolderNode("expert-sft", initialUpdatedAt, [
        buildFileNode("epoch-01.ckpt", 1024 * 1024 * 860, "2026-04-24 18:34"),
        buildFileNode("epoch-02.ckpt", 1024 * 1024 * 874, "2026-04-24 20:09"),
        buildFileNode("epoch-03.ckpt", 1024 * 1024 * 881, "2026-04-24 21:56"),
      ]),
      buildFolderNode("lora-fast", initialUpdatedAt, [
        buildFileNode("step-0800.safetensors", 1024 * 1024 * 220, "2026-04-25 08:02"),
        buildFileNode("step-1200.safetensors", 1024 * 1024 * 224, "2026-04-25 08:37"),
      ]),
    ]),
    buildFolderNode("tenants", initialUpdatedAt, [
      buildFolderNode("tenant-a", initialUpdatedAt, [
        buildFileNode("quota-policy.yaml", 1024 * 42, "2026-04-24 15:12"),
        buildFileNode("model-sharing.json", 1024 * 80, "2026-04-24 17:08"),
      ]),
      buildFolderNode("tenant-b", initialUpdatedAt, [
        buildFileNode("workspace-map.json", 1024 * 32, "2026-04-24 16:44"),
        buildFileNode("published-models.csv", 1024 * 120, "2026-04-25 08:18"),
      ]),
    ]),
  ]);

  const [tree, setTree] = useState<DataBrowserNode[]>(initialTree);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [uploadMode, setUploadMode] = useState<"file" | "folder" | null>(null);
  const [uploadDrafts, setUploadDrafts] = useState<UploadDraft[]>([]);
  const [copiedField, setCopiedField] = useState<"endpoint" | "ak" | "sk" | null>(null);
  const [visibleSecretField, setVisibleSecretField] = useState<{ ak: boolean; sk: boolean }>({ ak: false, sk: false });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const s3Info = {
    endpoint: "https://s3.mianyang-demo.local",
    accessKey: "PAI_DEMO_ACCESS_KEY",
    secretKey: "PAI_DEMO_SECRET_KEY_2026",
  };

  useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute("webkitdirectory", "");
      folderInputRef.current.setAttribute("directory", "");
    }
  }, []);

  useEffect(() => {
    setSelectedFileIds([]);
  }, [currentPath]);

  const getNodesAtPath = (nodes: DataBrowserNode[], path: string[]) => {
    if (path.length === 0) {
      return sortBrowserNodes(nodes);
    }

    let current = nodes;
    for (const segment of path) {
      const matched = current.find((item) => item.kind === "folder" && item.name === segment);
      if (!matched || matched.kind !== "folder") {
        return [];
      }
      current = matched.children ?? [];
    }

    return sortBrowserNodes(current);
  };

  const upsertFileBySegments = (nodes: DataBrowserNode[], segments: string[], size: number, updatedAt: string): DataBrowserNode[] => {
    const [head, ...rest] = segments;
    if (!head) {
      return nodes;
    }

    if (rest.length === 0) {
      const existingIndex = nodes.findIndex((item) => item.kind === "file" && item.name === head);
      const nextFile = buildFileNode(head, size, updatedAt);
      if (existingIndex === -1) {
        return sortBrowserNodes([...nodes, nextFile]);
      }

      return sortBrowserNodes(nodes.map((item, index) => (index === existingIndex ? nextFile : item)));
    }

    const existingFolderIndex = nodes.findIndex((item) => item.kind === "folder" && item.name === head);
    const existingFolder = existingFolderIndex === -1 ? buildFolderNode(head, updatedAt) : nodes[existingFolderIndex];
    const nextFolder: DataBrowserNode = {
      ...existingFolder,
      kind: "folder",
      updatedAt,
      children: upsertFileBySegments(existingFolder.children ?? [], rest, size, updatedAt),
    };

    if (existingFolderIndex === -1) {
      return sortBrowserNodes([...nodes, nextFolder]);
    }

    return sortBrowserNodes(nodes.map((item, index) => (index === existingFolderIndex ? nextFolder : item)));
  };

  const removeFilesById = (nodes: DataBrowserNode[], ids: Set<string>): DataBrowserNode[] =>
    nodes
      .filter((item) => !(item.kind === "file" && ids.has(item.id)))
      .map((item) =>
        item.kind === "folder"
          ? {
              ...item,
              children: removeFilesById(item.children ?? [], ids),
            }
          : item,
      );

  const countFiles = (nodes: DataBrowserNode[]): number => nodes.reduce((sum, item) => sum + (item.kind === "file" ? 1 : countFiles(item.children ?? [])), 0);
  const countFolders = (nodes: DataBrowserNode[]): number =>
    nodes.reduce((sum, item) => sum + (item.kind === "folder" ? 1 + countFolders(item.children ?? []) : 0), 0);

  const currentNodes = useMemo(() => getNodesAtPath(tree, currentPath), [tree, currentPath]);
  const totalFiles = useMemo(() => countFiles(tree), [tree]);
  const totalFolders = useMemo(() => countFolders(tree), [tree]);
  const uploadTotalSize = uploadDrafts.reduce((sum, item) => sum + item.size, 0);

  const copyCredential = async (field: "endpoint" | "ak" | "sk", value: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      }
      setCopiedField(field);
      window.setTimeout(() => setCopiedField((current) => (current === field ? null : current)), 1400);
      addAudit({
        actor: "云盘管理器",
        action: "复制 S3 连接信息",
        target: field === "endpoint" ? "S3 Endpoint" : field === "ak" ? "Access Key" : "Secret Key",
        result: "成功",
      });
    } catch {
      addAudit({
        actor: "云盘管理器",
        action: "复制 S3 连接信息失败",
        target: field,
        result: "告警",
      });
    }
  };

  const openUploadModal = (mode: "file" | "folder") => {
    setUploadMode(mode);
    setUploadDrafts([]);
  };

  const handleUploadSelection = (files: FileList | null, mode: "file" | "folder") => {
    if (!files) {
      return;
    }

    const drafts = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      relativePath: mode === "folder" ? ((file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name) : file.name,
    }));
    setUploadDrafts(drafts);
  };

  const submitUpload = () => {
    if (!uploadMode || uploadDrafts.length === 0) {
      return;
    }

    const updatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    setTree((current) => {
      let next = current;
      for (const draft of uploadDrafts) {
        next = upsertFileBySegments(next, [...currentPath, ...draft.relativePath.split("/").filter(Boolean)], draft.size, updatedAt);
      }
      return next;
    });
    addAudit({
      actor: "云盘管理器",
      action: uploadMode === "file" ? "模拟上传文件" : "模拟上传文件夹",
      target: `${uploadDrafts.length} 个对象 / ${currentPath.join("/") || "根目录"}`,
      result: "成功",
    });
    setUploadMode(null);
    setUploadDrafts([]);
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFileIds((current) => (current.includes(fileId) ? current.filter((item) => item !== fileId) : [...current, fileId]));
  };

  const deleteSelectedFiles = () => {
    if (selectedFileIds.length === 0) {
      return;
    }

    const ids = new Set(selectedFileIds);
    setTree((current) => removeFilesById(current, ids));
    addAudit({
      actor: "云盘管理器",
      action: "批量删除文件",
      target: `${selectedFileIds.length} 个文件`,
      result: "成功",
    });
    setSelectedFileIds([]);
  };

  const downloadFile = (file: DataBrowserNode) => {
    const blob = new Blob([`模拟下载内容\nfile=${file.name}\nsize=${formatBytes(file.size)}\nupdated=${file.updatedAt}\n`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name;
    anchor.click();
    URL.revokeObjectURL(url);
    addAudit({
      actor: "云盘管理器",
      action: "下载文件",
      target: file.name,
      result: "成功",
    });
  };

  return (
    <ModuleScaffold scenarioKey="drive">
      <section className="surface-panel data-access-panel">
        <SectionHeader
          eyebrow="CLOUD DRIVE ACCESS"
          title="云盘连接信息"
          description="展示对象存储 Endpoint、AK、SK，并支持浏览器和二进制客户端接入。"
        />
        <div className="data-credential-grid">
          <div className="data-credential-card">
            <span>Endpoint</span>
            <strong>{s3Info.endpoint}</strong>
            <button className="inline-action" onClick={() => copyCredential("endpoint", s3Info.endpoint)}>
              <Copy size={14} />
              {copiedField === "endpoint" ? "已复制" : "复制 Endpoint"}
            </button>
          </div>
          <div className="data-credential-card">
            <span>Access Key</span>
            <strong>{visibleSecretField.ak ? s3Info.accessKey : "••••••••••••••••"}</strong>
            <div className="data-credential-actions">
              <button className="inline-action" onClick={() => setVisibleSecretField((current) => ({ ...current, ak: !current.ak }))}>
                {visibleSecretField.ak ? "隐藏 AK" : "显示 AK"}
              </button>
              <button className="inline-action" onClick={() => copyCredential("ak", s3Info.accessKey)}>
                <Copy size={14} />
                {copiedField === "ak" ? "已复制" : "复制 AK"}
              </button>
            </div>
          </div>
          <div className="data-credential-card">
            <span>Secret Key</span>
            <strong>{visibleSecretField.sk ? s3Info.secretKey : "••••••••••••••••••••••••"}</strong>
            <div className="data-credential-actions">
              <button className="inline-action" onClick={() => setVisibleSecretField((current) => ({ ...current, sk: !current.sk }))}>
                {visibleSecretField.sk ? "隐藏 SK" : "显示 SK"}
              </button>
              <button className="inline-action" onClick={() => copyCredential("sk", s3Info.secretKey)}>
                <Copy size={14} />
                {copiedField === "sk" ? "已复制" : "复制 SK"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-panel">
        <SectionHeader
          eyebrow="CLOUD DRIVE"
          title="云盘管理"
          description="以类似文件浏览器的方式管理对象目录，支持进入文件夹、上传文件、上传文件夹、单文件下载，以及按勾选结果批量删除文件。"
        />
        <div className="action-row">
          <Button icon={UploadCloud} onClick={() => openUploadModal("file")}>
            上传文件
          </Button>
          <Button variant="secondary" icon={FolderOpen} onClick={() => openUploadModal("folder")}>
            上传文件夹
          </Button>
          <Button variant="ghost" icon={Minus} onClick={() => setCurrentPath((path) => path.slice(0, -1))} disabled={currentPath.length === 0}>
            返回上级
          </Button>
          <Button variant="ghost" icon={Archive} onClick={deleteSelectedFiles} disabled={selectedFileIds.length === 0}>
            {selectedFileIds.length === 0 ? "批量删除文件" : `删除已选 ${selectedFileIds.length} 个文件`}
          </Button>
          <StatusBadge tone="blue">{`${totalFiles} 个文件`}</StatusBadge>
          <StatusBadge tone="slate">{`${totalFolders} 个文件夹`}</StatusBadge>
        </div>

        <div className="data-browser-toolbar">
          <div className="data-breadcrumbs">
            <button className={currentPath.length === 0 ? "active" : ""} onClick={() => setCurrentPath([])}>
              根目录
            </button>
            {currentPath.map((segment, index) => (
              <button key={`${segment}-${index}`} className={index === currentPath.length - 1 ? "active" : ""} onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}>
                {segment}
              </button>
            ))}
          </div>
          <div className="data-browser-summary">
            <StatusBadge tone="amber">{`${selectedFileIds.length} 个文件已勾选`}</StatusBadge>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>选择</th>
                <th>名称</th>
                <th>类型</th>
                <th>大小</th>
                <th>更新时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {currentNodes.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="cloud-empty-row">当前目录为空，可点击上方“上传文件”或“上传文件夹”模拟导入数据。</div>
                  </td>
                </tr>
              ) : (
                currentNodes.map((node) => (
                  <tr key={node.id}>
                    <td>
                      {node.kind === "file" ? (
                        <input type="checkbox" checked={selectedFileIds.includes(node.id)} onChange={() => toggleFileSelection(node.id)} />
                      ) : (
                        <span className="table-note">目录</span>
                      )}
                    </td>
                    <td>
                      <div className="data-browser-name">
                        <span className={`data-browser-icon ${node.kind === "folder" ? "is-folder" : "is-file"}`}>
                          {node.kind === "folder" ? <Folder size={16} /> : <FileText size={16} />}
                        </span>
                        {node.kind === "folder" ? (
                          <button className="inline-action" onClick={() => setCurrentPath((path) => [...path, node.name])}>
                            {node.name}
                          </button>
                        ) : (
                          <strong>{node.name}</strong>
                        )}
                      </div>
                    </td>
                    <td>{node.kind === "folder" ? "文件夹" : "文件"}</td>
                    <td>{node.kind === "folder" ? "--" : formatBytes(node.size)}</td>
                    <td>{node.updatedAt}</td>
                    <td>
                      {node.kind === "folder" ? (
                        <button className="inline-action" onClick={() => setCurrentPath((path) => [...path, node.name])}>
                          打开
                        </button>
                      ) : (
                        <button className="inline-action" onClick={() => downloadFile(node)}>
                          <Download size={14} />
                          下载
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={(event) => {
          handleUploadSelection(event.target.files, "file");
          event.target.value = "";
        }}
      />
      <input
        ref={folderInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={(event) => {
          handleUploadSelection(event.target.files, "folder");
          event.target.value = "";
        }}
      />

      {uploadMode ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setUploadMode(null)}>
          <section className="modal-panel password-dialog" role="dialog" aria-modal="true" aria-labelledby="data-upload-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">UPLOAD</span>
                <h3 id="data-upload-title">{uploadMode === "file" ? "上传文件" : "上传文件夹"}</h3>
                <p>{`当前目录：/${currentPath.join("/") || ""}。先选择${uploadMode === "file" ? "文件" : "文件夹"}，再点击“上传”模拟写入到对象存储。`}</p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={() => setUploadMode(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="action-row">
              <Button icon={uploadMode === "file" ? UploadCloud : FolderOpen} onClick={() => (uploadMode === "file" ? fileInputRef.current?.click() : folderInputRef.current?.click())}>
                {uploadMode === "file" ? "选择文件" : "选择文件夹"}
              </Button>
              <StatusBadge tone="blue">{`${uploadDrafts.length} 个对象待上传`}</StatusBadge>
              <StatusBadge tone="slate">{`总大小 ${formatBytes(uploadTotalSize)}`}</StatusBadge>
            </div>
            <div className="allocation-summary compact">
              <KeyValue label="上传目标" value={currentPath.join("/") || "根目录"} />
              <KeyValue label="上传模式" value={uploadMode === "file" ? "文件上传" : "文件夹上传"} />
              <KeyValue label="对象数量" value={`${uploadDrafts.length}`} />
              <KeyValue label="模拟动作" value="写入对象存储后刷新文件浏览器" />
            </div>
            <div className="data-upload-preview">
              {uploadDrafts.length === 0 ? (
                <div className="cloud-empty-row">尚未选择任何内容。</div>
              ) : (
                uploadDrafts.map((draft) => (
                  <div key={`${draft.relativePath}-${draft.size}`} className="data-upload-item">
                    <strong>{draft.relativePath}</strong>
                    <span>{formatBytes(draft.size)}</span>
                  </div>
                ))
              )}
            </div>
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setUploadMode(null)}>
                取消
              </Button>
              <Button variant="secondary" icon={UploadCloud} onClick={submitUpload} disabled={uploadDrafts.length === 0}>
                上传
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </ModuleScaffold>
  );
}

function DatasetManagementPage({
  datasets,
  setDatasets,
  addAudit,
}: {
  datasets: DatasetAsset[];
  setDatasets: React.Dispatch<React.SetStateAction<DatasetAsset[]>>;
  addAudit: (event: Omit<AuditEvent, "id" | "time">) => void;
}) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [visibility, setVisibility] = useState<"全部" | DatasetVisibility>("全部");
  const [modality, setModality] = useState<string>("全部");
  const [page, setPage] = useState(1);
  const [editingDatasetId, setEditingDatasetId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DatasetAccessPolicy | null>(null);
  const [editError, setEditError] = useState("");

  const releaseTenants = useMemo(() => tenants.filter((item) => item.level === "租户"), []);
  const modalityOptions = useMemo(() => ["全部", ...Array.from(new Set(datasets.map((item) => item.modality)))], [datasets]);
  const modelTypeOptions = ["LLM", "多模态", "视觉", "语音", "Embedding", "Rerank"];
  const industryOptions = ["政务问答", "工业质检", "语音转写", "企业搜索", "智能客服", "知识库问答"];
  const regionOptions = ["华东", "华北", "华南", "西南", "全国"];
  const orgOptions = ["集团", "事业部", "租户", "工作空间", "项目组"];
  const filteredDatasets = useMemo(
    () =>
      datasets.filter((item) => {
        const normalizedKeyword = keyword.trim().toLowerCase();
        const matchedKeyword =
          normalizedKeyword.length === 0 ||
          item.name.toLowerCase().includes(normalizedKeyword) ||
          item.summary.toLowerCase().includes(normalizedKeyword) ||
          item.tags.some((tag) => tag.toLowerCase().includes(normalizedKeyword));
        const matchedVisibility = visibility === "全部" || item.visibility === visibility;
        const matchedModality = modality === "全部" || item.modality === modality;
        return matchedKeyword && matchedVisibility && matchedModality;
      }),
    [datasets, keyword, modality, visibility],
  );
  const pageSize = 15;
  const totalPages = Math.max(1, Math.ceil(filteredDatasets.length / pageSize));
  const pagedDatasets = filteredDatasets.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [keyword, modality, visibility]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const publicCount = datasets.filter((item) => item.visibility === "公开").length;
  const sharedCount = datasets.filter((item) => item.visibility === "租户共享").length;
  const privateCount = datasets.filter((item) => item.visibility === "私有").length;
  const editingDataset = editingDatasetId ? datasets.find((item) => item.id === editingDatasetId) ?? null : null;

  const openDataset = (dataset: DatasetAsset) => {
    addAudit({ actor: "数据集治理中心", action: "查看数据集版本详情", target: dataset.name, result: "成功" });
    navigate(`/datasets/${dataset.id}`);
  };

  const openEditor = (dataset: DatasetAsset) => {
    setEditingDatasetId(dataset.id);
    setEditDraft({
      ...dataset.accessPolicy,
      modelTypes: [...dataset.accessPolicy.modelTypes],
      industryScenarios: [...dataset.accessPolicy.industryScenarios],
      regions: [...dataset.accessPolicy.regions],
      orgStructures: [...dataset.accessPolicy.orgStructures],
      tenantIds: [...dataset.accessPolicy.tenantIds],
      tenantNames: [...dataset.accessPolicy.tenantNames],
      permissions: { ...dataset.accessPolicy.permissions },
    });
    setEditError("");
  };

  const closeEditor = () => {
    setEditingDatasetId(null);
    setEditDraft(null);
    setEditError("");
  };

  const toggleDraftItem = (key: "modelTypes" | "industryScenarios" | "regions" | "orgStructures", value: string) => {
    setEditDraft((current) => {
      if (!current) {
        return current;
      }

      const exists = current[key].includes(value);
      return {
        ...current,
        [key]: exists ? current[key].filter((item) => item !== value) : [...current[key], value],
      };
    });
  };

  const toggleTenantSelection = (tenantId: string, tenantName: string) => {
    setEditDraft((current) => {
      if (!current) {
        return current;
      }

      const exists = current.tenantIds.includes(tenantId);
      const nextTenantIds = exists ? current.tenantIds.filter((item) => item !== tenantId) : [...current.tenantIds, tenantId];
      const nextTenantNames = exists ? current.tenantNames.filter((item) => item !== tenantName) : [...current.tenantNames, tenantName];
      return {
        ...current,
        tenantIds: nextTenantIds,
        tenantNames: nextTenantNames,
      };
    });
  };

  const updateDraftPermission = (key: keyof DatasetAccessPolicy["permissions"], checked: boolean) => {
    setEditDraft((current) => (current ? { ...current, permissions: { ...current.permissions, [key]: checked } } : current));
  };

  const saveDatasetAccess = () => {
    if (!editingDataset || !editDraft) {
      return;
    }

    if (editDraft.scope === "租户" && editDraft.tenantIds.length === 0) {
      setEditError("租户共享范围下请至少选择一个租户。");
      return;
    }

    if (
      editDraft.modelTypes.length === 0 ||
      editDraft.industryScenarios.length === 0 ||
      editDraft.regions.length === 0 ||
      editDraft.orgStructures.length === 0
    ) {
      setEditError("请至少为模型类型、行业场景、地域和组织结构各选择一项。");
      return;
    }

    const normalizedPolicy: DatasetAccessPolicy = {
      ...editDraft,
      tenantIds: editDraft.scope === "租户" ? editDraft.tenantIds : [],
      tenantNames: editDraft.scope === "租户" ? editDraft.tenantNames : [],
      updatedAt: `2026-04-25 ${nowTime()}`,
    };
    const nextVisibility = datasetPermissionScopeToVisibility(normalizedPolicy.scope);

    setDatasets((current) =>
      current.map((item) =>
        item.id === editingDataset.id
          ? {
              ...item,
              visibility: nextVisibility,
              updatedAt: normalizedPolicy.updatedAt,
              accessPolicy: normalizedPolicy,
            }
          : item,
      ),
    );
    addAudit({
      actor: "数据集治理中心",
      action: "更新数据集共享范围与权限策略",
      target: `${editingDataset.name} / ${normalizedPolicy.scope} / ${normalizedPolicy.watermarkPolicy}`,
      result: "成功",
    });
    closeEditor();
  };

  return (
    <ModuleScaffold scenarioKey="datasets">
      <section className="surface-panel">
        <SectionHeader
          eyebrow="DATASET HUB"
          title="数据集管理"
          description="先在列表页浏览数据资产，再进入详情页查看快照、差异对比和版本回滚，避免把治理动作与文件操作堆在同一页。"
        />
        <div className="cloud-workflow-strip">
          <SecurityNode icon={Database} label="数据集总数" value={`${datasets.length} 个`} tone="blue" />
          <SecurityNode icon={Users} label="租户共享" value={`${sharedCount} 个`} tone="emerald" />
          <SecurityNode icon={Globe} label="公开可见" value={`${publicCount} 个`} tone="cyan" />
          <SecurityNode icon={LockKeyhole} label="私有资产" value={`${privateCount} 个`} tone="amber" />
        </div>
        <div className="form-grid three">
          <label className="field">
            <span>搜索数据集</span>
            <input value={keyword} placeholder="名称、摘要、标签" onChange={(event) => setKeyword(event.target.value)} />
          </label>
          <label className="field">
            <span>可见范围</span>
            <select value={visibility} onChange={(event) => setVisibility(event.target.value as "全部" | DatasetVisibility)}>
              <option value="全部">全部</option>
              <option value="私有">私有</option>
              <option value="租户共享">租户共享</option>
              <option value="公开">公开</option>
            </select>
          </label>
          <label className="field">
            <span>数据模态</span>
            <select value={modality} onChange={(event) => setModality(event.target.value)}>
              {modalityOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="dataset-list-toolbar">
          <StatusBadge tone="blue">{`共 ${filteredDatasets.length} 个数据集`}</StatusBadge>
          <StatusBadge tone="slate">{`第 ${page} / ${totalPages} 页`}</StatusBadge>
          <StatusBadge tone="emerald">{`每页 ${pageSize} 个`}</StatusBadge>
        </div>
      </section>

      <section className="dataset-hub-grid">
        {pagedDatasets.map((dataset) => {
          return (
            <article key={dataset.id} className="surface-panel dataset-hub-card" onClick={() => openDataset(dataset)} role="button" tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openDataset(dataset);
                }
              }}
            >
              <div className="dataset-hub-card-head">
                <div>
                  <h3>{dataset.name}</h3>
                  <span className="dataset-card-type">{`类型：${dataset.modality}`}</span>
                </div>
                <StatusBadge tone={datasetVisibilityTone(dataset.visibility)}>{dataset.visibility}</StatusBadge>
              </div>
              <p className="dataset-card-summary">{dataset.summary}</p>
              <div className="dataset-stats-row">
                <span>{dataset.domain}</span>
                <span>{dataset.sampleCount}</span>
                <span>{dataset.storage}</span>
              </div>
              <div className="dataset-card-footer">
                <div>
                  <strong>{`${dataset.accessPolicy.scope} / ${dataset.accessPolicy.watermarkPolicy}`}</strong>
                  <span>{`有效期至 ${dataset.accessPolicy.effectiveUntil} · ${dataset.accessPolicy.updatedAt}`}</span>
                </div>
                <button
                  className="inline-action"
                  onClick={(event) => {
                    event.stopPropagation();
                    openEditor(dataset);
                  }}
                >
                  编辑
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <div className="pagination-row">
        <Button variant="ghost" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
          上一页
        </Button>
        <div className="pagination-indicator">
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index + 1} className={page === index + 1 ? "active" : ""} onClick={() => setPage(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
        <Button variant="ghost" disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
          下一页
        </Button>
      </div>

      {editingDataset && editDraft ? (
        <div className="modal-backdrop" role="presentation" onClick={closeEditor}>
          <section className="modal-panel dataset-access-modal" role="dialog" aria-modal="true" aria-labelledby="dataset-access-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">DATASET ACCESS</span>
                <h3 id="dataset-access-title">{editingDataset.name}</h3>
                <p>在数据集卡片的编辑入口中完成第 12 条设置：按模型类型、行业场景、地域和组织结构控制共享范围，并设置有效期、水印策略与只读/编辑/下载/共享权限。</p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={closeEditor}>
                <X size={18} />
              </button>
            </div>

            <div className="allocation-summary compact">
              <KeyValue label="负责人" value={editingDataset.owner} />
              <KeyValue label="数据模态" value={editingDataset.modality} />
              <KeyValue label="行业领域" value={editingDataset.domain} />
              <KeyValue label="当前快照" value={editingDataset.versions.find((item) => item.id === editingDataset.currentVersionId)?.version ?? "-"} />
            </div>

            <div className="tier-selector">
              {(["个人", "租户", "公开"] as const).map((item) => (
                <button key={item} className={editDraft.scope === item ? "selected" : ""} onClick={() => setEditDraft((current) => (current ? { ...current, scope: item } : current))}>
                  <span>{item}</span>
                  <small>{item === "个人" ? "仅发布者或责任团队可见。" : item === "租户" ? "按租户与组织结构定向共享。" : "公开数据集按策略开放查看与下载。"}</small>
                </button>
              ))}
            </div>

            <div className="form-grid two">
              <label className="field">
                <span>权限有效期</span>
                <input type="date" value={editDraft.effectiveUntil} onChange={(event) => setEditDraft((current) => (current ? { ...current, effectiveUntil: event.target.value } : current))} />
              </label>
              <label className="field">
                <span>水印策略</span>
                <select value={editDraft.watermarkPolicy} onChange={(event) => setEditDraft((current) => (current ? { ...current, watermarkPolicy: event.target.value as DatasetWatermarkPolicy } : current))}>
                  <option value="关闭">关闭</option>
                  <option value="租户标识水印">租户标识水印</option>
                  <option value="实名下载水印">实名下载水印</option>
                  <option value="动态追踪水印">动态追踪水印</option>
                </select>
              </label>
            </div>

            <section className="release-tenant-block">
              <SectionHeader eyebrow="SHARE DIMENSIONS" title="共享范围维度" description="发布者可按模型类型、行业场景、地域与组织结构组合设置分享范围，后续也可以随时回到卡片继续修改。" />
              <div className="dataset-access-sections">
                <div className="dataset-access-section">
                  <span>模型类型</span>
                  <div className="ft-tag-strip">
                    {modelTypeOptions.map((item) => (
                      <button key={item} type="button" className={`dataset-access-chip ${editDraft.modelTypes.includes(item) ? "is-active" : ""}`} onClick={() => toggleDraftItem("modelTypes", item)}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="dataset-access-section">
                  <span>行业场景</span>
                  <div className="ft-tag-strip">
                    {industryOptions.map((item) => (
                      <button key={item} type="button" className={`dataset-access-chip ${editDraft.industryScenarios.includes(item) ? "is-active" : ""}`} onClick={() => toggleDraftItem("industryScenarios", item)}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="dataset-access-section">
                  <span>地域</span>
                  <div className="ft-tag-strip">
                    {regionOptions.map((item) => (
                      <button key={item} type="button" className={`dataset-access-chip ${editDraft.regions.includes(item) ? "is-active" : ""}`} onClick={() => toggleDraftItem("regions", item)}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="dataset-access-section">
                  <span>组织结构</span>
                  <div className="ft-tag-strip">
                    {orgOptions.map((item) => (
                      <button key={item} type="button" className={`dataset-access-chip ${editDraft.orgStructures.includes(item) ? "is-active" : ""}`} onClick={() => toggleDraftItem("orgStructures", item)}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {editDraft.scope === "租户" ? (
              <div className="release-tenant-block">
                <SectionHeader eyebrow="TENANT RANGE" title="租户共享范围" description="租户共享数据集支持按组织租户精确下发；发布者可随时修改共享范围，无需离开卡片页。" />
                <div className="release-tenant-list">
                  {releaseTenants.map((tenant) => (
                    <label key={tenant.id} className="release-tenant-item">
                      <div className="tenant-binding-toggle">
                        <input
                          type="checkbox"
                          checked={editDraft.tenantIds.includes(tenant.id)}
                          onChange={() => toggleTenantSelection(tenant.id, tenant.name)}
                        />
                        <div>
                          <strong>{tenant.name}</strong>
                          <span>{`${tenant.cpu} CPU / ${tenant.gpu} GPU / ${tenant.vgpu} vGPU`}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            <section className="release-tenant-block">
              <SectionHeader eyebrow="PERMISSION MATRIX" title="权限设置" description="支持按个人、租户或公开数据集配置只读、编辑、下载和共享权限。" />
              <div className="dataset-permission-grid">
                <label className="switch-row">
                  <input type="checkbox" checked={editDraft.permissions.read} onChange={(event) => updateDraftPermission("read", event.target.checked)} />
                  <span>只读</span>
                </label>
                <label className="switch-row">
                  <input type="checkbox" checked={editDraft.permissions.edit} onChange={(event) => updateDraftPermission("edit", event.target.checked)} />
                  <span>编辑</span>
                </label>
                <label className="switch-row">
                  <input type="checkbox" checked={editDraft.permissions.download} onChange={(event) => updateDraftPermission("download", event.target.checked)} />
                  <span>下载</span>
                </label>
                <label className="switch-row">
                  <input type="checkbox" checked={editDraft.permissions.share} onChange={(event) => updateDraftPermission("share", event.target.checked)} />
                  <span>共享</span>
                </label>
              </div>
            </section>

            <LogPanel
              title="权限策略预览"
              lines={[
                `scope: ${editDraft.scope}`,
                `visibility: ${datasetPermissionScopeToVisibility(editDraft.scope)}`,
                `model_types: ${editDraft.modelTypes.join("、") || "未配置"}`,
                `industry_scenarios: ${editDraft.industryScenarios.join("、") || "未配置"}`,
                `regions: ${editDraft.regions.join("、") || "未配置"}`,
                `org_structures: ${editDraft.orgStructures.join("、") || "未配置"}`,
                `tenants: ${editDraft.scope === "租户" ? editDraft.tenantNames.join("、") || "未选择" : "不适用"}`,
                `watermark: ${editDraft.watermarkPolicy}`,
                `expires: ${editDraft.effectiveUntil}`,
                `permissions: read=${editDraft.permissions.read} edit=${editDraft.permissions.edit} download=${editDraft.permissions.download} share=${editDraft.permissions.share}`,
              ]}
            />

            {editError ? <div className="field-error">{editError}</div> : null}

            <div className="modal-actions">
              <Button variant="ghost" onClick={closeEditor}>
                取消
              </Button>
              <Button variant="secondary" icon={Settings} onClick={saveDatasetAccess}>
                保存设置
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </ModuleScaffold>
  );
}

function DatasetDetailPage({
  datasets,
  setDatasets,
  addAudit,
}: {
  datasets: DatasetAsset[];
  setDatasets: React.Dispatch<React.SetStateAction<DatasetAsset[]>>;
  addAudit: (event: Omit<AuditEvent, "id" | "time">) => void;
}) {
  const navigate = useNavigate();
  const { datasetId } = useParams();
  const dataset = datasets.find((item) => item.id === datasetId);
  const [compareBaseId, setCompareBaseId] = useState("");
  const [compareTargetId, setCompareTargetId] = useState("");
  const [rollbackTargetId, setRollbackTargetId] = useState<string | null>(null);

  useEffect(() => {
    if (!dataset) {
      return;
    }
    setCompareTargetId(dataset.currentVersionId);
    setCompareBaseId(dataset.versions.find((item) => item.id !== dataset.currentVersionId)?.id ?? dataset.currentVersionId);
  }, [dataset?.currentVersionId, dataset?.id]);

  if (!dataset) {
    return (
      <ModuleScaffold scenarioKey="datasets">
        <section className="surface-panel">
          <SectionHeader eyebrow="DATASET DETAIL" title="未找到对应数据集" description="请返回数据集管理列表，重新选择需要查看的数据资产。" />
          <div className="action-row">
            <Button variant="secondary" onClick={() => navigate("/datasets")}>
              返回数据集列表
            </Button>
          </div>
        </section>
      </ModuleScaffold>
    );
  }

  const currentVersion = dataset.versions.find((item) => item.id === dataset.currentVersionId) ?? dataset.versions[0];
  const compareBase = dataset.versions.find((item) => item.id === compareBaseId) ?? dataset.versions[0];
  const compareTarget = dataset.versions.find((item) => item.id === compareTargetId) ?? currentVersion;
  const rollbackTarget = dataset.versions.find((item) => item.id === rollbackTargetId) ?? null;
  const joinFields = (fields: DatasetSnapshotField[]) => fields.map((item) => `${item.label}: ${item.value}`).join(" / ");
  const comparisonCards = [
    { label: "训练数据血缘", base: compareBase.lineage.join(" -> "), target: compareTarget.lineage.join(" -> ") },
    { label: "代码提交信息", base: `${compareBase.codeCommit} · ${compareBase.commitMessage}`, target: `${compareTarget.codeCommit} · ${compareTarget.commitMessage}` },
    { label: "训练超参数", base: joinFields(compareBase.hyperParams), target: joinFields(compareTarget.hyperParams) },
    { label: "性能指标", base: joinFields(compareBase.metrics), target: joinFields(compareTarget.metrics) },
    { label: "版本说明", base: compareBase.changeNotes.join("；"), target: compareTarget.changeNotes.join("；") },
    { label: "生成时间", base: `${compareBase.createdAt} / ${compareBase.createdBy}`, target: `${compareTarget.createdAt} / ${compareTarget.createdBy}` },
  ];

  const confirmRollback = () => {
    if (!rollbackTarget) {
      return;
    }

    setDatasets((current) =>
      current.map((item) =>
        item.id === dataset.id
          ? {
              ...item,
              currentVersionId: rollbackTarget.id,
              updatedAt: `2026-04-25 ${nowTime()}`,
            }
          : item,
      ),
    );
    addAudit({
      actor: "数据集治理中心",
      action: "执行数据集快照回滚",
      target: `${dataset.name} -> ${rollbackTarget.version}`,
      result: "成功",
    });
    setRollbackTargetId(null);
  };

  return (
    <ModuleScaffold scenarioKey="datasets">
      <section className="surface-panel">
        <div className="dataset-detail-header">
          <div>
            <button className="inline-action" onClick={() => navigate("/datasets")}>
              返回数据集列表
            </button>
            <SectionHeader
              eyebrow="DATASET SNAPSHOT"
              title={dataset.name}
              description="详情页专门负责版本快照、血缘、代码提交、性能指标、差异对比与回滚，符合数据治理链路。"
            />
          </div>
          <div className="dataset-detail-badges">
            <StatusBadge tone="emerald">{`当前版本 ${currentVersion.version}`}</StatusBadge>
            <StatusBadge tone="blue">{dataset.visibility}</StatusBadge>
          </div>
        </div>

        <div className="allocation-summary dataset-detail-summary">
          <KeyValue label="负责人" value={dataset.owner} />
          <KeyValue label="任务类型" value={dataset.task} />
          <KeyValue label="样本规模" value={dataset.sampleCount} />
          <KeyValue label="存储占用" value={dataset.storage} />
          <KeyValue label="消费方" value={dataset.consumers.join("、")} />
          <KeyValue label="最近更新时间" value={dataset.updatedAt} />
        </div>
        <div className="card-tag-strip">
          {dataset.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </section>

      <section className="surface-panel">
        <SectionHeader
          eyebrow="CURRENT SNAPSHOT"
          title="当前生效快照"
          description="集中展示当前上线版本的训练数据血缘、代码提交信息、超参数与性能指标。"
        />
        <div className="dataset-current-grid">
          <article className="dataset-current-card">
            <h4>训练数据血缘</h4>
            <ul className="dataset-lineage-list">
              {currentVersion.lineage.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="dataset-current-card">
            <h4>代码提交信息</h4>
            <strong>{currentVersion.codeCommit}</strong>
            <p>{currentVersion.commitMessage}</p>
            <small>{`${currentVersion.createdAt} / ${currentVersion.createdBy}`}</small>
          </article>
        </div>
        <div className="dataset-version-panels">
          <article className="dataset-version-panel">
            <h4>训练超参数</h4>
            <div className="dataset-kv-grid">
              {currentVersion.hyperParams.map((item) => (
                <KeyValue key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </article>
          <article className="dataset-version-panel">
            <h4>性能指标</h4>
            <div className="dataset-kv-grid">
              {currentVersion.metrics.map((item) => (
                <KeyValue key={item.label} label={item.label} value={item.value} positive />
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="surface-panel">
        <SectionHeader
          eyebrow="ALL SNAPSHOTS"
          title="全部版本快照"
          description="展示所有版本快照，并支持设为对比基线、设为对比版本或直接回滚。"
        />
        <div className="dataset-version-list">
          {dataset.versions.map((version) => {
            const isCurrent = version.id === dataset.currentVersionId;
            return (
              <article key={version.id} className={`dataset-version-card ${isCurrent ? "is-current" : ""}`}>
                <div className="dataset-version-head">
                  <div>
                    <span className="eyebrow">SNAPSHOT</span>
                    <h3>{version.version}</h3>
                    <p>{version.summary}</p>
                  </div>
                  <StatusBadge tone={isCurrent ? "emerald" : "slate"}>{isCurrent ? "当前版本" : "历史快照"}</StatusBadge>
                </div>
                <div className="dataset-version-meta">
                  <span>{`提交 ${version.codeCommit}`}</span>
                  <span>{version.createdBy}</span>
                  <span>{version.createdAt}</span>
                </div>
                <ul className="dataset-lineage-list">
                  {version.lineage.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="dataset-version-panels">
                  <article className="dataset-version-panel">
                    <h4>超参数</h4>
                    <div className="dataset-kv-grid">
                      {version.hyperParams.map((item) => (
                        <KeyValue key={`${version.id}-${item.label}`} label={item.label} value={item.value} />
                      ))}
                    </div>
                  </article>
                  <article className="dataset-version-panel">
                    <h4>指标</h4>
                    <div className="dataset-kv-grid">
                      {version.metrics.map((item) => (
                        <KeyValue key={`${version.id}-${item.label}`} label={item.label} value={item.value} positive />
                      ))}
                    </div>
                  </article>
                </div>
                <div className="dataset-version-notes">
                  {version.changeNotes.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="table-action-stack">
                  <button className="inline-action" onClick={() => setCompareBaseId(version.id)}>
                    设为对比基线
                  </button>
                  <button
                    className="inline-action"
                    onClick={() => {
                      setCompareTargetId(version.id);
                      addAudit({ actor: "数据集治理中心", action: "切换数据集对比版本", target: `${dataset.name} / ${version.version}`, result: "成功" });
                    }}
                  >
                    设为对比版本
                  </button>
                  <button className="inline-action" onClick={() => setRollbackTargetId(version.id)} disabled={isCurrent}>
                    回滚到此版本
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="surface-panel">
        <SectionHeader
          eyebrow="COMPARE"
          title="版本差异对比"
          description="直接比较训练数据血缘、代码提交信息、超参数与性能指标，为回滚提供依据。"
        />
        <div className="form-grid two">
          <label className="field">
            <span>对比基线</span>
            <select value={compareBaseId} onChange={(event) => setCompareBaseId(event.target.value)}>
              {dataset.versions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.version}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>对比版本</span>
            <select value={compareTargetId} onChange={(event) => setCompareTargetId(event.target.value)}>
              {dataset.versions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.version}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="dataset-compare-grid">
          {comparisonCards.map((item) => (
            <article key={item.label} className={`dataset-compare-card ${item.base !== item.target ? "is-changed" : ""}`}>
              <span>{item.label}</span>
              <strong>基线</strong>
              <p>{item.base}</p>
              <strong>对比</strong>
              <p>{item.target}</p>
            </article>
          ))}
        </div>
      </section>

      {rollbackTarget ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setRollbackTargetId(null)}>
          <section className="modal-panel password-dialog" role="dialog" aria-modal="true" aria-labelledby="dataset-rollback-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">ROLLBACK SNAPSHOT</span>
                <h3 id="dataset-rollback-title">{`回滚到 ${rollbackTarget.version}`}</h3>
                <p>确认后会将该快照重新设为当前版本，并保留所有历史快照记录，满足版本治理和审计留痕要求。</p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={() => setRollbackTargetId(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="allocation-summary compact">
              <KeyValue label="目标数据集" value={dataset.name} />
              <KeyValue label="回滚版本" value={rollbackTarget.version} />
              <KeyValue label="代码提交" value={rollbackTarget.codeCommit} />
              <KeyValue label="生成时间" value={rollbackTarget.createdAt} />
              <KeyValue label="血缘摘要" value={rollbackTarget.lineage[0]} />
              <KeyValue label="执行结果" value="更新当前生效快照并写入审计" />
            </div>
            <LogPanel
              title="回滚预览"
              lines={[
                `dataset: ${dataset.name}`,
                `target_snapshot: ${rollbackTarget.version}`,
                `code_commit: ${rollbackTarget.codeCommit}`,
                `lineage: ${rollbackTarget.lineage.join(" | ")}`,
              ]}
            />
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setRollbackTargetId(null)}>
                取消
              </Button>
              <Button variant="secondary" icon={RefreshCcw} onClick={confirmRollback}>
                确认回滚
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </ModuleScaffold>
  );
}

function TaskManagementPage({
  datasets,
  addAudit,
}: {
  datasets: DatasetAsset[];
  addAudit: (event: Omit<AuditEvent, "id" | "time">) => void;
}) {
  type ManagedTask = {
    id: string;
    name: string;
    type: string;
    framework?: string;
    frameworkVersion?: string;
    dataset?: string;
    preheatProfile?: string;
    owner: string;
    queue: string;
    priority: "P0" | "P1" | "P2" | "P3";
    resource: string;
    status: string;
    decision: string;
    preempt: string;
  };

  type FrameworkPreset = {
    id: string;
    name: string;
    summary: string;
    type: string;
    queue: string;
    priority: ManagedTask["priority"];
    versions: string[];
    skus: string[];
  };

  const initialTasks: ManagedTask[] = [
    {
      id: "tm-001",
      name: "expert-sft-priority",
      type: "专家微调",
      owner: "算法组-专家训练",
      queue: "ft-expert",
      priority: "P1",
      resource: "4 GPU / 256GB",
      status: "等待资源",
      decision: "可提升优先级后触发抢占",
      preempt: "PreemptLowerPriority",
    },
    {
      id: "tm-002",
      name: "batch-embedding-refresh",
      type: "离线批任务",
      owner: "向量服务组",
      queue: "ft-backfill",
      priority: "P3",
      resource: "4 GPU / 128GB",
      status: "运行中",
      decision: "低优先级，可作为 victim",
      preempt: "可被 P0 / P1 抢占",
    },
    {
      id: "tm-003",
      name: "online-guard-infer",
      type: "在线推理保障",
      owner: "推理网关",
      queue: "service-reserved",
      priority: "P1",
      resource: "2 GPU / SLA",
      status: "受保护运行中",
      decision: "配置了不可抢占策略",
      preempt: "Never",
    },
    {
      id: "tm-004",
      name: "lora-hotfix-run",
      type: "快速微调",
      owner: "应用运营",
      queue: "ft-fast",
      priority: "P2",
      resource: "1 GPU / 64GB",
      status: "运行中",
      decision: "可被更高优先级任务回收",
      preempt: "PreemptLowerPriority",
    },
    {
      id: "tm-005",
      name: "expert-sft-b",
      type: "专家微调",
      owner: "算法组-B",
      queue: "ft-expert",
      priority: "P1",
      resource: "4 GPU / 256GB",
      status: "排队中",
      decision: "与同级任务不互抢",
      preempt: "SamePriorityDisabled",
    },
    {
      id: "tm-006",
      name: "agent-router-train",
      type: "专家微调",
      owner: "智能体研发组",
      queue: "ft-expert",
      priority: "P2",
      resource: "4 GPU / 192GB",
      status: "等待资源",
      decision: "等待专家队列释放资源",
      preempt: "PreemptLowerPriority",
    },
    {
      id: "tm-007",
      name: "ocr-adapter-lora",
      type: "快速微调",
      owner: "视觉应用组",
      queue: "ft-fast",
      priority: "P2",
      resource: "1 GPU / 48GB",
      status: "运行中",
      decision: "占用单卡，可被更高优先级任务回收",
      preempt: "PreemptLowerPriority",
    },
    {
      id: "tm-008",
      name: "gov-qa-nightly",
      type: "离线批任务",
      owner: "政务模型组",
      queue: "ft-backfill",
      priority: "P3",
      resource: "2 GPU / 64GB",
      status: "回填运行中",
      decision: "填充夜间碎片资源",
      preempt: "可被 P0 / P1 / P2 抢占",
    },
    {
      id: "tm-009",
      name: "speech-cleanup-job",
      type: "数据清洗",
      owner: "语音平台组",
      queue: "system-batch",
      priority: "P3",
      resource: "1 GPU / 32GB",
      status: "运行中",
      decision: "低优先级批处理任务",
      preempt: "可被 P0 / P1 / P2 抢占",
    },
    {
      id: "tm-010",
      name: "secure-infer-blue",
      type: "在线推理保障",
      owner: "政务推理网关",
      queue: "service-reserved",
      priority: "P1",
      resource: "2 GPU / SLA",
      status: "受保护运行中",
      decision: "蓝绿发布期间禁止被抢占",
      preempt: "Never",
    },
    {
      id: "tm-011",
      name: "multi-modal-rdma-a",
      type: "多模态训练",
      owner: "视觉算法组",
      queue: "ft-rdma",
      priority: "P0",
      resource: "8 GPU / IB",
      status: "拓扑等待",
      decision: "等待同机架 IB 资源",
      preempt: "仅可抢占低优先级训练任务",
    },
    {
      id: "tm-012",
      name: "multi-modal-rdma-b",
      type: "多模态训练",
      owner: "视觉算法组",
      queue: "ft-rdma",
      priority: "P1",
      resource: "8 GPU / IB",
      status: "排队中",
      decision: "等待上一任务完成或资源释放",
      preempt: "PreemptLowerPriority",
    },
    {
      id: "tm-013",
      name: "finance-rerank-sft",
      type: "专家微调",
      owner: "金融模型组",
      queue: "ft-expert",
      priority: "P1",
      resource: "4 GPU / 256GB",
      status: "已获得资源",
      decision: "已完成资源锁定，等待容器启动",
      preempt: "可抢占 P2 / P3 任务",
    },
    {
      id: "tm-014",
      name: "search-index-warmup",
      type: "缓存预热",
      owner: "检索服务组",
      queue: "system-batch",
      priority: "P3",
      resource: "1 GPU / NVMe",
      status: "运行中",
      decision: "用于索引热加载",
      preempt: "可被 P0 / P1 / P2 抢占",
    },
    {
      id: "tm-015",
      name: "ops-ticket-fastfix",
      type: "快速微调",
      owner: "运维平台组",
      queue: "ft-fast",
      priority: "P2",
      resource: "1 GPU / 64GB",
      status: "等待资源",
      decision: "单卡 LoRA 任务，等待回填窗口",
      preempt: "PreemptLowerPriority",
    },
    {
      id: "tm-016",
      name: "city-agent-eval",
      type: "离线评测",
      owner: "城市治理租户",
      queue: "ft-backfill",
      priority: "P3",
      resource: "2 GPU / 48GB",
      status: "回填运行中",
      decision: "占用低峰碎片资源",
      preempt: "可被 P0 / P1 / P2 抢占",
    },
    {
      id: "tm-017",
      name: "guardrail-rules-sync",
      type: "系统同步",
      owner: "内容安全组",
      queue: "system-batch",
      priority: "P2",
      resource: "1 GPU / 24GB",
      status: "运行中",
      decision: "同步规则索引，可被更高优先级回收",
      preempt: "PreemptLowerPriority",
    },
    {
      id: "tm-018",
      name: "doc-parser-train",
      type: "专家微调",
      owner: "文档理解组",
      queue: "ft-expert",
      priority: "P1",
      resource: "4 GPU / 192GB",
      status: "排队中",
      decision: "与同级专家任务按 FIFO 排序",
      preempt: "SamePriorityDisabled",
    },
    {
      id: "tm-019",
      name: "customer-bot-lora",
      type: "快速微调",
      owner: "客服模型组",
      queue: "ft-fast",
      priority: "P2",
      resource: "1 GPU / 40GB",
      status: "运行中",
      decision: "低成本快速微调通道",
      preempt: "PreemptLowerPriority",
    },
    {
      id: "tm-020",
      name: "edge-vision-infer",
      type: "在线推理保障",
      owner: "边缘推理组",
      queue: "service-reserved",
      priority: "P1",
      resource: "2 GPU / SLA",
      status: "受保护运行中",
      decision: "核心在线服务，启用抢占保护",
      preempt: "Never",
    },
    {
      id: "tm-021",
      name: "dataset-dedup-run",
      type: "数据清洗",
      owner: "数据平台组",
      queue: "system-batch",
      priority: "P3",
      resource: "1 GPU / 16GB",
      status: "运行中",
      decision: "基础批作业，优先级最低",
      preempt: "可被 P0 / P1 / P2 抢占",
    },
    {
      id: "tm-022",
      name: "ranking-model-sft",
      type: "专家微调",
      owner: "推荐算法组",
      queue: "ft-expert",
      priority: "P2",
      resource: "4 GPU / 256GB",
      status: "等待资源",
      decision: "等待空闲 GPU 或提升优先级",
      preempt: "PreemptLowerPriority",
    },
    {
      id: "tm-023",
      name: "secure-redline-check",
      type: "离线评测",
      owner: "安全审计组",
      queue: "ft-backfill",
      priority: "P3",
      resource: "1 GPU / 24GB",
      status: "排队中",
      decision: "可进入碎片资源池执行",
      preempt: "可被 P0 / P1 / P2 抢占",
    },
    {
      id: "tm-024",
      name: "intent-router-patch",
      type: "快速微调",
      owner: "路由策略组",
      queue: "ft-fast",
      priority: "P2",
      resource: "1 GPU / 32GB",
      status: "等待资源",
      decision: "等待回填池空位",
      preempt: "PreemptLowerPriority",
    },
    {
      id: "tm-025",
      name: "policy-embedding-refresh",
      type: "缓存预热",
      owner: "检索服务组",
      queue: "system-batch",
      priority: "P3",
      resource: "1 GPU / 32GB",
      status: "运行中",
      decision: "刷新向量缓存，可被回收",
      preempt: "可被 P0 / P1 / P2 抢占",
    },
  ];

  const [tasks, setTasks] = useState<ManagedTask[]>(initialTasks);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pendingAction, setPendingAction] = useState<{ type: "elevate" | "preempt"; taskId: string } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const priorityOrder: ManagedTask["priority"][] = ["P3", "P2", "P1", "P0"];
  const frameworkPresets: FrameworkPreset[] = [
    {
      id: "pytorch",
      name: "PyTorch",
      summary: "适合通用训练、微调与分布式任务。",
      type: "专家微调",
      queue: "ft-expert",
      priority: "P1",
      versions: ["2.4", "2.5", "2.6"],
      skus: ["A100 x4 / 256GB", "H200 x8 / 512GB", "L40S x2 / 128GB"],
    },
    {
      id: "tensorflow",
      name: "TensorFlow",
      summary: "适合图训练、Serving 联动和标准训练流水线。",
      type: "离线训练",
      queue: "ft-backfill",
      priority: "P2",
      versions: ["2.15", "2.16", "2.17"],
      skus: ["A100 x2 / 128GB", "A800 x4 / 256GB", "CPU Large / 128GB"],
    },
    {
      id: "mindspore",
      name: "MindSpore",
      summary: "适合昇腾生态训练与推理任务。",
      type: "专家微调",
      queue: "ft-expert",
      priority: "P1",
      versions: ["2.3", "2.4", "2.5"],
      skus: ["Ascend 910B x4 / 256GB", "Ascend 910B x8 / 512GB", "Ascend 310P x2 / 96GB"],
    },
    {
      id: "paddlepaddle",
      name: "PaddlePaddle",
      summary: "适合产业场景训练、OCR 与多模态任务。",
      type: "模型训练",
      queue: "ft-fast",
      priority: "P2",
      versions: ["2.6", "2.7", "3.0"],
      skus: ["A10 x2 / 96GB", "A100 x4 / 192GB", "T4 x4 / 64GB"],
    },
    {
      id: "llama-factory",
      name: "Llama-Factory",
      summary: "适合 SFT、LoRA、DPO 等大模型调优任务。",
      type: "快速微调",
      queue: "ft-fast",
      priority: "P2",
      versions: ["0.9", "0.10", "0.11"],
      skus: ["L40S x1 / 64GB", "A100 x2 / 128GB", "H20 x4 / 256GB"],
    },
    {
      id: "ms-swift",
      name: "MS-Swift",
      summary: "适合多模型统一调优和实验任务管理。",
      type: "专家微调",
      queue: "ft-expert",
      priority: "P1",
      versions: ["2.4", "2.5", "3.0"],
      skus: ["A100 x4 / 256GB", "H200 x4 / 384GB", "L20 x2 / 96GB"],
    },
    {
      id: "deepspeed",
      name: "DeepSpeed",
      summary: "适合大规模分布式训练、ZeRO 优化与吞吐提升。",
      type: "分布式训练",
      queue: "ft-rdma",
      priority: "P1",
      versions: ["0.14", "0.15", "0.16"],
      skus: ["A100 x8 / IB", "H100 x8 / IB", "H200 x8 / IB"],
    },
    {
      id: "transformers",
      name: "Transformers",
      summary: "适合通用 NLP、多模态模型加载与推理训练一体化。",
      type: "模型训练",
      queue: "ft-fast",
      priority: "P2",
      versions: ["4.44", "4.46", "4.48"],
      skus: ["L40S x2 / 128GB", "A100 x2 / 128GB", "CPU Large / 128GB"],
    },
    {
      id: "jax",
      name: "JAX",
      summary: "适合高性能数值计算与 TPU/GPU 并行训练。",
      type: "离线训练",
      queue: "ft-backfill",
      priority: "P2",
      versions: ["0.4.30", "0.4.31", "0.5.0"],
      skus: ["A100 x4 / 256GB", "H100 x8 / 512GB", "CPU Compute / 192GB"],
    },
    {
      id: "ray",
      name: "Ray",
      summary: "适合分布式训练、推理编排和多任务并行调度。",
      type: "分布式作业",
      queue: "system-batch",
      priority: "P2",
      versions: ["2.9", "2.10", "2.11"],
      skus: ["A10 x4 / 128GB", "A100 x4 / 256GB", "CPU Cluster / 256GB"],
    },
    {
      id: "vllm",
      name: "vLLM",
      summary: "适合高吞吐大模型推理、评测和服务压测任务。",
      type: "推理评测",
      queue: "service-reserved",
      priority: "P1",
      versions: ["0.6", "0.7", "0.8"],
      skus: ["L40S x2 / 96GB", "H20 x4 / 256GB", "H100 x8 / 512GB"],
    },
    {
      id: "triton",
      name: "NVIDIA Triton",
      summary: "适合统一推理服务、模型编排和在线部署验证。",
      type: "在线推理保障",
      queue: "service-reserved",
      priority: "P1",
      versions: ["24.08", "24.10", "25.01"],
      skus: ["T4 x4 / 64GB", "L40S x2 / 96GB", "A100 x4 / 192GB"],
    },
  ];
  const taskDatasetOptions = useMemo(() => datasets.slice(0, 12), [datasets]);
  const [createDraft, setCreateDraft] = useState(() => ({
    taskName: "new-framework-task",
    frameworkId: frameworkPresets[0].id,
    version: frameworkPresets[0].versions[0],
    sku: frameworkPresets[0].skus[0],
    datasetIds: [] as string[],
    enablePreheat: false,
    preheatScope: "模型+数据集",
    preheatTrigger: "调度命中节点后预热",
    preheatRetention: "任务结束后释放",
  }));

  const selectedFramework = frameworkPresets.find((item) => item.id === createDraft.frameworkId) ?? frameworkPresets[0];
  const selectedTaskDatasets = taskDatasetOptions.filter((item) => createDraft.datasetIds.includes(item.id));
  const selectedTaskDatasetLabel = selectedTaskDatasets.length === 0 ? "未选择数据集" : selectedTaskDatasets.map((item) => item.name).join("、");

  const elevatePriority = (taskId: string) => {
    let nextPriority: ManagedTask["priority"] | null = null;
    let targetName = "";

    setTasks((items) =>
      items.map((item) => {
        if (item.id !== taskId) {
          return item;
        }

        targetName = item.name;
        const currentIndex = priorityOrder.indexOf(item.priority);
        nextPriority = priorityOrder[Math.min(currentIndex + 1, priorityOrder.length - 1)];

        if (nextPriority === item.priority) {
          return {
            ...item,
            decision: "已经是最高优先级，无需继续提升",
          };
        }

        return {
          ...item,
          priority: nextPriority,
          status: item.status.includes("运行") ? item.status : "等待高优先级调度",
          decision: `优先级已提升到 ${nextPriority}，可重新进入调度窗口`,
        };
      }),
    );

    addAudit({
      actor: "任务管理器",
      action: "提升任务优先级",
      target: `${targetName} -> ${nextPriority ?? "P0"}`,
      result: "成功",
    });
  };

  const triggerPreemption = (taskId: string) => {
    const actor = tasks.find((item) => item.id === taskId);
    if (!actor) {
      return;
    }

    const actorPriority = priorityOrder.indexOf(actor.priority);
    const victim = tasks.find((item) => {
      const victimPriority = priorityOrder.indexOf(item.priority);
      return (
        item.id !== actor.id &&
        (item.status.includes("运行") || item.status.includes("回填")) &&
        item.preempt !== "Never" &&
        victimPriority < actorPriority
      );
    });

    if (!victim) {
      setTasks((items) =>
        items.map((item) =>
          item.id === taskId
            ? {
                ...item,
                decision: "未找到可抢占的低优先级运行任务",
              }
            : item,
        ),
      );
      addAudit({
        actor: "任务管理器",
        action: "触发抢占失败，未找到 victim",
        target: actor.name,
        result: "告警",
      });
      return;
    }

    setTasks((items) =>
      items.map((item) => {
        if (item.id === actor.id) {
          return {
            ...item,
            status: "已获得资源",
            decision: `已抢占 ${victim.name}，进入启动阶段`,
          };
        }

        if (item.id === victim.id) {
          return {
            ...item,
            status: "被抢占回收",
            decision: `资源已让渡给 ${actor.name}，转为重新排队`,
          };
        }

        return item;
      }),
    );

    addAudit({
      actor: "任务管理器",
      action: "执行优先级抢占",
      target: `${actor.name} -> ${victim.name}`,
      result: "成功",
    });
  };

  const selectedTask = pendingAction ? tasks.find((item) => item.id === pendingAction.taskId) ?? null : null;
  const nextPriority =
    pendingAction?.type === "elevate" && selectedTask
      ? priorityOrder[Math.min(priorityOrder.indexOf(selectedTask.priority) + 1, priorityOrder.length - 1)]
      : null;
  const preemptVictim =
    pendingAction?.type === "preempt" && selectedTask
      ? tasks.find((item) => {
          const actorPriority = priorityOrder.indexOf(selectedTask.priority);
          const victimPriority = priorityOrder.indexOf(item.priority);
          return (
            item.id !== selectedTask.id &&
            (item.status.includes("运行") || item.status.includes("回填")) &&
            item.preempt !== "Never" &&
            victimPriority < actorPriority
          );
        }) ?? null
      : null;

  const confirmAction = () => {
    if (!pendingAction || !selectedTask) {
      setPendingAction(null);
      return;
    }

    if (pendingAction.type === "elevate") {
      elevatePriority(selectedTask.id);
    } else {
      triggerPreemption(selectedTask.id);
    }

    setPendingAction(null);
  };

  const runningCount = tasks.filter((item) => item.status.includes("运行") || item.status.includes("获得资源")).length;
  const waitingCount = tasks.filter((item) => item.status.includes("等待") || item.status.includes("排队")).length;
  const preemptCount = tasks.filter((item) => item.status.includes("抢占")).length;
  const filteredTasks = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) {
      return tasks;
    }

    return tasks.filter((item) =>
      [item.id, item.name, item.type, item.framework ?? "", item.frameworkVersion ?? "", item.owner, item.queue, item.priority, item.status, item.preempt]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [searchKeyword, tasks]);
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / 10));
  const currentPage = Math.min(page, totalPages);
  const pagedTasks = filteredTasks.slice((currentPage - 1) * 10, currentPage * 10);

  useEffect(() => {
    setPage(1);
  }, [searchKeyword]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const resetCreateDraft = () => {
    setCreateStep(1);
    setCreateDraft({
      taskName: "new-framework-task",
      frameworkId: frameworkPresets[0].id,
      version: frameworkPresets[0].versions[0],
      sku: frameworkPresets[0].skus[0],
      datasetIds: [],
      enablePreheat: false,
      preheatScope: "模型+数据集",
      preheatTrigger: "调度命中节点后预热",
      preheatRetention: "任务结束后释放",
    });
  };

  const toggleTaskDataset = (datasetId: string) => {
    setCreateDraft((current) => ({
      ...current,
      datasetIds: current.datasetIds.includes(datasetId)
        ? current.datasetIds.filter((id) => id !== datasetId)
        : [...current.datasetIds, datasetId],
    }));
  };

  const createTask = () => {
    if (!createDraft.taskName.trim() || createDraft.datasetIds.length === 0) {
      return;
    }

    const nextTask: ManagedTask = {
      id: `tm-${Date.now()}`,
      name: createDraft.taskName.trim(),
      type: selectedFramework.type,
      framework: selectedFramework.name,
      frameworkVersion: createDraft.version,
      dataset: selectedTaskDatasetLabel,
      preheatProfile: createDraft.enablePreheat ? `${createDraft.preheatScope} / 本地 NVMe` : undefined,
      owner: "平台预置框架",
      queue: selectedFramework.queue,
      priority: selectedFramework.priority,
      resource: createDraft.sku,
      status: "排队中",
      decision: createDraft.enablePreheat
        ? `已按 ${selectedFramework.name} ${createDraft.version} 创建任务，并将指定模型与数据集预加载到计算节点本地 NVMe 缓存`
        : `已按 ${selectedFramework.name} ${createDraft.version} 预置框架创建任务，等待调度资源分配`,
      preempt: selectedFramework.priority === "P1" ? "PreemptLowerPriority" : "可被 P0 / P1 抢占",
    };

    setTasks((items) => [nextTask, ...items]);
    setPage(1);
    addAudit({
      actor: "任务管理器",
      action: createDraft.enablePreheat ? "创建任务并启用数据预热" : "基于预置 AI 框架创建任务",
      target: `${selectedFramework.name} ${createDraft.version} / ${selectedTaskDatasetLabel}`,
      result: "成功",
    });
    setIsCreateOpen(false);
    resetCreateDraft();
  };

  return (
    <ModuleScaffold scenarioKey="tasks">
      <section className="surface-panel">
        <SectionHeader
          eyebrow="TASK CENTER"
          title="任务列表"
          description="默认进入任务列表。支持基于平台预置 AI 主流框架创建任务，并在表格内直接演示优先级提升和抢占调度行为。"
        />
        <div className="inline-notice warn">
          <strong>任务表内直接演示</strong>
          <span>点击“提升优先级”会把任务抬到更高调度等级；点击“触发抢占”会尝试回收低优先级且允许被抢占的运行任务。</span>
        </div>
        <div className="action-row">
          <StatusBadge tone="blue">{`${tasks.length} 个任务`}</StatusBadge>
          <StatusBadge tone="slate">{`命中 ${filteredTasks.length} 条`}</StatusBadge>
          <StatusBadge tone="emerald">{`${runningCount} 个占用资源`}</StatusBadge>
          <StatusBadge tone="amber">{`${waitingCount} 个等待调度`}</StatusBadge>
          <StatusBadge tone="rose">{`${preemptCount} 个抢占结果`}</StatusBadge>
        </div>
        <div className="allocation-summary compact">
          <KeyValue label="可演示能力" value="任务优先级提升" />
          <KeyValue label="抢占规则" value="仅回收更低优先级且允许被抢占的任务" />
          <KeyValue label="保护规则" value="preemptPolicy=Never 的任务不会被抢占" />
          <KeyValue label="适用场景" value="任务优先级、抢占、保护策略" />
        </div>
      </section>

      <section className="surface-panel">
        <SectionHeader
          eyebrow="TASK LIST"
          title="任务执行队列"
          description="按队列、优先级和抢占策略查看任务当前状态，并直接在列表里执行优先级调整和抢占操作。"
        />
        <div className="task-toolbar">
          <label className="field">
            <span>搜索任务</span>
            <input
              value={searchKeyword}
              placeholder="按任务名、ID、所属、队列或优先级搜索"
              onChange={(event) => setSearchKeyword(event.target.value)}
            />
          </label>
          <div className="task-toolbar-summary">
            <Button
              variant="secondary"
              icon={Plus}
              onClick={() => {
                resetCreateDraft();
                setIsCreateOpen(true);
              }}
            >
              创建任务
            </Button>
            <StatusBadge tone="amber">{`第 ${currentPage} / ${totalPages} 页`}</StatusBadge>
          </div>
        </div>
        <DataTable
          columns={["任务", "类型 / 所属", "队列 / 优先级", "资源规格", "当前状态", "抢占策略", "操作"]}
          rows={pagedTasks.map((task) => [
            <div key={`${task.id}-name`} className="task-job-cell">
              <strong>{task.name}</strong>
              <span>{task.id}</span>
            </div>,
            <div key={`${task.id}-type`} className="task-job-cell">
              <strong>{task.type}</strong>
              <span>{task.framework ? `${task.framework} ${task.frameworkVersion ?? ""} · ${task.dataset ?? task.owner}` : task.owner}</span>
            </div>,
            <div key={`${task.id}-queue`} className="task-job-cell">
              <strong>{task.queue}</strong>
              <span>{task.priority}</span>
            </div>,
            task.resource,
            <div key={`${task.id}-status`} className="task-job-cell">
              <StatusBadge
                tone={
                  task.status.includes("保护")
                    ? "emerald"
                    : task.status.includes("抢占")
                      ? "rose"
                      : task.status.includes("等待") || task.status.includes("排队")
                        ? "amber"
                        : "blue"
                }
              >
                {task.status}
              </StatusBadge>
              <small>{task.decision}</small>
            </div>,
              task.preempt,
              <div key={`${task.id}-actions`} className="table-action-stack">
                <button className="inline-action" onClick={() => setPendingAction({ type: "elevate", taskId: task.id })} disabled={task.priority === "P0"}>
                  提升优先级
                </button>
                <button className="inline-action" onClick={() => setPendingAction({ type: "preempt", taskId: task.id })} disabled={task.preempt === "Never"}>
                  触发抢占
                </button>
              </div>,
            ])}
          />
        <div className="pagination-row">
          <Button variant="ghost" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
            上一页
          </Button>
          <div className="pagination-indicator">
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index + 1} className={currentPage === index + 1 ? "active" : ""} onClick={() => setPage(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
          <Button variant="ghost" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
            下一页
          </Button>
        </div>
      </section>

      {isCreateOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsCreateOpen(false)}>
          <section className="modal-panel dev-create-modal" role="dialog" aria-modal="true" aria-labelledby="task-create-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">CREATE TASK</span>
                <h3 id="task-create-title">创建任务</h3>
                <p>第一步选择平台预置 AI 主流框架、版本和 SKU；第二步选择使用数据集，并在高级功能里配置数据预热。</p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={() => setIsCreateOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <StepRail steps={["选择框架", "使用数据集与高级功能"]} active={createStep} />

            {createStep === 1 ? (
              <>
                <div className="form-grid two">
                  <label className="field">
                    <span>任务名称</span>
                    <input value={createDraft.taskName} onChange={(event) => setCreateDraft((current) => ({ ...current, taskName: event.target.value }))} />
                  </label>
                  <label className="field">
                    <span>AI 框架</span>
                    <select
                      value={createDraft.frameworkId}
                      onChange={(event) => {
                        const nextFramework = frameworkPresets.find((item) => item.id === event.target.value) ?? frameworkPresets[0];
                        setCreateDraft((current) => ({
                          ...current,
                          frameworkId: nextFramework.id,
                          version: nextFramework.versions[0],
                          sku: nextFramework.skus[0],
                        }));
                      }}
                    >
                      {frameworkPresets.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>框架版本</span>
                    <select value={createDraft.version} onChange={(event) => setCreateDraft((current) => ({ ...current, version: event.target.value }))}>
                      {selectedFramework.versions.map((version) => (
                        <option key={version} value={version}>
                          {version}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>SKU</span>
                    <select value={createDraft.sku} onChange={(event) => setCreateDraft((current) => ({ ...current, sku: event.target.value }))}>
                      {selectedFramework.skus.map((sku) => (
                        <option key={sku} value={sku}>
                          {sku}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="field readonly-field">
                    <span>框架说明</span>
                    <strong>{selectedFramework.summary}</strong>
                  </div>
                </div>
                <div className="allocation-summary compact">
                  <KeyValue label="预置框架" value={selectedFramework.name} />
                  <KeyValue label="版本" value={createDraft.version} />
                  <KeyValue label="任务类型" value={selectedFramework.type} />
                  <KeyValue label="默认队列" value={selectedFramework.queue} />
                  <KeyValue label="默认优先级" value={selectedFramework.priority} />
                  <KeyValue label="目标 SKU" value={createDraft.sku} />
                </div>
              </>
            ) : (
              <>
                <div className="field">
                  <span>使用数据集（可多选）</span>
                  <div className="ft-dataset-grid">
                    {taskDatasetOptions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`ft-dataset-chip ${createDraft.datasetIds.includes(item.id) ? "is-active" : ""}`}
                        onClick={() => toggleTaskDataset(item.id)}
                      >
                        <strong>{item.name}</strong>
                        <span>{item.modality}</span>
                        <small>{`${item.sampleCount} / ${item.storage}`}</small>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="allocation-summary compact">
                  <KeyValue label="当前框架" value={`${selectedFramework.name} ${createDraft.version}`} />
                  <KeyValue label="已选数据集" value={selectedTaskDatasetLabel} />
                  <KeyValue label="目标 SKU" value={createDraft.sku} />
                  <KeyValue label="高级能力" value={createDraft.enablePreheat ? "已启用数据预热" : "未启用数据预热"} />
                </div>
                <section className="surface-panel">
                  <SectionHeader
                    eyebrow="ADVANCED"
                    title="高级功能"
                    description="支持将指定模型与所选数据集预加载到计算节点本地 NVMe 缓存，减少训练任务载入时间。"
                  />
                  <div className="form-grid two">
                    <label className="field">
                      <span>数据预热</span>
                      <select
                        value={createDraft.enablePreheat ? "启用" : "关闭"}
                        onChange={(event) =>
                          setCreateDraft((current) => ({
                            ...current,
                            enablePreheat: event.target.value === "启用",
                          }))
                        }
                      >
                        <option>关闭</option>
                        <option>启用</option>
                      </select>
                    </label>
                    <div className="field readonly-field">
                      <span>缓存目标</span>
                      <strong>计算节点本地 NVMe 缓存</strong>
                    </div>
                    {createDraft.enablePreheat ? (
                      <>
                        <label className="field">
                          <span>预热对象</span>
                          <select value={createDraft.preheatScope} onChange={(event) => setCreateDraft((current) => ({ ...current, preheatScope: event.target.value }))}>
                            <option>模型+数据集</option>
                            <option>仅数据集</option>
                            <option>仅模型</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>触发时机</span>
                          <select value={createDraft.preheatTrigger} onChange={(event) => setCreateDraft((current) => ({ ...current, preheatTrigger: event.target.value }))}>
                            <option>调度命中节点后预热</option>
                            <option>任务提交后立即预热</option>
                            <option>创建任务后手动触发</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>缓存保留策略</span>
                          <select value={createDraft.preheatRetention} onChange={(event) => setCreateDraft((current) => ({ ...current, preheatRetention: event.target.value }))}>
                            <option>任务结束后释放</option>
                            <option>保留 12 小时</option>
                            <option>保留 24 小时</option>
                          </select>
                        </label>
                        <div className="field readonly-field">
                          <span>预热内容</span>
                          <strong>{`${selectedFramework.name} ${createDraft.version} + ${selectedTaskDatasetLabel}`}</strong>
                        </div>
                      </>
                    ) : null}
                  </div>
                  {createDraft.enablePreheat ? (
                    <div className="allocation-summary compact">
                      <KeyValue label="预热对象" value={createDraft.preheatScope} />
                      <KeyValue label="缓存节点" value="训练节点本地 NVMe" />
                      <KeyValue label="触发方式" value={createDraft.preheatTrigger} />
                      <KeyValue label="保留策略" value={createDraft.preheatRetention} />
                      <KeyValue label="预期收益" value="缩短镜像启动与数据载入时间" />
                      <KeyValue label="覆盖内容" value={`${selectedFramework.name} ${createDraft.version} + 所选数据集`} />
                    </div>
                  ) : null}
                </section>
              </>
            )}
            <div className="modal-actions">
              {createStep === 1 ? (
                <>
                  <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                    取消
                  </Button>
                  <Button variant="secondary" onClick={() => setCreateStep(2)} disabled={!createDraft.taskName.trim()}>
                    进入第二步
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => setCreateStep(1)}>
                    返回上一步
                  </Button>
                  <Button variant="secondary" icon={Plus} onClick={createTask} disabled={!createDraft.taskName.trim() || createDraft.datasetIds.length === 0}>
                    创建任务
                  </Button>
                </>
              )}
            </div>
          </section>
        </div>
      ) : null}

      {pendingAction && selectedTask ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setPendingAction(null)}>
          <section className="modal-panel password-dialog" role="dialog" aria-modal="true" aria-labelledby="task-confirm-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">TASK CONFIRM</span>
                <h3 id="task-confirm-title">{pendingAction.type === "elevate" ? "确认提升优先级" : "确认触发抢占"}</h3>
                <p>
                  {pendingAction.type === "elevate"
                    ? "确认后将修改任务优先级，并让它重新进入更高等级的调度窗口。"
                    : "确认后将尝试回收更低优先级且允许被抢占的运行任务资源。"}
                </p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={() => setPendingAction(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="allocation-summary compact">
              <KeyValue label="目标任务" value={selectedTask.name} />
              <KeyValue label="当前优先级" value={selectedTask.priority} />
              <KeyValue label="所在队列" value={selectedTask.queue} />
              <KeyValue label="抢占策略" value={selectedTask.preempt} />
              <KeyValue
                label={pendingAction.type === "elevate" ? "提升后优先级" : "预计 victim"}
                value={pendingAction.type === "elevate" ? nextPriority ?? selectedTask.priority : preemptVictim?.name ?? "未找到可抢占任务"}
              />
              <KeyValue
                label="执行预期"
                value={
                  pendingAction.type === "elevate"
                    ? nextPriority === selectedTask.priority
                      ? "当前已是最高优先级"
                      : `任务将提升到 ${nextPriority} 并重新进入调度窗口`
                    : preemptVictim
                      ? `将回收 ${preemptVictim.name} 的资源`
                      : "本次操作可能不会产生抢占结果"
                }
              />
            </div>
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setPendingAction(null)}>
                取消
              </Button>
              <Button variant="secondary" icon={pendingAction.type === "elevate" ? Plus : AlertTriangle} onClick={confirmAction}>
                确认执行
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </ModuleScaffold>
  );
}

function AppSpacePage({ addAudit }: { addAudit: (event: Omit<AuditEvent, "id" | "time">) => void }) {
  const [spaces, setSpaces] = useState<AppSpace[]>([
    {
      id: "app-001",
      name: "质检助手应用空间",
      repo: "git.example.local/ai/quality-assistant.git",
      branch: "release/demo",
      sdk: "Gradio",
      runtime: "Python 3.11 + CUDA 12.4",
      status: "运行中",
      endpoint: "quality-assistant.space.local",
      owner: "制造算法组",
      visibility: "租户可见",
      buildNumber: 27,
      region: "Mianyang-SpacePool-01",
      commitSha: "c8f4a21",
      commitMessage: "feat: add batch image inspection workflow",
      publishedVersion: "v2.4.1",
      likes: 284,
      visits: 12842,
      published: true,
      buildLogs: [
        "[git] Cloning quality-assistant.git#release/demo",
        "[build] Installing dependencies from requirements.txt",
        "[deploy] Running health probe /healthz",
        "[done] Build and deployment completed successfully",
      ],
      runtimeLogs: [
        "2026-04-24 15:18:11 [info] Gradio app boot completed on port 7860",
        "2026-04-24 15:19:04 [info] P95 latency 184 ms, GPU utilization 71%",
        "2026-04-24 15:21:46 [info] Session #1039 exported inspection report",
      ],
    },
    {
      id: "app-002",
      name: "政务问答工作台",
      repo: "git.example.local/llm/gov-assistant.git",
      branch: "main",
      sdk: "Streamlit",
      runtime: "Python 3.11 + CPU Runtime",
      status: "已停止",
      endpoint: "gov-assistant.space.local",
      owner: "政务模型组",
      visibility: "团队共享",
      buildNumber: 13,
      region: "Mianyang-SpacePool-02",
      commitSha: "9af3d18",
      commitMessage: "fix: update prompt templates and safety guard",
      publishedVersion: "v1.8.0",
      likes: 129,
      visits: 6230,
      published: true,
      buildLogs: [
        "[git] Detected push on main",
        "[build] streamlit runtime bundle generated",
        "[publish] Waiting for manual publish action",
      ],
      runtimeLogs: [
        "2026-04-24 11:32:08 [warn] Stop action received from operator console",
        "2026-04-24 11:32:09 [info] Workers drained and ingress switched offline",
      ],
    },
  ]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeSpaceId, setActiveSpaceId] = useState<string>("app-001");
  const [logView, setLogView] = useState<"build" | "runtime">("build");
  const [liveSpaceId, setLiveSpaceId] = useState<string | null>(null);
  const [logSpaceId, setLogSpaceId] = useState<string | null>(null);
  const [deployDetailId, setDeployDetailId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    name: "新的工业应用空间",
    repo: "git.example.local/new/image-inspector.git",
    branch: "main",
    sdk: "Gradio",
    runtime: "Python 3.11 + CUDA 12.4",
  });

  const repoFiles = [
    { name: "app.py", note: "Space 入口，负责表单、上传与推理调用" },
    { name: "requirements.txt", note: "声明 SDK、推理框架和依赖版本" },
    { name: "sdk_config.json", note: "运行时、硬件规格和暴露端口" },
    { name: "pipelines/infer.py", note: "推理编排与结果后处理" },
    { name: "README.md", note: "应用介绍、示例输入和发布说明" },
  ];

  const activeSpace = spaces.find((item) => item.id === activeSpaceId) ?? spaces[0];
  const liveSpace = spaces.find((item) => item.id === liveSpaceId) ?? null;
  const logSpace = spaces.find((item) => item.id === logSpaceId) ?? null;
  const deploySpace = spaces.find((item) => item.id === deployDetailId) ?? null;

  const patchSpace = (id: string, updater: (space: AppSpace) => AppSpace) => {
    setSpaces((current) => current.map((item) => (item.id === id ? updater(item) : item)));
  };

  const triggerDeploy = (id: string, source: "create" | "redeploy" | "deploy") => {
    setActiveSpaceId(id);
    setLogSpaceId(id);
    setLogView("build");
    patchSpace(id, (space) => ({
      ...space,
      status: "构建中",
      published: false,
      buildNumber: space.buildNumber + 1,
      commitSha: source === "create" ? "a41fd20" : source === "redeploy" ? "f2a91de" : "d7e11aa",
      commitMessage:
        source === "create"
          ? "feat: initial commit for new app space"
          : source === "redeploy"
            ? "feat: republish with latest demo assets"
            : "feat: deploy latest repository revision",
      buildLogs: [
        `[git] Cloning ${source === "create" ? "newly created repository" : "repository"} and syncing latest commit`,
        "[build] Reading sdk_config.json and runtime profile",
        "[build] Installing dependencies and preparing cache",
      ],
      runtimeLogs: [
        `2026-04-24 15:26:08 [system] Deploy request queued from ${source}`,
        ...space.runtimeLogs,
      ],
    }));
    addAudit({ actor: "应用构建器", action: source === "create" ? "创建应用后自动触发部署" : "触发应用自动部署", target: id, result: "处理中" });

    window.setTimeout(() => {
      patchSpace(id, (space) => ({
        ...space,
        status: "部署中",
        buildLogs: [
          ...space.buildLogs,
          "[build] Runtime image built successfully",
          "[deploy] Scheduling space runtime and warming containers",
        ],
      }));
    }, 900);

    window.setTimeout(() => {
      patchSpace(id, (space) => ({
        ...space,
        status: "运行中",
        publishedVersion: space.publishedVersion.startsWith("v") ? space.publishedVersion : "v1.0.0",
        visits: space.visits + 126,
        likes: space.likes + 3,
        buildLogs: [
          ...space.buildLogs,
          `[publish] Runtime ready at https://${space.endpoint}`,
          "[done] Build and deployment completed successfully",
        ],
        runtimeLogs: [
          "2026-04-24 15:26:18 [info] Runtime health check passed and app opened to internal traffic",
          "2026-04-24 15:26:27 [info] Demo sample dataset mounted successfully",
          ...space.runtimeLogs,
        ],
      }));
      addAudit({ actor: "应用空间", action: "自动构建并部署完成", target: id, result: "成功" });
    }, 1800);
  };

  const publishSpace = (id: string) => {
    patchSpace(id, (space) => ({
      ...space,
      published: true,
      runtimeLogs: [
        "2026-04-24 15:29:10 [info] Publish action completed, public access enabled",
        ...space.runtimeLogs,
      ],
    }));
    addAudit({ actor: "应用空间", action: "发布应用访问入口", target: id, result: "成功" });
  };

  const stopSpace = (id: string) => {
    patchSpace(id, (space) => ({
      ...space,
      status: "已停止",
      runtimeLogs: [
        "2026-04-24 15:32:06 [warn] Stop action received from operator console",
        "2026-04-24 15:32:07 [info] Space workers drained and ingress switched offline",
        ...space.runtimeLogs,
      ],
    }));
    addAudit({ actor: "应用空间", action: "停止应用实例", target: id, result: "成功" });
  };

  const createSpace = () => {
    const newId = `app-${Date.now()}`;
    const next: AppSpace = {
      id: newId,
      name: draft.name,
      repo: draft.repo,
      branch: draft.branch,
      sdk: draft.sdk,
      runtime: draft.runtime,
      status: "草稿",
      endpoint: `${draft.name.toLowerCase().replace(/\s+/g, "-")}.space.local`,
      owner: "新建应用组",
      visibility: "租户可见",
      buildNumber: 1,
      region: "Mianyang-SpacePool-03",
      commitSha: "init000",
      commitMessage: "init: create app space repository",
      publishedVersion: "v1.0.0",
      likes: 0,
      visits: 0,
      published: false,
      buildLogs: ["[repo] Waiting for first save and deploy"],
      runtimeLogs: ["2026-04-24 15:24:01 [system] App space created, awaiting first deployment"],
    };
    setSpaces((current) => [next, ...current]);
    setActiveSpaceId(newId);
    setIsCreateOpen(false);
    triggerDeploy(newId, "create");
  };

  const workflowSteps = (space: AppSpace) => [
    { label: "源码", state: "done" },
    { label: "构建", state: space.status === "草稿" ? "todo" : space.status === "构建中" ? "active" : "done" },
    { label: "部署", state: space.status === "部署中" ? "active" : space.status === "运行中" || space.status === "已停止" ? "done" : "todo" },
    { label: "发布", state: space.published ? "done" : space.status === "运行中" ? "active" : "todo" },
    { label: "访问", state: space.published ? "done" : "todo" },
  ] as const;

  const statusToneFor = (space: AppSpace): Tone =>
    space.status === "运行中"
      ? "emerald"
      : space.status === "构建中" || space.status === "部署中"
        ? "blue"
        : space.status === "已停止"
          ? "rose"
          : "slate";

  return (
    <ModuleScaffold scenarioKey="space">
      <div className="page-grid">
        <section className="surface-panel">
          <div className="space-list-head">
            <SectionHeader eyebrow="APP SPACE LIST" title="应用空间列表" description="创建应用后弹出仓库配置，保存即开始自动部署；发布后才开放访问入口。" />
            <Button icon={Plus} onClick={() => setIsCreateOpen(true)}>
              创建应用
            </Button>
          </div>

          <div className="space-list">
            {spaces.map((space) => (
              <article
                key={space.id}
                className={`space-list-item ${activeSpaceId === space.id ? "selected" : ""}`}
                onClick={() => setActiveSpaceId(space.id)}
              >
                <div className="space-list-main">
                  <div className="space-list-title">
                    <div>
                      <strong>{space.name}</strong>
                      <small>{space.repo} · {space.branch} · {space.sdk}</small>
                    </div>
                    <StatusBadge tone={statusToneFor(space)} animated={space.status === "构建中" || space.status === "部署中"}>
                      {space.status}
                    </StatusBadge>
                  </div>
                  <div className="space-dot-flow">
                    {workflowSteps(space).map((step, index) => (
                      <div key={step.label} className={`space-dot-step is-${step.state}`}>
                        <span className="space-dot" />
                        <small>{step.label}</small>
                        {index < workflowSteps(space).length - 1 ? <i className="space-dot-line" /> : null}
                      </div>
                    ))}
                  </div>
                  <div className="space-list-meta">
                    <span>版本 {space.publishedVersion}</span>
                    <span>Build #{space.buildNumber}</span>
                    <span>{space.published ? "已发布访问入口" : "待发布访问入口"}</span>
                    <span>{space.endpoint}</span>
                  </div>
                </div>
                <div className="space-list-actions">
                  <Button variant="secondary" icon={Rocket} onClick={() => triggerDeploy(space.id, "deploy")} disabled={space.status === "构建中" || space.status === "部署中"}>
                    部署
                  </Button>
                  <Button variant="secondary" icon={StopCircle} onClick={() => stopSpace(space.id)} disabled={space.status !== "运行中"}>
                    停止
                  </Button>
                  <Button variant="secondary" icon={RefreshCcw} onClick={() => triggerDeploy(space.id, "redeploy")} disabled={space.status === "构建中" || space.status === "部署中"}>
                    重新发布
                  </Button>
                  <Button variant="secondary" icon={Share2} onClick={() => publishSpace(space.id)} disabled={space.status !== "运行中" || space.published}>
                    发布
                  </Button>
                  <Button variant="secondary" icon={Globe} onClick={() => setLiveSpaceId(space.id)} disabled={!space.published}>
                    访问
                  </Button>
                  <Button variant="secondary" icon={Terminal} onClick={() => { setLogSpaceId(space.id); setLogView("build"); }}>
                    日志
                  </Button>
                  <Button variant="secondary" icon={FileText} onClick={() => setDeployDetailId(space.id)}>
                    部署日志
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {isCreateOpen ? (
          <div className="modal-backdrop" role="presentation" onClick={() => setIsCreateOpen(false)}>
            <section className="modal-panel dev-create-modal" role="dialog" aria-modal="true" aria-labelledby="space-repository-title" onClick={(event) => event.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="eyebrow">SPACE REPOSITORY</span>
                  <h3 id="space-repository-title">创建应用空间</h3>
                  <p>填写仓库配置后点击保存，系统将自动开始构建和部署。</p>
                </div>
                <button className="icon-button" aria-label="关闭窗口" onClick={() => setIsCreateOpen(false)}>
                  <X size={16} />
                </button>
              </div>
              <div className="form-grid two">
                <label className="field">
                  <span>应用名称</span>
                  <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
                </label>
                <label className="field">
                  <span>Git 仓库</span>
                  <input value={draft.repo} onChange={(event) => setDraft((current) => ({ ...current, repo: event.target.value }))} />
                </label>
                <label className="field">
                  <span>分支</span>
                  <input value={draft.branch} onChange={(event) => setDraft((current) => ({ ...current, branch: event.target.value }))} />
                </label>
                <label className="field">
                  <span>SDK</span>
                  <select value={draft.sdk} onChange={(event) => setDraft((current) => ({ ...current, sdk: event.target.value }))}>
                    <option>Gradio</option>
                    <option>Streamlit</option>
                    <option>Static</option>
                    <option>Docker</option>
                  </select>
                </label>
                <label className="field">
                  <span>Runtime</span>
                  <input value={draft.runtime} onChange={(event) => setDraft((current) => ({ ...current, runtime: event.target.value }))} />
                </label>
              </div>
              <div className="modal-actions">
                <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                  取消
                </Button>
                <Button icon={Rocket} onClick={createSpace}>
                  保存并部署
                </Button>
              </div>
            </section>
          </div>
        ) : null}

        {liveSpace ? (
          <div className="modal-backdrop" role="presentation" onClick={() => setLiveSpaceId(null)}>
            <section className="modal-panel terminal-window-modal" role="dialog" aria-modal="true" aria-labelledby="live-space-title" onClick={(event) => event.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="eyebrow">LIVE SPACE</span>
                  <h3 id="live-space-title">{liveSpace.name}</h3>
                  <p>已发布应用可通过访问按钮打开，展示实际可交互的应用界面。</p>
                </div>
                <button className="icon-button" aria-label="关闭窗口" onClick={() => setLiveSpaceId(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="preview-window space-preview-window">
                <div className="preview-toolbar">
                  <Globe size={16} />
                  <span>{liveSpace.endpoint}</span>
                  <StatusBadge tone="emerald">Open</StatusBadge>
                </div>
                <div className="space-app-preview">
                  <div className="space-app-header">
                    <div>
                      <strong>{liveSpace.name}</strong>
                      <small>{liveSpace.sdk} 应用界面，支持上传、推理与结果展示。</small>
                    </div>
                    <Button variant="secondary" icon={Globe}>
                      已开放访问
                    </Button>
                  </div>
                  <div className="space-app-body">
                    <div className="space-app-panel">
                      <span>输入区</span>
                      <strong>上传待检图片</strong>
                      <small>支持批量上传并自动生成批次编号。</small>
                      <div className="space-upload-box">
                        <UploadCloud size={18} />
                        <span>拖拽或点击上传工业相机图片</span>
                      </div>
                    </div>
                    <div className="space-app-panel">
                      <span>输出区</span>
                      <strong>批量质检结果</strong>
                      <div className="space-result-list">
                        <div>
                          <strong>IMG_2048.png</strong>
                          <small>裂纹缺陷，置信度 98.2%</small>
                        </div>
                        <div>
                          <strong>IMG_2051.png</strong>
                          <small>表面污点，置信度 93.7%</small>
                        </div>
                        <div>
                          <strong>IMG_2059.png</strong>
                          <small>通过，未发现异常</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : null}

        {logSpace ? (
          <div className="modal-backdrop" role="presentation" onClick={() => setLogSpaceId(null)}>
            <section className="modal-panel terminal-window-modal" role="dialog" aria-modal="true" aria-labelledby="space-log-title" onClick={(event) => event.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="eyebrow">BUILD & RUNTIME LOGS</span>
                  <h3 id="space-log-title">{logSpace.name}</h3>
                  <p>支持在构建日志和运行日志之间切换查看。</p>
                </div>
                <button className="icon-button" aria-label="关闭窗口" onClick={() => setLogSpaceId(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="segmented compact">
                <button className={logView === "build" ? "active" : ""} onClick={() => setLogView("build")}>
                  构建日志
                </button>
                <button className={logView === "runtime" ? "active" : ""} onClick={() => setLogView("runtime")}>
                  运行日志
                </button>
              </div>
              <LogPanel title={logView === "build" ? `Build #${logSpace.buildNumber}` : "Runtime Tail - app.log"} lines={logView === "build" ? logSpace.buildLogs : logSpace.runtimeLogs} />
            </section>
          </div>
        ) : null}

        {deploySpace ? (
          <div className="modal-backdrop" role="presentation" onClick={() => setDeployDetailId(null)}>
            <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="deploy-detail-title" onClick={(event) => event.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="eyebrow">DEPLOY DETAIL</span>
                  <h3 id="deploy-detail-title">{deploySpace.name}</h3>
                  <p>展示当前应用的部署信息、发布版本和健康检查状态。</p>
                </div>
                <button className="icon-button" aria-label="关闭窗口" onClick={() => setDeployDetailId(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="space-detail-card">
                <div className="space-subtitle">
                  <FileText size={16} />
                  <span>部署详情</span>
                </div>
                <strong>{deploySpace.commitMessage}</strong>
                <p>{deploySpace.commitSha} · Build #{deploySpace.buildNumber} · {deploySpace.region}</p>
                <div className="space-detail-grid">
                  <KeyValue label="触发方式" value="save -> auto deploy" />
                  <KeyValue label="运行时" value={deploySpace.runtime} />
                  <KeyValue label="健康检查" value={deploySpace.status === "运行中" ? "HTTP 200 /ready" : "runtime stopped"} />
                  <KeyValue label="发布版本" value={deploySpace.publishedVersion} />
                </div>
              </div>
              <StepRail steps={["创建仓库", "保存提交", "自动部署", "发布入口", "访问应用"]} active={deploySpace.published ? 4 : deploySpace.status === "运行中" ? 3 : deploySpace.status === "部署中" ? 2 : deploySpace.status === "构建中" ? 1 : 0} />
            </section>
          </div>
        ) : null}
      </div>
    </ModuleScaffold>
  );
}

function CloudNativePage({ addAudit }: { addAudit: (event: Omit<AuditEvent, "id" | "time">) => void }) {
  const createDraft = (catalogItem: CloudNativeCatalogItem): CloudNativeApp => ({
    id: `cn-${Date.now()}`,
    name: catalogItem.name,
    image: catalogItem.image,
    replicas: catalogItem.replicas,
    resource: catalogItem.resource,
    ingress: catalogItem.ingress,
    storage: catalogItem.storage,
    autoscaling: catalogItem.autoscaling,
    source: catalogItem.name,
    status: "草稿",
    updatedAt: nowTime(),
  });

  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isWorkloadOpen, setIsWorkloadOpen] = useState(false);
  const [draftApp, setDraftApp] = useState<CloudNativeApp>(() => createDraft(cloudNativeCatalog[1]));
  const [apps, setApps] = useState<CloudNativeApp[]>([]);
  const timersRef = useRef<number[]>([]);

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const syncApp = (next: CloudNativeApp) => {
    setDraftApp(next);
    setApps((items) => {
      const exists = items.some((item) => item.id === next.id);
      if (!exists) return [next, ...items];
      return items.map((item) => (item.id === next.id ? next : item));
    });
  };

  const schedule = (task: () => void, delay: number) => {
    const timer = window.setTimeout(task, delay);
    timersRef.current.push(timer);
  };

  const applyStatus = (status: CloudNativeApp["status"], overrides: Partial<CloudNativeApp> = {}) => {
    syncApp({ ...draftApp, ...overrides, status, updatedAt: nowTime() });
  };

  const selectCatalog = (catalogItem: CloudNativeCatalogItem) => {
    setDraftApp(createDraft(catalogItem));
    setIsStoreOpen(false);
    setIsWorkloadOpen(true);
    addAudit({ actor: "应用商店", action: "创建应用草稿", target: catalogItem.name, result: "成功" });
  };

  const deploy = () => {
    const queuedApp = { ...draftApp, status: "任务下发中" as const, updatedAt: nowTime() };
    syncApp(queuedApp);
    setIsWorkloadOpen(false);
    addAudit({ actor: "云原生控制器", action: "下发 Kubernetes 工作负载任务", target: draftApp.name, result: "处理中" });
    schedule(() => {
      setDraftApp((current) => {
        const next = { ...current, status: "部署中" as const, updatedAt: nowTime() };
        setApps((items) => items.map((item) => (item.id === next.id ? next : item)));
        return next;
      });
    }, 1800);
    schedule(() => {
      setDraftApp((current) => {
        const next = { ...current, status: "运行中" as const, updatedAt: nowTime() };
        setApps((items) => items.map((item) => (item.id === next.id ? next : item)));
        return next;
      });
      addAudit({ actor: "云原生控制器", action: "应用实例部署完成", target: draftApp.name, result: "成功" });
    }, 5200);
  };

  const manageApp = (app: CloudNativeApp) => {
    setDraftApp(app);
    setIsWorkloadOpen(true);
  };

  const updateAppStatus = (appId: string, status: CloudNativeApp["status"], overrides: Partial<CloudNativeApp> = {}) => {
    setApps((items) =>
      items.map((item) => (item.id === appId ? { ...item, ...overrides, status, updatedAt: nowTime() } : item)),
    );
    setDraftApp((current) => (current.id === appId ? { ...current, ...overrides, status, updatedAt: nowTime() } : current));
  };

  const operateApp = (item: CloudNativeApp, action: "start" | "stop" | "restart" | "scaleUp" | "scaleDown") => {
    if (action === "stop") {
      updateAppStatus(item.id, "已停止");
      addAudit({ actor: "运维管理员", action: "停止应用实例", target: item.name, result: "成功" });
      return;
    }

    if (action === "restart") {
      updateAppStatus(item.id, "部署中");
      addAudit({ actor: "运维管理员", action: "重启应用实例", target: item.name, result: "处理中" });
      schedule(() => updateAppStatus(item.id, "运行中"), 2600);
      return;
    }

    if (action === "start") {
      updateAppStatus(item.id, "任务下发中");
      addAudit({ actor: "运维管理员", action: "启动应用实例", target: item.name, result: "处理中" });
      schedule(() => updateAppStatus(item.id, "运行中"), 3200);
      return;
    }

    const nextReplicas = Math.max(1, item.replicas + (action === "scaleUp" ? 1 : -1));
    updateAppStatus(item.id, "扩缩容中", { replicas: nextReplicas });
    addAudit({
      actor: "弹性伸缩器",
      action: action === "scaleUp" ? "扩容应用实例" : "缩容应用实例",
      target: item.name,
      result: "处理中",
    });
    schedule(() => updateAppStatus(item.id, "运行中", { replicas: nextReplicas }), 2200);
  };

  const runningCount = apps.filter((item) => item.status === "运行中").length;
  const pendingCount = apps.filter((item) => item.status === "任务下发中" || item.status === "部署中" || item.status === "扩缩容中").length;
  const stoppedCount = apps.filter((item) => item.status === "已停止").length;
  const totalReplicas = apps.reduce((sum, item) => sum + item.replicas, 0);

  return (
    <ModuleScaffold scenarioKey="cloud">
      <div className="cloud-toolbar">
        <Button variant="secondary" icon={AppWindow} onClick={() => setIsStoreOpen(true)}>
          应用商店
        </Button>
      </div>
      <div className="page-grid">
        <section className="surface-panel">
          <SectionHeader eyebrow="APPLICATION LIST" title="已创建应用" description="部署后在这里显示应用状态、规格、网络入口、存储和弹性伸缩配置。" />
          <div className="cloud-workflow-strip">
            <SecurityNode icon={CheckCircle2} label="运行中" value={`${runningCount} 个`} tone="emerald" />
            <SecurityNode icon={Workflow} label="处理中" value={`${pendingCount} 个`} tone="blue" />
            <SecurityNode icon={Archive} label="已停止" value={`${stoppedCount} 个`} tone="slate" />
            <SecurityNode icon={Boxes} label="总副本数" value={`${totalReplicas} replicas`} tone="amber" />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>应用</th>
                  <th>规格</th>
                  <th>Ingress</th>
                  <th>磁盘</th>
                  <th>弹性伸缩</th>
                  <th>部署状态</th>
                  <th>更新时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {apps.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <div className="cloud-empty-row">点击上方“应用商店”并完成部署后，应用实例会出现在这里。</div>
                    </td>
                  </tr>
                ) : (
                  apps.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="cloud-app-cell">
                          <strong>{item.name}</strong>
                          <span>{item.image}</span>
                        </div>
                      </td>
                      <td>{item.resource}</td>
                      <td>{item.ingress}</td>
                      <td>{item.storage}</td>
                      <td>{`${item.autoscaling} · 当前 ${item.replicas}`}</td>
                      <td>
                        <StatusBadge tone={cloudStatusTone(item.status)} animated={item.status === "任务下发中" || item.status === "部署中" || item.status === "扩缩容中"}>
                          {item.status}
                        </StatusBadge>
                      </td>
                      <td>{item.updatedAt}</td>
                      <td>
                        <div className="table-action-stack cloud-instance-actions">
                          <button className="inline-action" onClick={() => manageApp(item)}>
                            配置
                          </button>
                          <button className="inline-action" onClick={() => operateApp(item, "start")} disabled={item.status !== "已停止"}>
                            启动
                          </button>
                          <button className="inline-action" onClick={() => operateApp(item, "stop")} disabled={item.status !== "运行中"}>
                            停止
                          </button>
                          <button className="inline-action" onClick={() => operateApp(item, "restart")} disabled={item.status !== "运行中"}>
                            重启
                          </button>
                          <button className="inline-action" onClick={() => operateApp(item, "scaleUp")} disabled={item.status !== "运行中"}>
                            扩容
                          </button>
                          <button className="inline-action" onClick={() => operateApp(item, "scaleDown")} disabled={item.status !== "运行中" || item.replicas <= 1}>
                            缩容
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {isStoreOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsStoreOpen(false)}>
          <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="cloud-store-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">APP STORE</span>
                <h3 id="cloud-store-title">应用商店</h3>
                <p>选择常见应用模板后进入 Kubernetes 工作负载配置窗口。</p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={() => setIsStoreOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="cloud-store-grid">
              {cloudNativeCatalog.map((item) => (
                <article key={item.id} className="cloud-store-card">
                  <div className="cloud-store-card-top">
                    <div className="metric-icon">
                      <AppWindow size={18} />
                    </div>
                  </div>
                  <div className="cloud-store-card-body">
                    <h4>{item.name}</h4>
                    <p>{item.summary}</p>
                  </div>
                  <div className="cloud-store-tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="cloud-store-meta">
                    <KeyValue label="默认规格" value={item.resource} />
                    <KeyValue label="弹性伸缩" value={item.autoscaling} />
                  </div>
                  <Button icon={Rocket} onClick={() => selectCatalog(item)}>
                    创建应用
                  </Button>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}
      {isWorkloadOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsWorkloadOpen(false)}>
          <section className="modal-panel dev-create-modal" role="dialog" aria-modal="true" aria-labelledby="cloud-workload-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">KUBERNETES WORKLOAD</span>
                <h3 id="cloud-workload-title">{draftApp.name}</h3>
                <p>配置容器参数后点击部署，任务会直接下发并同步到 APPLICATION LIST。</p>
              </div>
              <button className="icon-button" aria-label="关闭窗口" onClick={() => setIsWorkloadOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="form-grid two">
              <label className="field">
                <span>应用名称</span>
                <input value={draftApp.name} onChange={(event) => setDraftApp((current) => ({ ...current, name: event.target.value }))} />
              </label>
              <label className="field">
                <span>容器镜像</span>
                <input value={draftApp.image} onChange={(event) => setDraftApp((current) => ({ ...current, image: event.target.value }))} />
              </label>
              <label className="field">
                <span>Ingress</span>
                <input value={draftApp.ingress} onChange={(event) => setDraftApp((current) => ({ ...current, ingress: event.target.value }))} />
              </label>
              <label className="field">
                <span>资源规格</span>
                <select value={draftApp.resource} onChange={(event) => setDraftApp((current) => ({ ...current, resource: event.target.value }))}>
                  <option>2C / 8GB</option>
                  <option>4C / 16GB</option>
                  <option>8C / 32GB</option>
                </select>
              </label>
              <label className="field">
                <span>持久化存储</span>
                <select value={draftApp.storage} onChange={(event) => setDraftApp((current) => ({ ...current, storage: event.target.value }))}>
                  <option>20GB PVC</option>
                  <option>100GB PVC</option>
                  <option>对象存储挂载</option>
                  <option>200GB PVC</option>
                </select>
              </label>
              <label className="field">
                <span>副本数</span>
                <select value={String(draftApp.replicas)} onChange={(event) => setDraftApp((current) => ({ ...current, replicas: Number(event.target.value) }))}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </label>
              <label className="field">
                <span>弹性伸缩配置</span>
                <input value={draftApp.autoscaling} onChange={(event) => setDraftApp((current) => ({ ...current, autoscaling: event.target.value }))} />
              </label>
            </div>
            <div className="cloud-workflow-strip">
              <SecurityNode icon={AppWindow} label="来源应用" value={draftApp.source} tone="blue" />
              <SecurityNode icon={Layers} label="工作负载" value="Deployment / Service" tone="cyan" />
              <SecurityNode icon={ServerCog} label="当前副本" value={`${draftApp.replicas} replicas`} tone="emerald" />
              <SecurityNode icon={HardDrive} label="存储配置" value={draftApp.storage} tone="amber" />
            </div>
            <StepRail
              steps={["创建应用", "配置容器参数", "点击部署", "任务下发", "状态管理与伸缩"]}
              active={draftApp.status === "草稿" ? 1 : draftApp.status === "任务下发中" ? 3 : draftApp.status === "部署中" ? 3 : 4}
            />
            <div className="action-row">
              <Button icon={Rocket} onClick={deploy} disabled={draftApp.status === "任务下发中" || draftApp.status === "部署中" || draftApp.status === "扩缩容中"}>
                部署应用
              </Button>
            </div>
            <LogPanel
              title="工作负载配置"
              lines={[
                `ingress: ${draftApp.ingress}`,
                `resource: ${draftApp.resource}`,
                `storage: ${draftApp.storage}`,
                `autoscaling: ${draftApp.autoscaling}`,
                `replicas: ${draftApp.replicas}`,
                `image: ${draftApp.image}`,
              ]}
            />
          </section>
        </div>
      ) : null}
    </ModuleScaffold>
  );
}

function ModelMarketPage({
  models,
  addAudit,
}: {
  models: OpenSourceModelCard[];
  addAudit: (event: Omit<AuditEvent, "id" | "time">) => void;
}) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const sortedModels = useMemo(
    () =>
      [...models].sort(
        (left, right) =>
          marketPlacementPriority(right) - marketPlacementPriority(left) || right.heatScore - left.heatScore || right.rating - left.rating,
      ),
    [models],
  );
  const rankedModels = useMemo(() => [...models].sort((left, right) => right.heatScore - left.heatScore), [models]);
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(sortedModels.length / pageSize));
  const pagedModels = sortedModels.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const openModel = (model: OpenSourceModelCard) => {
    addAudit({ actor: "模型市场", action: "查看模型详情", target: model.name, result: "成功" });
    navigate(`/market/${model.id}`);
  };

  return (
    <ModuleScaffold scenarioKey="market">
      <div className="market-layout">
        <section className="surface-panel">
          <SectionHeader eyebrow="MODEL CARDS" title="列表" description="点击任意卡片进入详情页，查看模型信息、评分评论与相关设置。" />
          <div className="model-release-toolbar">
            <StatusBadge tone="blue">{`共 ${models.length} 个模型`}</StatusBadge>
            <StatusBadge tone="slate">{`第 ${page} / ${totalPages} 页`}</StatusBadge>
          </div>
          <div className="model-release-grid">
            {pagedModels.map((model) => {
              return (
                <article
                  key={model.id}
                  className="model-release-card model-market-card"
                  onClick={() => openModel(model)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openModel(model);
                    }
                  }}
                >
                  <div className="model-release-card-header">
                    <div>
                      <h3>{model.name}</h3>
                    </div>
                  </div>
                  <p>{model.summary}</p>
                  <div className="market-meta-tags">
                    <span>{`类型 · ${model.family}`}</span>
                    <span>{`评分 · ${model.rating.toFixed(1)} / 5`}</span>
                    <span>{`热度 · ${model.heatScore}`}</span>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="pagination-row">
            <Button variant="ghost" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
              上一页
            </Button>
            <div className="pagination-indicator">
              {Array.from({ length: totalPages }, (_, index) => (
                <button key={index + 1} className={page === index + 1 ? "active" : ""} onClick={() => setPage(index + 1)}>
                  {index + 1}
                </button>
              ))}
            </div>
            <Button variant="ghost" disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
              下一页
            </Button>
          </div>
        </section>

        <section className="surface-panel">
          <SectionHeader eyebrow="HEAT RANKING" title="热度榜单" description="按热度、下载与评分综合展示当前热度榜，同时标识已进入精选或置顶的模型。" />
          <div className="market-rank-list">
            {rankedModels.slice(0, 8).map((model, index) => (
              <button key={model.id} type="button" className="market-rank-item" onClick={() => openModel(model)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{model.name}</strong>
                  <small>{`${model.heatScore} 热度分 · ${model.rating.toFixed(1)} 分 · ${model.reviewCount} 条评分`}</small>
                </div>
                <div className="market-rank-item-tail">
                  {marketPlacementPriority(model) > 0 ? (
                    <StatusBadge tone={marketPlacementTone(model.placement)}>{model.placement.level}</StatusBadge>
                  ) : null}
                  <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </ModuleScaffold>
  );
}

function ModelMarketDetailPage({
  models,
  setModels,
  addAudit,
}: {
  models: OpenSourceModelCard[];
  setModels: React.Dispatch<React.SetStateAction<OpenSourceModelCard[]>>;
  addAudit: (event: Omit<AuditEvent, "id" | "time">) => void;
}) {
  const navigate = useNavigate();
  const { modelId } = useParams();
  const model = models.find((item) => item.id === modelId);
  const [draftScore, setDraftScore] = useState(5);
  const [draftComment, setDraftComment] = useState("");
  const [placementDraftLevel, setPlacementDraftLevel] = useState<Exclude<ModelMarketPlacementLevel, "普通">>("精选");
  const [placementDraftChannels, setPlacementDraftChannels] = useState<ModelMarketPlacementChannel[]>(defaultPlacementChannels("精选"));
  const [placementDraftReason, setPlacementDraftReason] = useState("");
  const [placementDraftUntil, setPlacementDraftUntil] = useState("2026-05-31");
  const [placementError, setPlacementError] = useState("");

  useEffect(() => {
    if (!model) {
      return;
    }

    const nextLevel = model.placement.level === "置顶" ? "置顶" : "精选";
    setPlacementDraftLevel(nextLevel);
    setPlacementDraftChannels(model.placement.channels.length ? [...model.placement.channels] : defaultPlacementChannels(nextLevel));
    setPlacementDraftReason(model.placement.reason);
    setPlacementDraftUntil(model.placement.effectiveUntil ?? "2026-05-31");
    setPlacementError("");
  }, [model?.id, model?.placement.level, model?.placement.status, model?.placement.reason, model?.placement.effectiveUntil]);

  if (!model) {
    return (
      <ModuleScaffold scenarioKey="market">
        <section className="surface-panel">
          <SectionHeader eyebrow="MODEL DETAIL" title="未找到对应模型" description="请返回模型市场重新选择需要查看的模型资产。" />
          <div className="action-row">
            <Button variant="secondary" onClick={() => navigate("/market")}>
              返回模型市场
            </Button>
          </div>
        </section>
      </ModuleScaffold>
    );
  }

  const rankedModels = [...models].sort((left, right) => right.heatScore - left.heatScore);
  const currentRank = rankedModels.findIndex((item) => item.id === model.id) + 1;
  const placementStep = model.placement.status === "已生效" ? 2 : model.placement.status === "待审批" ? 1 : 0;

  const submitScore = () => {
    setModels((current) =>
      current.map((item) =>
        item.id === model.id
          ? {
              ...item,
              rating: Number((((item.rating * item.reviewCount) + draftScore) / (item.reviewCount + 1)).toFixed(1)),
              reviewCount: item.reviewCount + 1,
              heatScore: item.heatScore + 3,
            }
          : item,
      ),
    );
    addAudit({ actor: "模型市场", action: `提交模型评分 ${draftScore} 分`, target: model.name, result: "成功" });
  };

  const submitComment = () => {
    const content = draftComment.trim();
    if (!content) {
      return;
    }

    const nextComment: ModelMarketComment = {
      id: `comment-${Date.now()}`,
      author: "平台运营员",
      role: "运营",
      content,
      createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
      likes: 0,
    };

    setModels((current) =>
      current.map((item) =>
        item.id === model.id
          ? {
              ...item,
              comments: [nextComment, ...item.comments],
              heatScore: item.heatScore + 5,
            }
          : item,
      ),
    );
    setDraftComment("");
    addAudit({ actor: "模型市场", action: "新增模型评论", target: model.name, result: "成功" });
  };

  const togglePlacementChannel = (channel: ModelMarketPlacementChannel) => {
    setPlacementDraftChannels((current) => {
      if (current.includes(channel)) {
        return current.filter((item) => item !== channel);
      }

      return [...current, channel];
    });
  };

  const submitPlacement = () => {
    const reason = placementDraftReason.trim();
    if (!reason) {
      setPlacementError("请填写精选或置顶的运营理由。");
      return;
    }

    if (placementDraftChannels.length === 0) {
      setPlacementError("请至少选择一个生效渠道。");
      return;
    }

    const requestedAt = nowDateTime();
    setPlacementError("");
    setModels((current) =>
      current.map((item) =>
        item.id === model.id
          ? {
              ...item,
              placement: {
                level: placementDraftLevel,
                status: "待审批",
                channels: [...placementDraftChannels],
                reason,
                applicant: "平台运营员",
                approver: undefined,
                requestedAt,
                approvedAt: undefined,
                effectiveUntil: placementDraftUntil,
              },
            }
          : item,
      ),
    );
    addAudit({ actor: "模型市场", action: `提交${placementDraftLevel}推荐位申请`, target: model.name, result: "处理中" });
  };

  const approvePlacement = () => {
    const approvedAt = nowDateTime();
    setModels((current) =>
      current.map((item) =>
        item.id === model.id
          ? {
              ...item,
              heatScore: item.heatScore + (item.placement.level === "置顶" ? 8 : 4),
              placement: {
                ...item.placement,
                status: "已生效",
                approver: "模型市场管理员",
                approvedAt,
              },
            }
          : item,
      ),
    );
    addAudit({ actor: "模型市场", action: `${model.placement.level}推荐位审批通过`, target: model.name, result: "成功" });
  };

  const rejectPlacement = () => {
    setModels((current) =>
      current.map((item) =>
        item.id === model.id
          ? {
              ...item,
              placement: {
                level: "普通",
                status: "未设置",
                channels: [],
                reason: "",
              },
            }
          : item,
      ),
    );
    setPlacementError("");
    addAudit({ actor: "模型市场", action: "精选/置顶申请驳回", target: model.name, result: "告警" });
  };

  const revokePlacement = () => {
    setModels((current) =>
      current.map((item) =>
        item.id === model.id
          ? {
              ...item,
              placement: {
                level: "普通",
                status: "未设置",
                channels: [],
                reason: "",
              },
            }
          : item,
      ),
    );
    addAudit({ actor: "模型市场", action: "撤销精选/置顶生效状态", target: model.name, result: "成功" });
  };

  return (
    <ModuleScaffold scenarioKey="market">
      <section className="surface-panel model-detail-panel compact">
        <div className="dataset-detail-header">
          <div>
            <button className="inline-action" onClick={() => navigate("/market")}>
              返回模型市场
            </button>
            <SectionHeader
              eyebrow="MODEL DETAIL"
              title={model.name}
              description={`${model.provider} · ${model.params} · 热榜 #${currentRank}`}
            />
          </div>
          <div className="dataset-detail-badges">
            <StatusBadge tone={currentRank <= 3 ? "emerald" : currentRank <= 10 ? "blue" : "slate"}>{`热榜 #${currentRank}`}</StatusBadge>
            <StatusBadge tone="amber">{`${model.rating.toFixed(1)} 分`}</StatusBadge>
            <StatusBadge tone={marketPlacementTone(model.placement)}>{marketPlacementLabel(model.placement)}</StatusBadge>
          </div>
        </div>

        <div className="allocation-summary compact">
          <KeyValue label="模型系列" value={model.family} />
          <KeyValue label="来源" value={model.provider} />
          <KeyValue label="参数规模" value={model.params} />
          <KeyValue label="本周调用量" value={model.weeklyCalls} />
        </div>
        <div className="card-tag-strip">
          {model.highlights.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard icon={Sparkles} label="综合评分" value={model.rating.toFixed(1)} unit={`/ 5，${model.reviewCount} 条评分`} tone="emerald" />
        <MetricCard icon={FileText} label="评论总数" value={`${model.comments.length}`} unit="条" tone="blue" />
        <MetricCard icon={Activity} label="热度分" value={`${model.heatScore}`} unit={`榜单 #${currentRank}`} tone="amber" />
        <MetricCard icon={Download} label="下载量" value={`${model.downloads}`} unit="次" tone="cyan" />
      </section>

      <section className="surface-panel">
        <div className="market-settings-head">
          <SectionHeader
            eyebrow="MODEL SETTINGS"
            title="模型设置"
            description="对高价值模型发起精选或置顶申请，审核通过后在浏览页和搜索结果中优先展示。"
          />
          <StatusBadge tone={marketPlacementTone(model.placement)}>{marketPlacementLabel(model.placement)}</StatusBadge>
        </div>
        <StepRail steps={["提交申请", "运营审核", "推荐位生效"]} active={placementStep} />
        <div className="market-settings-grid">
          <div className="surface-panel market-settings-card">
            <SectionHeader eyebrow="PLACEMENT CONFIG" title="推荐位配置" description="精选适合长期推荐，置顶适合活动期或高价值模型强曝光。" />
            <div className="market-score-row">
              {(["精选", "置顶"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`dataset-access-chip ${placementDraftLevel === level ? "is-active" : ""}`}
                  onClick={() => {
                    setPlacementDraftLevel(level);
                    if (placementDraftChannels.length === 0) {
                      setPlacementDraftChannels(defaultPlacementChannels(level));
                    }
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="field">
              <span>生效渠道</span>
              <div className="market-channel-grid">
                {(["市场首页", "搜索优先", "专题推荐"] as const).map((channel) => (
                  <button
                    key={channel}
                    type="button"
                    className={`dataset-access-chip ${placementDraftChannels.includes(channel) ? "is-active" : ""}`}
                    onClick={() => togglePlacementChannel(channel)}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-grid two">
              <label className="field">
                <span>生效截止时间</span>
                <input type="date" value={placementDraftUntil} onChange={(event) => setPlacementDraftUntil(event.target.value)} />
              </label>
              <label className="field">
                <span>审批状态</span>
                <input value={model.placement.status} readOnly />
              </label>
            </div>
            <div className="field">
              <span>运营理由</span>
              <textarea
                rows={4}
                value={placementDraftReason}
                placeholder="输入进入精选或置顶位的业务价值、转化表现或活动诉求。"
                onChange={(event) => setPlacementDraftReason(event.target.value)}
              />
            </div>
            {placementError ? <p className="form-error">{placementError}</p> : null}
            <div className="modal-actions">
              <Button variant="secondary" icon={Settings} onClick={submitPlacement}>
                提交申请
              </Button>
              {model.placement.status === "待审批" ? (
                <>
                  <Button icon={CheckCircle2} onClick={approvePlacement}>
                    审批通过
                  </Button>
                  <Button variant="ghost" icon={X} onClick={rejectPlacement}>
                    驳回申请
                  </Button>
                </>
              ) : null}
              {model.placement.status === "已生效" ? (
                <Button variant="ghost" icon={Minus} onClick={revokePlacement}>
                  撤销生效
                </Button>
              ) : null}
            </div>
          </div>

          <div className="surface-panel market-settings-card">
            <SectionHeader eyebrow="WORKFLOW PREVIEW" title="流程与结果" description="申请提交后进入运营审核，通过后才会真实影响模型市场排序与视觉特效。" />
            <div className="allocation-summary compact">
              <KeyValue label="当前展示" value={marketPlacementLabel(model.placement)} positive={model.placement.status === "已生效"} />
              <KeyValue label="目标推荐位" value={model.placement.level === "普通" ? "未设置" : model.placement.level} />
              <KeyValue label="生效渠道" value={placementChannelsLabel(model.placement.channels)} />
              <KeyValue label="截止时间" value={model.placement.effectiveUntil ?? "未设置"} />
            </div>
            <div className="market-flow-list">
              <div className="market-flow-item">
                <strong>1. 运营申请</strong>
                <span>{model.placement.requestedAt ? `${model.placement.applicant ?? "平台运营员"} 于 ${model.placement.requestedAt} 提交` : "尚未提交推荐位申请"}</span>
              </div>
              <div className="market-flow-item">
                <strong>2. 审核确认</strong>
                <span>
                  {model.placement.status === "待审批"
                    ? "等待模型市场管理员审核。"
                    : model.placement.approvedAt
                      ? `${model.placement.approver ?? "模型市场管理员"} 于 ${model.placement.approvedAt} 审批通过`
                      : "当前无待审核记录。"}
                </span>
              </div>
              <div className="market-flow-item">
                <strong>3. 市场生效</strong>
                <span>
                  {model.placement.status === "已生效"
                    ? `${model.placement.level}特效已生效，浏览与搜索结果优先展示。`
                    : "审核通过后才会进入精选或置顶位，并更新市场排序。"}
                </span>
              </div>
            </div>
            <LogPanel
              title="推荐位设置摘要"
              lines={[
                `placement_level: ${model.placement.level}`,
                `status: ${model.placement.status}`,
                `channels: ${placementChannelsLabel(model.placement.channels)}`,
                `effective_until: ${model.placement.effectiveUntil ?? "未设置"}`,
                `reason: ${model.placement.reason || "未填写"}`,
              ]}
            />
          </div>
        </div>
      </section>

      <section className="surface-panel">
        <SectionHeader eyebrow="OPERATIONS" title="运营功能" description="支持评分和评论，实时反馈到模型热度；精选与置顶则通过模型设置流程进入更高优先级推荐位。" />
        <div className="market-score-row">
          {[1, 2, 3, 4, 5].map((score) => (
            <button key={score} type="button" className={`dataset-access-chip ${draftScore === score ? "is-active" : ""}`} onClick={() => setDraftScore(score)}>
              {score} 分
            </button>
          ))}
          <Button variant="secondary" icon={Sparkles} onClick={submitScore}>
            提交评分
          </Button>
        </div>
        <div className="field">
          <span>运营评论</span>
          <textarea rows={4} value={draftComment} placeholder="输入模型使用反馈、亮点总结或推荐理由。" onChange={(event) => setDraftComment(event.target.value)} />
        </div>
        <div className="modal-actions">
          <Button variant="secondary" icon={FileText} onClick={submitComment}>
            发表评论
          </Button>
        </div>
      </section>

      <section className="surface-panel">
        <SectionHeader eyebrow="COMMENTS" title="评论区" description="评论沉淀用户反馈与运营结论，帮助模型资产持续提升可见度和信任度。" />
        <div className="market-comment-list">
          {model.comments.map((comment) => (
            <article key={comment.id} className="market-comment-card">
              <div className="market-comment-head">
                <div>
                  <strong>{comment.author}</strong>
                  <span>{`${comment.role} · ${comment.createdAt}`}</span>
                </div>
                <StatusBadge tone="slate">{`${comment.likes} 赞`}</StatusBadge>
              </div>
              <p>{comment.content}</p>
            </article>
          ))}
        </div>
      </section>
    </ModuleScaffold>
  );
}

function ModuleScaffold({
  scenarioKey,
  children,
}: {
  scenarioKey: string;
  children: React.ReactNode;
}) {
  const scenario = scenarios.find((item) => item.key === scenarioKey)!;
  return (
    <div className="page-grid">
      <section className={`module-hero ${toneClass(scenario.tone)}`}>
        <div>
          <span className="eyebrow">{scenario.key.toUpperCase()}</span>
          <h2>{scenario.title}</h2>
          <p>{scenario.summary}</p>
        </div>
        <div className="module-step-strip">
          {scenario.steps.map((step, index) => (
            <span key={step}>
              {index + 1}. {step}
            </span>
          ))}
        </div>
      </section>
      {children}
    </div>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="section-header">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}

function Button({
  children,
  icon: Icon,
  variant = "primary",
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button className={`btn btn-${variant}`} disabled={disabled} onClick={onClick}>
      {Icon && <Icon size={16} />}
      <span>{children}</span>
    </button>
  );
}

function StatusBadge({
  children,
  tone = "slate",
  animated = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  animated?: boolean;
}) {
  return <span className={`status-badge ${toneClass(tone)} ${animated ? "is-animated" : ""}`}>{children}</span>;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  tone,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  tone: Tone;
  trend?: string;
}) {
  return (
    <article className={`metric-card ${toneClass(tone)}`}>
      <div className="metric-icon">
        <Icon size={19} />
      </div>
      <div className="min-w-0">
        <p>{label}</p>
        <div>
          <strong>{value}</strong>
          <span>{unit}</span>
        </div>
      </div>
      {trend && <em>{trend}</em>}
    </article>
  );
}

function MetricMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-mini">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DataTable({ columns, rows }: { columns: React.ReactNode[]; rows: React.ReactNode[][] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column)}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AuditList({ audit }: { audit: AuditEvent[] }) {
  if (audit.length === 0) {
    return <EmptyState icon={Archive} title="暂无审计事件" text="平台操作会在这里形成可追溯记录。" />;
  }
  return (
    <div className="audit-list">
      {audit.map((item) => (
        <div key={item.id} className="audit-item">
          <span className="audit-time">{item.time}</span>
          <div className="min-w-0">
            <p>
              <strong>{item.actor}</strong>
              <span>{item.action}</span>
            </p>
            <small>{item.target}</small>
          </div>
          <StatusBadge tone={resultTone(item.result)}>{item.result}</StatusBadge>
        </div>
      ))}
    </div>
  );
}

function StepRail({ steps, active }: { steps: string[]; active: number }) {
  return (
    <div className="step-rail">
      {steps.map((step, index) => (
        <div key={step} className={index <= active ? "done" : ""}>
          <span>{index < active ? <Check size={13} /> : index === active ? <CircleDot size={13} /> : index + 1}</span>
          <strong>{step}</strong>
        </div>
      ))}
    </div>
  );
}

function LogPanel({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="log-panel">
      <div>
        <Terminal size={15} />
        <span>{title}</span>
      </div>
      <pre>{lines.join("\n")}</pre>
    </div>
  );
}

function ProgressBar({ value, label = "任务进度" }: { value: number; label?: string }) {
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="progress-track">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function KeyValue({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="key-value">
      <span>{label}</span>
      <strong className={positive ? "text-emerald-700" : ""}>{value}</strong>
    </div>
  );
}

function SecurityNode({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: string; tone: Tone }) {
  return (
    <div className={`security-node ${toneClass(tone)}`}>
      <div>
        <Icon size={18} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function QuotaBars({ tenant }: { tenant: Tenant }) {
  const values = [
    { label: "CPU", value: tenant.cpu, max: 600, tone: "blue" as Tone },
    { label: "GPU", value: tenant.gpu, max: 80, tone: "emerald" as Tone },
    { label: "vGPU", value: tenant.vgpu, max: 240, tone: "amber" as Tone },
  ];
  return (
    <div className="quota-bars">
      {values.map((item) => (
        <div key={item.label}>
          <div>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
          <div className={`quota-track ${toneClass(item.tone)}`}>
            <span style={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniChart({ values }: { values: number[] }) {
  const points = useMemo(
    () =>
      values
        .map((value, index) => {
          const x = 8 + (index / Math.max(values.length - 1, 1)) * 88;
          const y = 92 - value * 0.84;
          return `${x},${y}`;
        })
        .join(" "),
    [values],
  );
  return (
    <div className="mini-chart">
      <div className="chart-title">
        <span>TTFT 实时趋势</span>
      </div>
      <div className="mini-chart-frame">
        <div className="mini-chart-y-axis" aria-hidden="true">
          <span>900ms</span>
          <span>600ms</span>
          <span>300ms</span>
        </div>
        <div className="mini-chart-canvas">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="8" y1="8" x2="8" y2="92" stroke="rgba(148, 163, 184, 0.55)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line x1="8" y1="92" x2="96" y2="92" stroke="rgba(148, 163, 184, 0.55)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <polyline points={points} fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="mini-chart-x-axis" aria-hidden="true">
            <span>15m 前</span>
            <span>10m 前</span>
            <span>5m 前</span>
            <span>现在</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="empty-state">
      <Icon size={24} />
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

export default App;
