import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import contractAbi from "./contract_abi.json";

const alchemyProvider = new ethers.AlchemyProvider(
  "homestead",
  process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
);

const contractAddress = process.env.NEXT_CONTRACT_ADDRESS;
const contractABI = contractAbi;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, body } = req;

  try {
    const contract = new ethers.Contract(
      contractAddress!,
      contractABI,
      alchemyProvider
    );

    if (method === "GET" && query.action === "candidates") {
      const candidates = await contract.retrieveVotes();
      const parsedCandidates = candidates.map((candidate: any) => ({
        id: parseInt(candidate[0]),
        name: candidate[1],
        votes: candidate[2] ? parseInt(candidate[2]) : null,
      }));
      res.status(200).json(parsedCandidates);
    } else if (method === "POST" && query.action === "vote") {
      const { candidateId } = body;
      if (!candidateId) {
        res.status(400).json({ error: "Candidate ID is required" });
        return;
      }

      // This requires signer, and it should typically be done in the frontend
      res.status(400).json({
        error: "Vote transactions should be initiated on the frontend.",
      });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
