import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Target, Brain } from "lucide-react";

const SummarySection = () => {
  return (
    <Card className="bg-[#141e38] border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100">Daily Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-semibold text-gray-100">12</p>
              <p className="text-xs text-gray-400">Completed</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100/10 rounded-lg">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-semibold text-gray-100">5</p>
              <p className="text-xs text-gray-400">In Progress</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100/10 rounded-lg">
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-semibold text-gray-100">89%</p>
              <p className="text-xs text-gray-400">Efficiency</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100/10 rounded-lg">
              <Brain className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-semibold text-gray-100">AI</p>
              <p className="text-xs text-gray-400">Summary</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummarySection;