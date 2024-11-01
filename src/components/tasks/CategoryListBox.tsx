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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
          {title}
          <span className="text-sm text-gray-500">({tasks.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-3 rounded-md bg-white border border-gray-200 text-gray-900 hover:border-gray-300 transition-colors"
          >
            {task.content}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoryListBox;