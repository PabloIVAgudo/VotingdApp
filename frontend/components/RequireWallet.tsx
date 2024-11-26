import React from "react";
import { useWallet } from "@/context/WalletContext";

interface RequireWalletProps {
  children: React.ReactNode;
  requiredChainId: string;
}

const RequireWallet: React.FC<RequireWalletProps> = ({
  children,
  requiredChainId,
}) => {
  const { isConnected, connectWallet, chainId } = useWallet();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="mb-4 text-lg font-semibold">
          Please connect your MetaMask wallet to access this page.
        </p>
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (chainId !== requiredChainId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="mb-4 text-lg font-semibold">
          Please switch to the correct network.
        </p>
        <p className="mb-2">Required Chain ID: {requiredChainId}</p>
        <p>Your Chain ID: {chainId}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireWallet;
