import type { Address } from 'viem'
import { type BaseError, useReadContracts } from 'wagmi'


// Define your contract config here (ideally move to a separate file)
const wagmiContractConfig = {
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2' as Address,
  abi: [
    {
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'owner', type: 'address' }],
      outputs: [{ name: '', type: 'uint256' }],
    },
    {
      name: 'ownerOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'tokenId', type: 'uint256' }],
      outputs: [{ name: '', type: 'address' }],
    },
    {
      name: 'totalSupply',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: '', type: 'uint256' }],
    },
  ] as const,
}

export function ReadContract() {
  const { 
    data,
    error,
    isPending
  } = useReadContracts({ 
    contracts: [{ 
      ...wagmiContractConfig,
      functionName: 'balanceOf',
      args: ['0x03A71968491d55603FFe1b11A9e23eF013f75bCF'],
    }, { 
      ...wagmiContractConfig, 
      functionName: 'ownerOf', 
      args: [69n], 
    }, { 
      ...wagmiContractConfig, 
      functionName: 'totalSupply', 
    }] 
  }) 

  const [balance, ownerOf, totalSupply] = data || [] 

  if (isPending) return <div>Loading...</div>

  if (error)
    return (
      <div>
        Error: {(error as BaseError).shortMessage || error.message}
      </div>
    ) 

  return (
    <>
      <div>Balance: {balance?.result?.toString()}</div>
      <div>Owner of Token 69: {ownerOf?.result?.toString()}</div> 
      <div>Total Supply: {totalSupply?.result?.toString()}</div> 
    </>
  )
}
