import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSettings } from "@/contexts/SettingsContext";

const TaskManager = () => {
  const { visibleCategories } = useSettings();
  
  // Filter tasks to only show from visible categories
  const tasks = [
    { id: 1, title: "Design System Updates", progress: 75, category: "Design" },
    { id: 2, title: "API Integration", progress: 30, category: "Development" },
    { id: 3, title: "Content Strategy", progress: 60, category: "Marketing" },
  ].filter(task => visibleCategories.includes(task.category));

  return (
    <Card className="bg-[#141e38] border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100">Task Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-100">{task.title}</h3>
                  <p className="text-sm text-gray-400">{task.category}</p>
                </div>
                <span className="text-sm font-medium text-gray-300">{task.progress}%</span>
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