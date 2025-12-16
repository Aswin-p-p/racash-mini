import { ethers } from "ethers";

export const CUSD_CONTRACT =
  "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // Celo Mainnet

export const CUSD_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)"
];

export const connectMiniPay = async () => {
  if (!window.ethereum) {
    throw new Error("Please open this app in Opera MiniPay");
  }
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts[0];
};

export const sendCUSD = async (merchantAddress, amountUSD) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CUSD_CONTRACT, CUSD_ABI, signer);

  const amountWei = ethers.utils.parseUnits(amountUSD.toString(), 18);
  const tx = await contract.transfer(merchantAddress, amountWei);
  await tx.wait();

  return tx.hash;
};
