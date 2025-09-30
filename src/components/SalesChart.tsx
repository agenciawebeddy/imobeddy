// Fix for TypeScript error: Cast the array access safely
sales.forEach(sale => {
  const price = (sale.properties as { price: number; }[])[0]?.price; // Access first element and cast array item
  if (price) {
    // ... rest of the code
  }
});