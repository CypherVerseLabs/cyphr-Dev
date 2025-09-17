import { ethers } from 'ethers'
import { id, zeroPadValue } from 'ethers'
import ERC20_ABI from '../abis/erc20.json'

const RPC_URL = process.env.RPC_URL!
const provider = new ethers.JsonRpcProvider(RPC_URL)

export interface TokenBalance {
  token: string
  contractAddress: string
  balance: string
}

const TRANSFER_EVENT_TOPIC = id("Transfer(address,address,uint256)")

export async function fetchDynamicTokenBalances(userAddress: string): Promise<TokenBalance[]> {
  const fromBlock = 0 // You can optimize by specifying a block range or caching
  const toBlock = 'latest'

  // Filter logs where userAddress is sender or receiver
  const filterFrom = {
    fromBlock,
    toBlock,
    topics: [
      TRANSFER_EVENT_TOPIC,
      zeroPadValue(userAddress, 32) // from address
    ]
  }

  const filterTo = {
    fromBlock,
    toBlock,
    topics: [
      TRANSFER_EVENT_TOPIC,
      null,
      zeroPadValue(userAddress, 32) // to address
    ]
  }

  // Fetch logs
  const logsFrom = await provider.getLogs(filterFrom)
  const logsTo = await provider.getLogs(filterTo)

  // Collect unique token contract addresses
  const tokenContractsSet = new Set<string>()
  logsFrom.forEach(log => tokenContractsSet.add(log.address))
  logsTo.forEach(log => tokenContractsSet.add(log.address))

  const balances: TokenBalance[] = []

  for (const tokenAddress of tokenContractsSet) {
    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
      const balanceRaw = await contract.balanceOf(userAddress)
      if (balanceRaw.gt(0)) {
        const decimals = await contract.decimals()
        const symbol = await contract.symbol()
        const balance = ethers.formatUnits(balanceRaw, decimals)

        balances.push({
          token: symbol,
          contractAddress: tokenAddress,
          balance,
        })
      }
    } catch (error) {
      console.warn(`Failed to fetch balance for token ${tokenAddress}:`, error)
    }
  }

  return balances
}
