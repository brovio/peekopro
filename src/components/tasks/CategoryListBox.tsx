import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Task } from "@/types/task";

interface CategoryListBoxProps {
  title: string
  tasks: Task[]
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void
}

const CategoryListBox = ({ title, tasks, onTaskUpdate }: CategoryListBoxProps) => {
  if (tasks.length === 0) return null;

  return (
    <Card className="bg-navy-800 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
          {title}
          <span className="text-sm text-gray-400">({tasks.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-3 rounded-md bg-navy-900 border border-gray-700 text-white"
          >
            {task.content}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoryListBox;