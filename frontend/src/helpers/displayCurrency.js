const displayBDTCurrency = (num) => {
    const amount = Number(num);
    if (isNaN(amount)) return "৳ 0.00";
    return `৳ ${amount.toFixed(2)}`;
}

export default displayBDTCurrency;
