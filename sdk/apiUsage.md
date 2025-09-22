🔐 Authentication
loginWithEmail
const email = 'user@example.com'

loginWithEmail(email)
  .then(({ token }) => {
    localStorage.setItem('authToken', token)
    console.log('Logged in successfully:', token)
  })
  .catch(console.error)

👤 User Profile
fetchUserProfile
fetchUserProfile()
  .then(profile => {
    console.log('User profile:', profile)
  })
  .catch(console.error)

updateUserProfile
const updatedData = {
  displayName: 'New Name',
  email: 'newemail@example.com',
  avatarFile: selectedFile, // File from input element
}

updateUserProfile(updatedData)
  .then(profile => {
    console.log('Updated profile:', profile)
  })
  .catch(console.error)

deleteUserAccount
deleteUserAccount()
  .then(res => {
    if (res.success) {
      console.log('Account deleted successfully')
    }
  })
  .catch(console.error)

👛 Wallet Management
createUserWallet
const email = 'walletuser@example.com'
const walletAddress = '0x123...abc'
const walletType = 'smart'

createUserWallet(email, walletAddress, walletType)
  .then(response => {
    console.log('Wallet created:', response)
  })
  .catch(console.error)

fetchWallets
fetchWallets(1, 10, 'smart')
  .then(({ wallets }) => {
    console.log('User wallets:', wallets)
  })
  .catch(console.error)

deleteWallet
const walletId = 'abc123'

deleteWallet(walletId)
  .then(res => {
    if (res.success) {
      console.log('Wallet deleted')
    }
  })
  .catch(console.error)

🔁 Admin API
refreshAllENSNames
refreshAllENSNames()
  .then(res => {
    console.log(`Refreshed ${res.refreshed} ENS names`)
  })
  .catch(console.error)

🔗 Wallet Transactions
fetchWalletTransactions
const address = '0xabc...123'

fetchWalletTransactions(address)
  .then(({ transactions }) => {
    console.log('Wallet transactions:', transactions)
  })
  .catch(console.error)

💰 Wallet Asset APIs
fetchNativeBalance
const walletAddress = '0xabc...123'

fetchNativeBalance(walletAddress)
  .then(({ balance }) => {
    console.log(`Native balance: ${balance}`)
  })
  .catch(console.error)

fetchTokenBalances
fetchTokenBalances(walletAddress)
  .then(({ tokens }) => {
    tokens.forEach(token => {
      console.log(`${token.symbol}: ${token.balance}`)
    })
  })
  .catch(console.error)

fetchNFTs
fetchNFTs(walletAddress)
  .then(({ erc721, erc1155 }) => {
    console.log('ERC-721 NFTs:', erc721)
    console.log('ERC-1155 NFTs:', erc1155)
  })
  .catch(console.error)

🧪 Optional: Basic Test Wrapper

To test these functions quickly:

async function testWalletApis() {
  try {
    const token = await loginWithEmail('user@example.com')
    console.log('Logged in:', token)

    const profile = await fetchUserProfile()
    console.log('Profile:', profile)

    const wallets = await fetchWallets()
    console.log('Wallets:', wallets)

    const native = await fetchNativeBalance(wallets.wallets[0].walletAddress)
    console.log('Native Balance:', native.balance)
  } catch (err) {
    console.error('Test failed:', err)
  }
}
