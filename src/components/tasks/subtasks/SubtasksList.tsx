import { SubTask } from "@/types/task";
import SubtaskItem from "./SubtaskItem";

interface SubtasksListProps {
  subtasks: SubTask[] | null;
  onComplete: (subtaskId: string, completed: boolean) => void;
}

const SubtasksList = ({ subtasks, onComplete }: SubtasksListProps) => {
  if (!subtasks || subtasks.length === 0) {
    return null;
  }

  return (
    <div className="ml-6 space-y-2 mt-2 mb-4">
      {subtasks.map((subtask, index) => (
        <SubtaskItem
          key={subtask.id}
          subtask={subtask}
          index={index}
          onComplete={onComplete}
        />
      ))}
    </div>
  );
};

export default SubtasksList;