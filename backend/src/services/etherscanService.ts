// backend/services/etherscanService.ts
import axios from 'axios'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const BASE_URL = 'https://api.etherscan.io/api'

export async function getNativeBalance(address: string): Promise<string> {
  const url = `${BASE_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`

  const response = await axios.get(url)
  const result = response.data

  if (result.status !== '1') {
    throw new Error(`Failed to fetch balance: ${result.message}`)
  }

  return result.result // In wei (string)
}
