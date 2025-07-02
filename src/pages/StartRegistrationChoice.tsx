import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const StartRegistrationChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" onClick={() => navigate("/")}> 
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Start Registration</CardTitle>
          <CardDescription>
            Please select one of the following options to continue your registration:
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 mt-4">
          <Button
            className="w-full"
            onClick={() => navigate("/supplier-registration-request")}
            variant="default"
            size="lg"
          >
            I have an invite from the company
          </Button>
          <Button
            className="w-full"
            onClick={() => navigate("/supplier-registration")}
            variant="outline"
            size="lg"
          >
            I want to join the company
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartRegistrationChoice; 