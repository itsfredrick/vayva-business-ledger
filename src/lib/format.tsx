
export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function Money({ amount }: { amount: number }) {
    if (typeof amount !== 'number') return null;
    return <>{ formatCurrency(amount) } </>;
}
