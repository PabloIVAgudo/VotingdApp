// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VotingModule = buildModule("VotingModule", (m) => {
  const voting = m.contract("VotingV3");
  return { voting };
});

export default VotingModule;

// VotingModule#Voting - 0x47226Fd42494b0796Ee794b11A0f8129A3312d51
// VotingModule#VotingV2 - 0x6449B303814aBE4aF936b9D3A76E3841B5D806f4
// VotingModule#VotingV3 - 0x0Cff7136de48326D8202f8C0975c85DA951e79F4
