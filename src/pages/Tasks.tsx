import MindDump from "@/components/tasks/MindDump";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

const Tasks = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
            </div>
            
            <div className="space-y-6">
              <MindDump />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tasks;