import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function Account() {
  const { address, chainId } = useAccount()
  const { disconnect } = useDisconnect()

  // Only fetch ENS data if on Mainnet and we have an address
  const shouldFetchEns = chainId === 1 && !!address

  // ENS Name
  const { data: ensName } = useEnsName({
    address: shouldFetchEns ? address : undefined,
    chainId: shouldFetchEns ? 1 : undefined,
  })

  // ENS Avatar
  const { data: ensAvatar } = useEnsAvatar({
    name: shouldFetchEns && ensName ? ensName : undefined,
  })

  return (
    <div>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && (
        <div>
          {ensName ? `${ensName} (${address})` : address}
        </div>
      )}
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  )
}
