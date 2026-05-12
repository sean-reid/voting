import { motion } from "motion/react";
import { votingMethodsInfo } from "@/data/votingMethods";
import Badge from "@/components/ui/Badge";

const criteriaHeaders = [
  { key: "unrestricted" as const, label: "Unrestricted Domain" },
  { key: "unanimity" as const, label: "Unanimity" },
  { key: "iia" as const, label: "IIA" },
  { key: "nonDictatorship" as const, label: "Non-Dictatorship" },
];

function CheckMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-sage"
      aria-label="Satisfied"
    >
      <path d="M5 10.5 L8.5 14 L15 6" />
    </svg>
  );
}

function XMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-red"
      aria-label="Violated"
    >
      <path d="M6 6 L14 14 M14 6 L6 14" />
    </svg>
  );
}

export default function ComparisonMatrix() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="overflow-x-auto"
    >
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border-strong">
            <th className="text-left py-3 pr-4 font-serif font-semibold text-ink">
              Method
            </th>
            {criteriaHeaders.map((h) => (
              <th
                key={h.key}
                className="py-3 px-3 text-center font-serif font-semibold text-ink whitespace-nowrap"
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {votingMethodsInfo.map((method, rowIndex) => (
            <motion.tr
              key={method.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: rowIndex * 0.06 }}
              className="border-b border-border last:border-b-0"
            >
              <td className="py-3 pr-4">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-ink">{method.name}</span>
                  {method.note && (
                    <Badge variant="muted-red">{method.note}</Badge>
                  )}
                </div>
              </td>
              {criteriaHeaders.map((h) => (
                <td key={h.key} className="py-3 px-3 text-center">
                  <span className="inline-flex items-center justify-center">
                    {method.satisfies[h.key] ? <CheckMark /> : <XMark />}
                  </span>
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
