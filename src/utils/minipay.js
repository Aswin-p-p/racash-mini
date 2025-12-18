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
