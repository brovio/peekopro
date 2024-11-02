import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import TaskManager from "@/components/tasks/TaskManager";
import DataVisuals from "@/components/insights/DataVisuals";
import SummarySection from "@/components/summary/SummarySection";
import FocusModeToggle from "@/components/ui/FocusModeToggle";
import { useState } from "react";

const Dashboard = () => {
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  
  const getDayName = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-foreground">
                Happy {getDayName()} Ross - Welcome to your Dashboard
              </h1>
              <FocusModeToggle onToggle={setFocusModeEnabled} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TaskManager />
              </div>
              
              {!focusModeEnabled && (
                <>
                  <div className="lg:col-span-1">
                    <SummarySection />
                  </div>
                  <div className="lg:col-span-3">
                    <DataVisuals />
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;