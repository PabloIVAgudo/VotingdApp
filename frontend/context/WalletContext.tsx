import React, { createContext, useState, useContext, useEffect } from "react";
import { ethers } from "ethers";

interface WalletContextProps {
  isConnected: boolean;
  address: string | null;
  connectWallet: () => Promise<void>;
  chainId: string | null;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  const connectWallet = async () => {
    // @ts-ignore next-line
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to use this app.");
      return;
    }

    try {
      // @ts-ignore next-line
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const network = await provider.getNetwork();

      setIsConnected(true);
      setAddress(userAddress);
      setChainId(network.chainId.toString());
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  useEffect(() => {
    // @ts-ignore next-line
    if (window.ethereum) {
      // @ts-ignore next-line
      window.ethereum.on("accountsChanged", () => {
        setIsConnected(false);
        setAddress(null);
        setChainId(null);
      });
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{ isConnected, address, connectWallet, chainId }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
