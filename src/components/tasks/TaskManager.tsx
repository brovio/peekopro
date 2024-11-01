import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const TaskManager = () => {
  const tasks = [
    { id: 1, title: "Design System Updates", progress: 75, category: "Design" },
    { id: 2, title: "API Integration", progress: 30, category: "Development" },
    { id: 3, title: "Content Strategy", progress: 60, category: "Marketing" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.category}</p>
                </div>
                <span className="text-sm font-medium">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskManager;