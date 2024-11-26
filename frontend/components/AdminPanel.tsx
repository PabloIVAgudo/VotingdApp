"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface AdminPanelProps {
  writeContract: ethers.Contract | null;
  electionOngoing: boolean;
}

function AdminPanel({ writeContract, electionOngoing }: AdminPanelProps) {
  const [candidatesInput, setCandidatesInput] = useState("");
  const [electionDuration, setElectionDuration] = useState<number | null>(null);
  const [newCandidate, setNewCandidate] = useState("");

  const handleStartElection = async () => {
    if (!writeContract) {
      alert("Contract is not initialized");
      return;
    }
    if (!candidatesInput || !electionDuration) {
      alert("Please fill in all fields");
      return;
    }

    const candidatesArray = candidatesInput
      .split(",")
      .map((name) => name.trim());
    try {
      const tx = await writeContract.startElection(
        candidatesArray,
        electionDuration
      );
      await tx.wait();
      alert("Election started successfully!");
      setCandidatesInput("");
      setElectionDuration(null);
    } catch (error) {
      console.error("Error starting election:", error);
      alert("Failed to start election. Please try again.");
    }
  };

  const handleAddCandidate = async () => {
    if (!writeContract) {
      alert("Contract is not initialized");
      return;
    }
    if (!newCandidate) {
      alert("Please provide a candidate name");
      return;
    }

    try {
      const tx = await writeContract.addCandidate(newCandidate);
      await tx.wait();
      alert("Candidate added successfully!");
      setNewCandidate("");
    } catch (error) {
      console.error("Error adding candidate:", error);
      alert("Failed to add candidate. Please try again.");
    }
  };

  const handleEndElection = async () => {
    if (!writeContract) {
      alert("Contract is not initialized");
      return;
    }

    try {
      const tx = await writeContract.endElection();
      await tx.wait();
      alert("Election restart successfully!");
      setNewCandidate("");
    } catch (error) {
      console.error("Error restarting election:", error);
      alert("Failed to restart election. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Election Administration
      </h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>Manage elections and candidates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!electionOngoing && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Start a New Election</h3>
              <div className="space-y-2">
                <Label htmlFor="candidates">Candidate Names</Label>
                <Input
                  id="candidates"
                  value={candidatesInput}
                  onChange={(e) => setCandidatesInput(e.target.value)}
                  placeholder="Enter names separated by commas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Election Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={electionDuration ?? ""}
                  onChange={(e) => setElectionDuration(Number(e.target.value))}
                  placeholder="Enter duration in minutes"
                />
              </div>
              <Button onClick={handleStartElection} className="w-full">
                Start Election
              </Button>
            </div>
          )}
          {electionOngoing && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Add a New Candidate</h3>
                <div className="space-y-2">
                  <Label htmlFor="newCandidate">Candidate Name</Label>
                  <Input
                    id="newCandidate"
                    value={newCandidate}
                    onChange={(e) => setNewCandidate(e.target.value)}
                    placeholder="Enter candidate name"
                  />
                </div>
                <Button
                  onClick={handleAddCandidate}
                  variant="secondary"
                  className="w-full"
                >
                  Add Candidate
                </Button>
              </div>
            </>
          )}
          {electionOngoing && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Restart election</h3>
                <Button
                  onClick={handleEndElection}
                  variant="destructive"
                  className="w-full"
                >
                  Restart Election
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPanel;
