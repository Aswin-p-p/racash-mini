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
 */
export const getMiniPayBalance = async (address) => {
    if (!address) return '0.00';

    // cUSD Contract Address (Celo Mainnet)
    const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

    // cUSD Contract Address (Alfajores Testnet - for testing)
    const CUSD_ALFAJORES = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

    // ERC20 balanceOf signature hash: 70a08231 + padding
    const data = "0x70a08231" + "000000000000000000000000" + address.replace("0x", "");

    try {
        let balanceHex = null;

        // 1. Try window.ethereum first
        if (window.ethereum) {
            try {
                balanceHex = await window.ethereum.request({
                    method: "eth_call",
                    params: [{
                        to: CUSD_ADDRESS,
                        data: data
                    }, "latest"]
                });
            } catch (e) {
                console.warn("window.ethereum fetch failed, trying fallback...", e);
            }
        }

        // 2. Fallback to Public RPC (Mainnet) if step 1 failed
        if (!balanceHex || balanceHex === '0x') {
            const response = await fetch('https://forno.celo.org', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "eth_call",
                    params: [{
                        to: CUSD_ADDRESS,
                        data: data
                    }, "latest"],
                    id: 1
                })
            });
            const result = await response.json();
            balanceHex = result.result;
        }

        if (!balanceHex || balanceHex === '0x') return '0.00';

        // Convert hex to decimal (18 decimals for cUSD)
        const balanceWei = BigInt(balanceHex);
        const balance = Number(balanceWei) / 1e18;

        return balance.toFixed(2);
    } catch (error) {
        console.error("Error fetching MiniPay balance:", error);
        return '0.00';
    }
};
