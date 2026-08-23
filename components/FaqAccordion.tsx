"use client";

import { useRef, useState, useId } from "react";

type FaqItem = { question: string; answer: string };

/**
 * FAQ 百叶窗（accordion）—— 一次可展开多条，无障碍友好。
 * - 默认全部收起；点击 header 切换该条展开/收起
 * - 用 grid-template-rows 0fr → 1fr 做高度过渡，无需测量内容高度
 * - aria-expanded / aria-controls / button aria-label 一应俱全
 * - 键盘：button 自带 Enter/Space 切换；整个 header 可聚焦
 */
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const panelId = `faq-panel-${i}`;
        const btnId = `faq-btn-${i}`;
        return (
          <FaqRow
            key={item.question}
            item={item}
            isOpen={isOpen}
            onToggle={() => toggle(i)}
            panelId={panelId}
            btnId={btnId}
          />
        );
      })}
    </div>
  );
}

function FaqRow({
  item,
  isOpen,
  onToggle,
  panelId,
  btnId,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  panelId: string;
  btnId: string;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <section
      className={`rounded-2xl border shadow-premium transition-colors duration-300 ease-premium ${
        isOpen
          ? "bg-white border-stone-300"
          : "bg-white border-stone-200 hover:border-stone-300"
      }`}
    >
      <h3 className="m-0">
        <button
          ref={btnRef}
          id={btnId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-5 sm:py-6 text-lg sm:text-xl font-semibold text-stone-900"
        >
          <span>{item.question}</span>
          <span
            aria-hidden
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-premium ${
              isOpen
                ? "bg-stone-900 text-white rotate-180"
                : "bg-stone-100 text-stone-700"
            }`}
          >
            {/* 下箭头 → 展开后旋转 180° 指上 */}
            <svg
              viewBox="0 0 16 16"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </span>
        </button>
      </h3>
      {/* grid-template-rows 0fr → 1fr 实现高度自适应的展开过渡 */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className={`grid transition-[grid-template-rows] duration-300 ease-premium ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="m-0 px-5 sm:px-6 pb-5 sm:pb-6 text-base text-stone-600 leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </section>
  );
}
