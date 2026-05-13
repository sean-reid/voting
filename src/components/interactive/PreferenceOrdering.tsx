import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const candidateColors: Record<string, string> = {
  A: "bg-candidate-a/15 text-candidate-a border-candidate-a/30",
  B: "bg-candidate-b/15 text-candidate-b border-candidate-b/30",
  C: "bg-candidate-c/15 text-candidate-c border-candidate-c/30",
  Alice: "bg-candidate-a/15 text-candidate-a border-candidate-a/30",
  Bob: "bg-candidate-b/15 text-candidate-b border-candidate-b/30",
  Carol: "bg-candidate-c/15 text-candidate-c border-candidate-c/30",
  Charlie: "bg-candidate-c/15 text-candidate-c border-candidate-c/30",
};

const fallbackColors = [
  "bg-terracotta/15 text-terracotta border-terracotta/30",
  "bg-sage/15 text-sage border-sage/30",
  "bg-slate/15 text-slate border-slate/30",
  "bg-muted-red/15 text-muted-red border-muted-red/30",
];

function getColor(candidate: string, index: number): string {
  return candidateColors[candidate] ?? fallbackColors[index % fallbackColors.length] ?? fallbackColors[0]!;
}

function ordinal(n: number): string {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

function GripIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden="true"
      className="opacity-50"
    >
      <circle cx="3.5" cy="2" r="1.2" />
      <circle cx="8.5" cy="2" r="1.2" />
      <circle cx="3.5" cy="6" r="1.2" />
      <circle cx="8.5" cy="6" r="1.2" />
      <circle cx="3.5" cy="10" r="1.2" />
      <circle cx="8.5" cy="10" r="1.2" />
    </svg>
  );
}

interface SortableItemProps {
  id: string;
  rank: number;
  colorClass: string;
  disabled?: boolean;
}

function SortableItem({ id, rank, colorClass, disabled }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform) ?? undefined,
    transition: transition ?? undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border px-3 py-2 select-none transition-shadow ${colorClass} ${
        isDragging ? "z-10 shadow-lg opacity-90 relative" : ""
      } ${disabled ? "opacity-60" : ""}`}
      role="listitem"
      aria-label={`${ordinal(rank)} choice: ${id}`}
    >
      <button
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 rounded p-0.5"
        aria-label={`Drag to reorder ${id}`}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        <GripIcon />
      </button>
      <span className="text-xs font-semibold opacity-60 min-w-[2rem]">
        {ordinal(rank)}
      </span>
      <span className="font-medium text-sm">{id}</span>
    </div>
  );
}

interface PreferenceOrderingProps {
  candidates: string[];
  ranking: string[];
  onChange: (ranking: string[]) => void;
  label: string;
  disabled?: boolean;
}

export default function PreferenceOrdering({
  candidates,
  ranking,
  onChange,
  label,
  disabled,
}: PreferenceOrderingProps) {
  const [, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = ranking.indexOf(active.id as string);
      const newIndex = ranking.indexOf(over.id as string);
      onChange(arrayMove(ranking, oldIndex, newIndex));
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink-secondary">{label}</span>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveId(active.id as string)}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={ranking} strategy={verticalListSortingStrategy}>
          <div
            role="list"
            aria-label={`${label} ranking`}
            className="flex flex-col gap-1.5"
          >
            {ranking.map((candidate, index) => (
              <SortableItem
                key={candidate}
                id={candidate}
                rank={index + 1}
                colorClass={getColor(candidate, candidates.indexOf(candidate))}
                disabled={disabled}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
