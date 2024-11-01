import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dashboard content will go here */}
              <div className="col-span-full">
                <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
                  <p className="text-muted-foreground">Welcome to your dashboard!</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;