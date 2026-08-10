import { SITE_DISCLAIMER } from "@/lib/seo";

interface DisclaimerProps {
  /** 自定义文案；缺省用全站统一 disclaimer */
  text?: string;
}

/**
 * 顶部 disclaimer 条（YMYL 风控，spec 要求）。
 *
 * - 用 <div> 包裹，**不用 H 标签**，避免干扰页面 H1 层级（哥飞方法论）。
 * - 移动端可折叠（点击切换展开/收起），桌面端常显。
 * - 在 phenotype / country / 工具页 H1 之前插入。
 */
export default function Disclaimer({ text }: DisclaimerProps) {
  const content = text || SITE_DISCLAIMER;
  return (
    <div
      role="note"
      aria-label="Disclaimer"
      className="w-full bg-amber-50 border-y border-amber-200 text-amber-900 text-xs sm:text-sm"
    >
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-start gap-2">
        <span aria-hidden className="leading-6">
          ⚠️
        </span>
        <p className="leading-6 m-0">{content}</p>
      </div>
    </div>
  );
}
