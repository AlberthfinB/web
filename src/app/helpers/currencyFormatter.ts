export const formatToIDR = (amount: number | string): string => {
    const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
    if (isNaN(numericAmount)) {
      return "Invalid Amount";
    }
  
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, // Tanpa desimal
      maximumFractionDigits: 0,
    }).format(numericAmount);
  };
  