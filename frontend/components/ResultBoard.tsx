import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ethers } from "ethers";

type Result = {
  id: number;
  name: string;
  votes: number;
};

type ResultsProps = {
  readContract: ethers.Contract | null;
};

const ResultBoard: React.FC<ResultsProps> = ({ readContract }) => {
  const [results, setResults] = useState<Result[] | null>(null);

  useEffect(() => {
    const getResults = async () => {
      if (!readContract) return;

      const candidatesData = await readContract.retrieveVotes();
      // @ts-expect-error
      const parsedResults = candidatesData.map((candidate) => ({
        id: parseInt(candidate[0]),
        name: candidate[1],
        votes: parseInt(candidate[2]),
      }));
      setResults(parsedResults);
    };

    getResults();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Election Results</h1>
      <div className="max-w-4xl mx-auto">
        <Card className="w-full bg-gray-800 text-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-100">
              Election Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">ID No.</TableHead>
                  <TableHead className="text-gray-300">Candidate</TableHead>
                  <TableHead className="text-gray-300">Votes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results?.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="text-gray-300">{result.id}</TableCell>
                    <TableCell className="text-gray-100">
                      {result.name}
                    </TableCell>
                    <TableCell className="text-gray-100">
                      {result.votes}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultBoard;
