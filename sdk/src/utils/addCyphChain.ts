export async function addCyphChain() {
  const provider = (window as any).ethereum;
  if (!provider) {
    throw new Error("MetaMask not found");
  }

  try {
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x141e", // 5150 in hex
          chainName: "Cyph Local",
          nativeCurrency: {
            name: "Cypher Token",
            symbol: "CYPH",
            decimals: 18,
          },
          rpcUrls: ["http://localhost:8545"],
          blockExplorerUrls: [], // Optional
        },
      ],
    });
  } catch (err) {
    console.error("Failed to add network", err);
  }
}
