// rpc/customRpc.ts

const RPC_URL = 'http://192.168.1.79:8545'

// Utility: sleep for retry delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const CypherNode = {
  async request({ method, params }: { method: string; params?: unknown[] }, retryCount = 2): Promise<any> {
    const requestBody = {
      jsonrpc: '2.0',
      id: 1,
      method,
      params: params ?? [],
    }

    // ✅ Log request in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('[customRpc] ➜', method, params)
    }

    try {
      const response = await fetch(RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const json = await response.json()

      // Log full response in dev
      if (process.env.NODE_ENV === 'development') {
        console.log('[customRpc] ⇦', JSON.stringify(json, null, 2))
      }

      if (json.error) {
        throw new Error(`[RPC Error] ${json.error.message || 'Unknown error'}`)
      }

      return json.result
    } catch (error: any) {
      // If retries left, attempt again
      if (retryCount > 0) {
        console.warn(`[customRpc] Request failed. Retrying... (${retryCount})`, error)
        await delay(300) // wait 300ms before retry
        return this.request({ method, params }, retryCount - 1)
      }

      // Final failure
      console.error('[customRpc] RPC call failed:', method, params, error)
      throw new Error(`[customRpc] Failed RPC call to ${method}: ${error.message || error}`)
    }
  },
}
