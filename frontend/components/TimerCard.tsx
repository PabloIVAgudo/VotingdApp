import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Separator } from "./ui/separator";

interface TimerCardProps {
  readContract: ethers.Contract | null;
}

const TimerCard: React.FC<TimerCardProps> = ({ readContract }) => {
  const [electionTimeLeft, setElectionTimeLeft] = useState<any>(null);

  useEffect(() => {
    const getTimeLeft = async () => {
      if (!readContract) return;

      const timeLeftData = await readContract.electionTimer();
      setElectionTimeLeft(timeLeftData);
    };
    getTimeLeft();
  }, []);

  return (
    <div className="container mx-auto my-5 text-center">
      <p className="mb-5">
        Time left to vote:{" "}
        <span>{Math.round(Number(electionTimeLeft) / 60)}</span> minutes.
      </p>
      <Separator className="container mx-auto" />
    </div>
  );
};

export default TimerCard;
