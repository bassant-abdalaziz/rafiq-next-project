"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { toast } from "sonner";

import { getProjectTasksByStatus, updateTaskStatus } from "@/actions/project";
import { TASK_STATUS_OPTIONS } from "@/constants";
import { TaskPayload } from "@/types/project";
import {
  formatProjectDate,
  getAvatarColorClasses,
  getAvatarInitials,
  STATUS_BADGE_COLORS,
  STATUS_COLORS,
} from "@/utils/helpers";
import CalendarIcon from "@/assets/icons/calendar.svg";
import DelayedIcon from "@/assets/icons/Delayed.svg";
import AddNewTaskIcon from "@/assets/icons/add-new-task.svg";

type BoardViewProps = {
  projectId: string;
  onTaskClick?: (taskId: string) => void;
};

type TaskStatus = (typeof TASK_STATUS_OPTIONS)[number];

type TasksByStatus = Record<TaskStatus, TaskPayload[]>;

// Create an empty tasks object with all statuses as keys
function createEmptyTasksByStatus() {
  const initialTasks = {} as TasksByStatus;

  TASK_STATUS_OPTIONS.forEach((status) => {
    initialTasks[status] = [];
  });

  return initialTasks;
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && TASK_STATUS_OPTIONS.includes(value as TaskStatus);
}

function formatStatusLabel(status: TaskStatus) {
  return status.replaceAll("_", " ");
}

function formatTaskDueDate(value?: string | null) {
  if (!value) return "No due date";

  return formatProjectDate(value);
}

function getDueDateLabel(task: TaskPayload) {
  if (!task.due_date) return "No due date";

  const dueDate = new Date(task.due_date);
  const today = new Date();

  if (Number.isNaN(dueDate.getTime())) {
    return "No due date";
  }

  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (task.status !== "DONE" && dueDate < today) {
    return "DELAYED";
  }

  if (dueDate.getTime() === today.getTime()) {
    return "TODAY";
  }

  return formatTaskDueDate(task.due_date);
}

function isDelayed(task: TaskPayload) {
  return getDueDateLabel(task) === "DELAYED";
}

// Move a task locally from one status column to another and update its status in the UI
function moveTaskBetweenStatuses({
  tasksByStatus,
  task,
  fromStatus,
  toStatus,
}: {
  tasksByStatus: TasksByStatus;
  task: TaskPayload;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
}) {
  return {
    // Keep all statuses as they are first.
    // This creates a new object instead of editing the old state directly.
    ...tasksByStatus,

    // Remove the dragged task from its previous column.
    [fromStatus]: tasksByStatus[fromStatus].filter((currentTask) => currentTask.id !== task.id),

    // Update the new status column,
    // Add the dragged task to the top of the new column.
    [toStatus]: [
      {
        // Keep all old task data.
        ...task,

        // Change the task status locally in the UI
        // so the card now belongs to the new column.
        status: toStatus,
      },

      // Keep the old tasks that were already in the new column.
      ...tasksByStatus[toStatus],
    ],
  };
}

function TaskCard({
  task,
  onTaskClick,
}: {
  task: TaskPayload;
  onTaskClick?: (taskId: string) => void;
}) {
  const assigneeName = task.assignee?.name ?? "Unassigned";
  const dueDateLabel = getDueDateLabel(task);
  const delayed = isDelayed(task);

  /** Make this task card draggable.
   useDraggable connects this card with dnd-kit and gives us everything needed
  to drag the card, move it visually, and read its data when drag ends. */
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    // Unique id for the draggable item.
    // We use task.id because every task has a unique database id.
    id: task.id,

    // Store extra data inside the draggable item.
    // This data will be available later in onDragEnd,
    // so we can know which task was dragged and what its old status was.
    data: {
      task,
      status: task.status,
    },
  });

  // transform contains the current x/y movement while the card is being dragged.
  // If transform exists, it means the card is currently moving.
  const dragStyle = transform
    ? {
        // Move the card visually based on the drag position.
        // translate3d is used for smooth movement and better browser performance.
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,

        // While dragging, put the card above the other elements.
        // If the card is not dragging, zIndex stays undefined.
        zIndex: isDragging ? 50 : undefined,
      }
    : undefined;

  return (
    <div
      // setNodeRef tells dnd-kit: "This div is the draggable element."
      ref={setNodeRef}
      // Apply the moving style while dragging.
      style={dragStyle}
      // Without listeners, the card will not respond to dragging.
      {...listeners}
      // attributes adds accessibility attributes required by dnd-kit.
      // This helps screen readers and keyboard accessibility.
      {...attributes}
      // Normal click behavior. If the user clicks the card without dragging, open the task details popup.
      onClick={() => onTaskClick?.(task.id)}
      className={`
        cursor-grab rounded-lg border border-transparent p-5 shadow-sm transition
        active:cursor-grabbing
        ${isDragging ? "opacity-60 shadow-xl" : ""}
        ${delayed ? "bg-light-error" : "bg-white"}
        ${task.status === "IN_PROGRESS" ? "border-l-4 border-l-primary" : ""}
      `}
    >
      <p className="text-sm font-semibold leading-6 text-navy">{task.title}</p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div
          className={`
            flex items-center gap-2 text-xs font-bold uppercase
            ${delayed ? "text-error" : dueDateLabel === "TODAY" ? "text-primary" : "text-slate"}
          `}
        >
          {delayed ? <DelayedIcon aria-hidden="true" /> : <CalendarIcon aria-hidden="true" />}

          <span>{dueDateLabel}</span>
        </div>

        <div
          className={`
            flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold
            ${getAvatarColorClasses(assigneeName)}
          `}
        >
          {getAvatarInitials(assigneeName)}
        </div>
      </div>
    </div>
  );
}

function TaskCardSkeleton() {
  return (
    <div className="rounded-lg border border-transparent bg-white p-5 shadow-sm">
      <div className="min-h-12">
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-lighter" />
        <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-slate-lighter" />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-lighter" />
        <div className="h-4 w-4 animate-pulse rounded bg-slate-lighter" />
      </div>
    </div>
  );
}

function BoardColumn({
  projectId,
  status,
  tasks,
  isLoading,
  error,
  onTaskClick,
}: {
  projectId: string;
  status: TaskStatus;
  tasks: TaskPayload[];
  isLoading: boolean;
  error: boolean;
  onTaskClick?: (taskId: string) => void;
}) {
  /**
    Make this status column a valid drop zone.
    useDroppable connects this column with dnd-kit, so when a task card is dragged over this column,
    dnd-kit can detect that this column is the current drop target.
   */
  const { setNodeRef, isOver } = useDroppable({
    // Use the task status as the droppable id.
    // Example: "TO_DO", "IN_PROGRESS", "DONE".
    // Later in onDragEnd, event.over.id will be this status,
    // so we can know the new status the task was dropped into.
    id: status,
  });

  const createTaskHref = `/project/${projectId}/tasks/new?status=${status}`;

  return (
    <div
      // setNodeRef tells dnd-kit:
      // "This div is the drop zone for this status column."
      // Without this ref, the column will not accept dropped task cards.
      ref={setNodeRef}
      className={`
        w-full rounded-xl transition
        ${isOver ? "bg-light-navy/40" : ""}
      `}
    >
      {/* Handle  Status Header With Length And Status Name*/}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${STATUS_COLORS[status]}`} />

          <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#64748B]">
            {formatStatusLabel(status)}
          </h3>

          <span
            className={`rounded px-1.5 py-0.5 text-xs font-bold ${STATUS_BADGE_COLORS[status]}`}
          >
            {tasks.length}
          </span>
        </div>

        <Link
          href={createTaskHref}
          className="flex h-8 w-8 items-center justify-center rounded-md text-2xl font-light text-slate transition hover:bg-white hover:text-primary"
          aria-label={`Create task in ${formatStatusLabel(status)}`}
        >
          +
        </Link>
      </div>

      {/* Redirect To Add Task With Status  */}
      <Link
        href={createTaskHref}
        className="mb-5 flex h-16 items-center justify-center gap-2 rounded-lg border border-dashed border-[#D8E1F5] text-sm font-bold uppercase tracking-[2px] text-slate/60 transition"
      >
        <AddNewTaskIcon aria-hidden="true" />
        Add New Task
      </Link>

      {/* Handle Loading */}
      {isLoading && (
        <div className="space-y-4">
          <TaskCardSkeleton />
        </div>
      )}

      {/* Handle Error */}
      {!isLoading && error && (
        <div className="rounded-lg border border-[#E4E8F1] bg-white p-5 text-center text-sm font-semibold text-error">
          Failed to load tasks
        </div>
      )}

      {/* Display Card Of Task Based On Status */}
      {!isLoading && !error && tasks.length === 0 && (
        <div className="p-8 text-center text-sm font-semibold text-slate">No tasks found</div>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <div className="space-y-8">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} />
          ))}
        </div>
      )}
    </div>
  );
}

export function BoardView({ projectId, onTaskClick }: BoardViewProps) {
  const [tasksByStatus, setTasksByStatus] = useState<TasksByStatus>(createEmptyTasksByStatus);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Settings of drag >>>> to prevent any normal click pull card , only pull when card on distance 8
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columnWidth = 380;
  const columnGap = 24;
  const columnsCount = TASK_STATUS_OPTIONS.length;

  const boardWidth = columnsCount * columnWidth + (columnsCount - 1) * columnGap;

  // Fetch all project tasks grouped by status to display each status column
  useEffect(() => {
    const loadAllTasks = async () => {
      setIsLoading(true);
      setError(false);

      try {
        const responses = await Promise.all(
          TASK_STATUS_OPTIONS.map(async (status) => {
            const tasks = await getProjectTasksByStatus(projectId, status);

            return {
              status,
              tasks,
            };
          })
        );

        const nextTasksByStatus = createEmptyTasksByStatus();

        responses.forEach(({ status, tasks }) => {
          nextTasksByStatus[status] = tasks;
        });

        setTasksByStatus(nextTasksByStatus);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    void loadAllTasks();
  }, [projectId]);

  // Handle dropping a task into a new status column, update the UI optimistically,
  // then persist the new status to the backend and revert if the request fails
  const handleDragEnd = async (event: DragEndEvent) => {
    const task = event.active.data.current?.task as TaskPayload | undefined;
    const fromStatus = event.active.data.current?.status;
    const toStatus = event.over?.id;

    if (!task) return;
    if (!isTaskStatus(fromStatus)) return;
    if (!isTaskStatus(toStatus)) return;
    if (fromStatus === toStatus) return;

    const previousTasksByStatus = tasksByStatus;

    const nextTasksByStatus = moveTaskBetweenStatuses({
      tasksByStatus,
      task,
      fromStatus,
      toStatus,
    });

    // Optimistic UI update:
    // Move the task in the UI immediately before waiting for the API.
    // This makes the app feel fast.
    setTasksByStatus(nextTasksByStatus);

    try {
      await updateTaskStatus(task.id, toStatus);
      toast.success("Task status is updated successfully");
    } catch {
      setTasksByStatus(previousTasksByStatus);
      toast.error("Failed to update task status");
    }
  };

  return (
    <div className="mt-10 hidden md:block">
      {/* DndContext is wrapper for board any drag or drop occurs inside it */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div
          className="
            overflow-x-scroll overflow-y-visible pb-6
          "
          style={{
            width: "calc(100vw - 320px)",
            maxWidth: "100%",
            scrollbarWidth: "auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columnsCount}, ${columnWidth}px)`,
              columnGap,
              width: boardWidth,
            }}
          >
            {TASK_STATUS_OPTIONS.map((status) => (
              <BoardColumn
                key={status}
                projectId={projectId}
                status={status}
                tasks={tasksByStatus[status]}
                isLoading={isLoading}
                error={error}
                onTaskClick={onTaskClick}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
