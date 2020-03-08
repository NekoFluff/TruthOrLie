export const ethPriceNow = () => {
  return 230;
}

export const ethToUSD = (eth) => {
  return (eth * ethPriceNow()).toFixed(2);
}