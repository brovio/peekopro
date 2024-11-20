import { useQueryClient } from "@tanstack/react-query";
import { useTasksQuery } from "./useTasksQuery";
import { useTaskMutations } from "./useTaskMutations";
import { useAuth } from "@/contexts/AuthContext";
import { Task } from "@/types/task";

export const useTestTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: tasks = [] } = useTasksQuery(user?.id);
  const { updateTask, deleteTask, moveTask } = useTaskMutations(user?.id);

  const handleTasksChange = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  return {
    tasks,
    updateTask,
    deleteTask,
    moveTask,
    handleTasksChange
  };
};