import { ethers } from 'ethers'
import api from '../api/axios'

export const connectAndLogin = async () => {
  if (!window.ethereum) {
    alert('Please open in Opera MiniPay')
    return
  }
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const wallet_address = accounts[0]

  const res = await api.post('/users/wallet-auth/', { wallet_address })
  const { access, refresh } = res.data.tokens
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
  return res.data.user
}

export const depositCUSD = async (amount) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(
    "0x765DE816845861e75A25fCA122bb6898B8B1282a",
    ["function transfer(address to, uint256 amount) returns (bool)"],
    signer
  )
  const wei = ethers.utils.parseUnits(amount, 18)
  const tx = await contract.transfer("0xYOUR_MERCHANT_ADDRESS", wei)
  await tx.wait()
  return tx.hash
}
