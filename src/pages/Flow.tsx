import { Card } from "@/components/ui/card";
import { AITestSection } from "@/components/test/AITestSection";

const Flow = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="p-6 bg-card">
        <h2 className="text-xl font-bold mb-6">AI Task Breakdown Testing</h2>
        <AITestSection />
      </Card>
    </div>
  );
};

export default Flow;