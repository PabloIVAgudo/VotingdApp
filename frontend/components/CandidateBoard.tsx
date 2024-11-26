import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "./ui/separator";

type Candidate = {
  id: number;
  name: string;
};

type Props = {
  candidates: Candidate[];
};

const CandidateBoard: React.FC<Props> = ({ candidates }) => {
  return (
    <div className="p-8">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Candidates</h1>
        <Card className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-2xl mx-auto bg-gray-800 text-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-100">
              Candidate Board
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">ID No.</TableHead>
                  <TableHead className="text-gray-300">Candidate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="text-gray-300">
                      {candidate.id}
                    </TableCell>
                    <TableCell className="text-gray-100">
                      {candidate.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Separator className="container mx-auto" />
    </div>
  );
};

export default CandidateBoard;
