"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Brain,
  Target,
  Clock,
  Play,
  ClipboardCheck,
  Lightbulb,
  ChevronRight,
  Zap,
  Timer,
  MousePointerClick,
  GripVertical,
  Sun,
  Moon,
  Download,
  BarChart3,
  BookOpen,
} from "lucide-react";

const WORKFLOW_STEPS = [
  {
    id: 1,
    icon: Brain,
    title: "브레인 덤프",
    subtitle: "머릿속을 비우세요",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    principle: "자이가르닉 효과",
    principleDesc: "미완성 일이 머릿속에서 에너지를 갉아먹습니다. 전부 꺼내야 비로소 집중할 수 있어요.",
    steps: [
      "'오늘' 탭에서 1단계(브레인덤프)를 선택하세요",
      "할 일 입력창에 떠오르는 것을 모두 입력하세요",
      "정리하지 마세요! 순서, 중요도 상관없이 그냥 쏟아내세요",
      "드래그로 순서를 바꾸거나, 완료 체크를 할 수 있어요",
    ],
    tips: "완벽하게 적으려 하지 마세요. '운동', '메일', '보고서' 처럼 짧게 적어도 충분합니다.",
  },
  {
    id: 2,
    icon: Target,
    title: "빅 3 선정",
    subtitle: "오늘의 핵심 3가지",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    principle: "집중의 법칙",
    principleDesc: "동시에 추구하는 목표가 많을수록 성과가 감소합니다. 3개면 충분합니다.",
    steps: [
      "2단계(빅3 선정)로 이동하세요",
      "브레인 덤프 목록에서 오늘 반드시 끝낼 3가지를 선택하세요",
      "목록에서 클릭하면 자동으로 빈 슬롯에 배정됩니다",
      "1순위(빨강) > 2순위(노랑) > 3순위(파랑) 순으로 중요도 표시",
    ],
    tips: "'이것만 끝내면 오늘은 성공이다'라고 느껴지는 것 3가지를 고르세요.",
  },
  {
    id: 3,
    icon: Clock,
    title: "타임박싱",
    subtitle: "시간 블록 배치",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    principle: "파킨슨 법칙",
    principleDesc: "일은 주어진 시간만큼 늘어납니다. 마감을 설정하면 집중력이 올라갑니다.",
    steps: [
      "3단계(타임라인)으로 이동하세요",
      "왼쪽의 미배치 태스크를 클릭하면 시간 설정 창이 열립니다",
      "시작 시간과 예상 소요 시간을 입력하고 배치하세요",
      "타임라인에서 더블클릭하면 빈 블록을 직접 추가할 수도 있어요",
    ],
    tips: "태스크 사이에 15분 버퍼를 두세요. 쉬는 시간도 블록으로 만드는 것이 핵심!",
  },
  {
    id: 4,
    icon: Play,
    title: "실행 & 추적",
    subtitle: "타이머로 실제 시간 기록",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    principle: "계획 오류 극복",
    principleDesc: "우리는 항상 시간을 낙관적으로 예측합니다. 실제 데이터가 예측력을 키웁니다.",
    steps: [
      "타임라인의 블록 위에 마우스를 올리면 ▶ 버튼이 나타납니다",
      "클릭하면 하단에 타이머가 시작됩니다",
      "일시정지, 재개, 중지가 가능합니다",
      "타이머를 중지하면 실제 소요 시간이 자동 기록됩니다",
    ],
    tips: "예상보다 오래 걸려도 괜찮아요. 그 차이가 다음 계획의 정확도를 높여줍니다.",
  },
  {
    id: 5,
    icon: ClipboardCheck,
    title: "일일 리뷰",
    subtitle: "오늘을 돌아보기",
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    principle: "메타인지 강화",
    principleDesc: "\"계획은 중요하지만 계획 자체는 무의미하다\" - 아이젠하워",
    steps: [
      "4단계(리뷰)로 이동하세요",
      "완료율, 빅3 달성, 예상 vs 실제 시간을 확인하세요",
      "오늘의 회고를 자유롭게 적어주세요",
      "'오늘 기록 저장하기'를 눌러 기록을 아카이브하세요",
    ],
    tips: "잘한 점 1가지, 개선할 점 1가지만 적어도 충분합니다.",
  },
];

const FEATURE_GUIDES = [
  { icon: MousePointerClick, title: "더블클릭 블록 추가", desc: "타임라인 빈 공간을 더블클릭하면 새 블록이 생성됩니다" },
  { icon: GripVertical, title: "드래그 정렬", desc: "브레인 덤프 목록에서 핸들을 잡고 드래그하면 순서를 변경할 수 있습니다" },
  { icon: Timer, title: "플로팅 타이머", desc: "타이머 실행 중엔 화면 하단에 항상 표시되어 다른 탭으로 이동해도 유지됩니다" },
  { icon: Sun, title: "다크/라이트 모드", desc: "상단 오른쪽 테마 버튼으로 밝은/어두운 테마를 전환할 수 있습니다" },
  { icon: BarChart3, title: "분석 대시보드", desc: "'분석' 탭에서 누적 통계와 예측 정확도 트렌드를 확인할 수 있습니다" },
  { icon: Download, title: "데이터 백업", desc: "'설정' 탭에서 JSON 형식으로 데이터를 내보낼 수 있습니다" },
];

export default function GuidePage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">타임박싱 플래너 사용 가이드</h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          일론 머스크의 타임박싱 시간 관리법을 기반으로 한 5단계 워크플로우입니다.
          <br />
          뇌과학적 원리에 기반한 <strong>시간 설계 도구</strong>로, 단순한 투두리스트가 아닙니다.
        </p>
      </div>

      {/* 핵심 원칙 배너 */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">핵심 원칙</p>
              <p className="text-xs text-muted-foreground mt-1">
                &quot;할 일 목록은 소원 목록이다. 캘린더에 넣지 않으면 실행되지 않는다.&quot;
                — 모든 할 일에 시간을 부여하세요. 그것이 타임박싱의 본질입니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5단계 워크플로우 */}
      <div>
        <h3 className="text-base font-bold mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4" />
          5단계 워크플로우
        </h3>
        <div className="space-y-2">
          {WORKFLOW_STEPS.map((step) => {
            const isExpanded = expandedStep === step.id;
            return (
              <Card
                key={step.id}
                className={cn(
                  "transition-all cursor-pointer overflow-hidden",
                  isExpanded && step.borderColor
                )}
              >
                <button
                  className="w-full text-left"
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                >
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg shrink-0", step.bgColor)}>
                        <step.icon className={cn("h-4.5 w-4.5", step.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            STEP {step.id}
                          </Badge>
                          <CardTitle className="text-sm">{step.title}</CardTitle>
                        </div>
                        <p className="text-xs text-muted-foreground">{step.subtitle}</p>
                      </div>
                      <ChevronRight className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform shrink-0",
                        isExpanded && "rotate-90"
                      )} />
                    </div>
                  </CardHeader>
                </button>

                {isExpanded && (
                  <CardContent className="pt-0 px-4 pb-4 space-y-3">
                    <Separator />

                    {/* 뇌과학 원리 */}
                    <div className={cn("rounded-lg p-3", step.bgColor)}>
                      <p className={cn("text-xs font-bold", step.color)}>{step.principle}</p>
                      <p className="text-xs text-muted-foreground mt-1">{step.principleDesc}</p>
                    </div>

                    {/* 사용 방법 */}
                    <div>
                      <p className="text-xs font-medium mb-2">사용 방법</p>
                      <ol className="space-y-1.5">
                        {step.steps.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shrink-0 mt-0.5",
                              step.bgColor, step.color
                            )}>
                              {i + 1}
                            </span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* 팁 */}
                    <div className="flex items-start gap-2 rounded-lg border border-dashed p-3">
                      <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">{step.tips}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* 기능 안내 */}
      <div>
        <h3 className="text-base font-bold mb-3 flex items-center gap-2">
          <MousePointerClick className="h-4 w-4" />
          주요 기능
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FEATURE_GUIDES.map((feature, i) => (
            <Card key={i}>
              <CardContent className="flex items-start gap-3 py-3 px-4">
                <feature.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{feature.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 빠른 시작 */}
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-green-700 dark:text-green-400">빠른 시작 (3분 체험)</p>
              <ol className="text-xs text-muted-foreground mt-2 space-y-1">
                <li>1. <strong>오늘</strong> 탭으로 이동하세요</li>
                <li>2. 할 일 3~5개를 빠르게 입력하세요</li>
                <li>3. 빅3를 선택하고 타임라인에 배치하세요</li>
                <li>4. 첫 번째 태스크의 타이머를 시작해보세요!</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
