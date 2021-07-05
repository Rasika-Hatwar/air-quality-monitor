export const getBadge = (currentValue) => {
  if (currentValue <= 50) return "good";
  if (currentValue > 50 && currentValue <= 100) return "satisfactory";
  if (currentValue > 100 && currentValue <= 200) return "moderate";
  if (currentValue > 200 && currentValue <= 300) return "poor";
  if (currentValue > 300 && currentValue <= 400) return "very-poor";
  if (currentValue > 400 && currentValue <= 500) return "severe";
};
