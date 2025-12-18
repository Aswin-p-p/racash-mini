// Format currency with symbol
export const formatCurrency = (amount, currency) => {
    const symbols = {
        USD: '$',
        KES: 'KSh',
        ETB: 'Br',
        SOS: 'Sh',
    };

    const symbol = symbols[currency] || currency;
    const formattedAmount = parseFloat(amount).toFixed(2);

    return `${symbol} ${formattedAmount}`;
};

// Format date to readable string
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Format phone number
export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Format as +XXX XXX XXX XXX
    if (cleaned.length > 10) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    }
    return phone;
};

// Get transaction status color
export const getStatusColor = (status) => {
    const colors = {
        PENDING: '#f59e0b',
        PROCESSING: '#3b82f6',
        COMPLETED: '#10b981',
        FAILED: '#ef4444',
        APPROVED: '#10b981',
        REJECTED: '#ef4444',
    };
    return colors[status] || '#6b7280';
};

// Get transaction type color
export const getTypeColor = (type) => {
    return type === 'DEPOSIT' ? '#10b981' : '#ef4444';
};
