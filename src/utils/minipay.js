import React from 'react';

/**
 * Detect if the app is running inside MiniPay
 */
export const isMiniPay = () => {
    // Check for MiniPay-specific properties
    if (typeof window === 'undefined') return false;

    return (
        window.ethereum &&
        (window.ethereum.isMiniPay ||
            window.navigator.userAgent.includes('MiniPay') ||
            window.navigator.userAgent.includes('Opera Mini'))
    );
};

/**
 * Get the user's wallet address from MiniPay
 */
export const getWalletAddress = async () => {
    if (!window.ethereum) {
        throw new Error('No Web3 provider found. Please open this app in MiniPay.');
    }

    try {
        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found');
        }

        return accounts[0].toLowerCase(); // Return lowercase for consistency
    } catch (error) {
        if (error.code === 4001) {
            throw new Error('User rejected the connection request');
        }
        throw error;
    }
};

/**
 * Check if wallet is connected
 */
export const isWalletConnected = async () => {
    if (!window.ethereum) return false;

    try {
        const accounts = await window.ethereum.request({
            method: 'eth_accounts'
        });
        return accounts && accounts.length > 0;
    } catch (error) {
        return false;
    }
};

/**
 * Listen for account changes
 */
export const onAccountsChanged = (callback) => {
    if (!window.ethereum) return;

    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
            callback(accounts[0].toLowerCase());
        } else {
            callback(null);
        }
    });
};

/**
 * Format wallet address for display
 */
export const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Get cUSD Balance from Blockchain
 * Checks both Mainnet and Alfajores Testnet
 */
export const getMiniPayBalance = async (address) => {
    if (!address) return '0.00';

    const cleanAddress = address.replace("0x", "");
    // ERC20 balanceOf signature hash: 70a08231 + padding (24 zeros)
    const data = "0x70a08231" + "000000000000000000000000" + cleanAddress;

    const fetchBalance = async (rpcUrl, contractAddress) => {
        try {
            const response = await fetch(rpcUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "eth_call",
                    params: [{
                        to: contractAddress,
                        data: data
                    }, "latest"],
                    id: 1
                })
            });
            const result = await response.json();
            if (result.error) return 0;
            return Number(BigInt(result.result)) / 1e18;
        } catch (e) {
            console.error("RPC Fetch Error:", e);
            return 0;
        }
    };

    // Helper for Native Balance (eth_getBalance)
    const fetchNativeBalance = async (rpcUrl) => {
        try {
            const response = await fetch(rpcUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "eth_getBalance",
                    params: [address, "latest"],
                    id: 1
                })
            });
            const result = await response.json();
            if (result.error) return 0;
            return Number(BigInt(result.result)) / 1e18;
        } catch (e) {
            return 0;
        }
    };

    // 1. Check Celo Mainnet cUSD
    const mainnetBal = await fetchBalance('https://forno.celo.org', "0x765DE816845861e75A25fCA122bb6898B8B1282a");
    if (mainnetBal > 0) return mainnetBal.toFixed(2);

    // 2. Check Alfajores Testnet cUSD
    const testnetBal = await fetchBalance('https://alfajores-forno.celo-testnet.org', "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1");
    if (testnetBal > 0) return testnetBal.toFixed(2);

    // 3. Check Native CELO Balance (Mainnet) - maybe they have CELO?
    // Note: This is desperate measure to confirm connectivity
    const nativeBal = await fetchNativeBalance('https://forno.celo.org');
    if (nativeBal > 0) return nativeBal.toFixed(2);

    return '0.00';
};
