"use client";
import { useState, useEffect } from "react";
import CandidateBoard from "@/components/CandidateBoard";
import VoteForm from "@/components/VoteForm";
import ResultBoard from "@/components/ResultBoard";
import { ethers } from "ethers";
import contractAbi from "@/pages/api/contract_abi.json";
import TimerCard from "@/components/TimerCard";
import AdminPanel from "@/components/AdminPanel";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

type Candidate = {
  id: number;
  name: string;
};

const Home = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [readContract, setReadContract] = useState<ethers.Contract | null>(
    null
  );
  const [writeContract, setWriteContract] = useState<ethers.Contract | null>(
    null
  );
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const contractAddress = process.env.NEXT_CONTRACT_ADDRESS;
  const contractABI = contractAbi;

  useEffect(() => {
    document.documentElement.classList.add("dark");
    const initializeProvider = async () => {
      // @ts-ignore next-line
      if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask to use this dApp");
        return;
      }

      // @ts-ignore next-line
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setConnectedAccount(accounts[0]);

      const network = await provider.getNetwork();
      // @ts-ignore next-line
      if (network.chainId !== BigInt(11155111n)) {
        alert("Please connect to the correct network.");
        return;
      }

      // Writer contract instance
      const signer = provider.getSigner();
      const contractReadInstance = new ethers.Contract(
        contractAddress!,
        contractABI,
        (await signer).provider
      );
      setReadContract(contractReadInstance);

      // Reader contract instance
      const contractWriteInstance = new ethers.Contract(
        contractAddress!,
        contractABI,
        await signer
      );
      setWriteContract(contractWriteInstance);

      fetchCandidates(contractReadInstance);
    };

    initializeProvider();
  }, []);

  const fetchCandidates = async (contract: ethers.Contract) => {
    const candidatesData = await contract.retrieveVotes();
    // @ts-ignore next-line
    const parsedCandidates = candidatesData.map((candidate) => ({
      id: parseInt(candidate[0]),
      name: candidate[1],
    }));
    setCandidates(parsedCandidates);
  };

  const handleVote = async (id: number) => {
    if (!writeContract) {
      alert("Contract is not initialized");
      return;
    }

    try {
      const tx = await writeContract.voteTo(id);
      await tx.wait();
      alert(`Vote cast successfully for Candidate ${id}`);
      fetchCandidates(writeContract);
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to cast vote. Please try again.");
    }
  };

  const handleShowResults = async () => {
    setShowResults(!showResults);
  };

  return (
    <div>
      <div className="container mx-auto pt-5">
        <h1 className="text-3xl font-bold mb-5">Voting dApp</h1>
      </div>
      {connectedAccount ? (
        <>
          <div className="container mx-auto">
            <p>
              Connected Account: {connectedAccount?.slice(0, 6)}...
              {connectedAccount?.slice(-5)}
            </p>
          </div>
          {connectedAccount === process.env.NEXT_SIGNER_ADDRESS && (
            <>
              <AdminPanel
                writeContract={writeContract}
                electionOngoing={candidates.length !== 0}
              />
              <Separator className="container mx-auto" />
            </>
          )}
          {candidates.length === 0 ? (
            <div className="p-8 text-center">
              <div className="container mx-auto my-5">
                <p>There is no election ongoing</p>
              </div>
            </div>
          ) : (
            <TimerCard readContract={readContract} />
          )}
          {candidates.length !== 0 && (
            <>
              <CandidateBoard candidates={candidates} />
              <VoteForm onVote={handleVote} />
              <CardFooter className="w-full flex justify-center">
                {showResults ? (
                  <Button
                    onClick={handleShowResults}
                    className="w-[20vw] bg-red-600 hover:bg-red-700 text-white"
                  >
                    Hide Results
                  </Button>
                ) : (
                  <Button
                    onClick={handleShowResults}
                    className="w-[20vw] bg-green-600 hover:bg-green-700 text-white"
                  >
                    Show Results
                  </Button>
                )}
              </CardFooter>
              {showResults && <ResultBoard readContract={readContract} />}
            </>
          )}
        </>
      ) : (
        <div className="container mx-auto pt-5">
          <p>You must connect your wallet first.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
