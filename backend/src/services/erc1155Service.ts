import { ethers } from 'ethers'
import ERC1155_ABI from '../abis/erc1155.json'
import fetch from 'node-fetch'
import { resolveIPFS } from '../utils/ipfsHelper'

const RPC_URL = process.env.RPC_URL!
const provider = new ethers.JsonRpcProvider(RPC_URL)

// Common ERC-1155 Transfer events
const TRANSFER_SINGLE_TOPIC = ethers.id("TransferSingle(address,address,address,uint256,uint256)")
const TRANSFER_BATCH_TOPIC = ethers.id("TransferBatch(address,address,address,uint256[],uint256[])")

interface ERC1155NFT {
  contractAddress: string
  tokenId: string
  tokenURI: string
  metadata?: any
}

export async function fetchDynamicERC1155NFTs(userAddress: string): Promise<ERC1155NFT[]> {
  const fromBlock = 0
  const toBlock = 'latest'

  const tokenMap = new Map<string, Set<string>>() // contract => tokenIds

  const paddedAddress = ethers.zeroPadValue(userAddress, 32)

  const filterSingleFrom = {
    fromBlock,
    toBlock,
    topics: [
      TRANSFER_SINGLE_TOPIC,
      null,
      paddedAddress, // from
    ],
  }

  const filterSingleTo = {
    fromBlock,
    toBlock,
    topics: [
      TRANSFER_SINGLE_TOPIC,
      null,
      null,
      paddedAddress, // to
    ],
  }

  const filterBatchFrom = {
    fromBlock,
    toBlock,
    topics: [
      TRANSFER_BATCH_TOPIC,
      null,
      paddedAddress,
    ],
  }

  const filterBatchTo = {
    fromBlock,
    toBlock,
    topics: [
      TRANSFER_BATCH_TOPIC,
      null,
      null,
      paddedAddress,
    ],
  }

  const logs = [
    ...(await provider.getLogs(filterSingleFrom)),
    ...(await provider.getLogs(filterSingleTo)),
    ...(await provider.getLogs(filterBatchFrom)),
    ...(await provider.getLogs(filterBatchTo)),
  ]

  function addToken(contractAddr: string, tokenId: string) {
    if (!tokenMap.has(contractAddr)) {
      tokenMap.set(contractAddr, new Set())
    }
    tokenMap.get(contractAddr)!.add(tokenId)
  }

  const iface = new ethers.Interface(ERC1155_ABI)

  for (const log of logs) {
    const contractAddress = log.address
    let parsedLog: ethers.LogDescription | null = null

    try {
      parsedLog = iface.parseLog(log)
    } catch (e) {
      console.warn('Failed to parse log', e)
      continue
    }

    if (!parsedLog) continue

    if (parsedLog.name === 'TransferSingle') {
      const tokenId: bigint = parsedLog.args[3] // id
      addToken(contractAddress, tokenId.toString())
    }

    if (parsedLog.name === 'TransferBatch') {
      const tokenIds: bigint[] = parsedLog.args[3] // ids
      for (const id of tokenIds) {
        addToken(contractAddress, id.toString())
      }
    }
  }

  const results: ERC1155NFT[] = []

  for (const [contractAddress, tokenIdSet] of tokenMap.entries()) {
    const contract = new ethers.Contract(contractAddress, ERC1155_ABI, provider)

    for (const tokenId of tokenIdSet) {
      try {
        const balance: bigint = await contract.balanceOf(userAddress, tokenId)
        if (balance > 0n) {
          let tokenURI = ''
          let metadata = null

          try {
            tokenURI = await contract.uri(tokenId)

            // Replace {id} with hex-padded ID if needed
            if (tokenURI.includes('{id}')) {
              const hexId = tokenId.startsWith('0x') ? tokenId : ethers.toBeHex(BigInt(tokenId), 32).slice(2)
              tokenURI = tokenURI.replace('{id}', hexId)
            }

            tokenURI = resolveIPFS(tokenURI)

            const res = await fetch(tokenURI)
            metadata = await res.json()
          } catch (e) {
            console.warn(`Failed to fetch metadata for ${contractAddress} token ${tokenId}`, e)
          }

          results.push({
            contractAddress,
            tokenId,
            tokenURI,
            metadata,
          })
        }
      } catch (e) {
        console.warn(`Error checking balance for ${contractAddress} token ${tokenId}`, e)
      }
    }
  }

  return results
}
