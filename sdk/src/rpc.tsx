// rpc/customRpc.ts
export const customRpc = {
  async request({ method, params }: { method: string; params?: unknown[] }) {
    const response = await fetch('http://192.168.1.79:8545', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params: params ?? [],
      }),
    })

    const json = await response.json()

    if (json.error) {
      throw new Error(json.error.message)
    }

    return json.result
  },
}
