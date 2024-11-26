import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";

type Props = {
  onVote: (id: number) => void;
};

const VoteForm: React.FC<Props> = ({ onVote }) => {
  const [candidateId, setCandidateId] = useState<number | null>(null);

  const handleVote = () => {
    if (candidateId !== null) {
      onVote(candidateId);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Vote for a Candidate
      </h1>
      <Card className="w-full max-w-md mx-auto bg-gray-800 text-gray-100 mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Cast Your Vote</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="candidateId"
                className="text-sm font-medium text-gray-300"
              >
                Candidate ID
              </Label>
              <Input
                id="candidateId"
                type="number"
                value={candidateId ?? ""}
                onChange={(e) => setCandidateId(Number(e.target.value))}
                className="bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleVote}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Vote
          </Button>
        </CardFooter>
      </Card>
      <Separator className="container mx-auto" />
    </div>
  );
};

export default VoteForm;
