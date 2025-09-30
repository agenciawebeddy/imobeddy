// Fix for TypeScript error: Cast newStatus to string to allow comparison
else if (oldStatus === 'Vendido' && (newStatus as string) !== 'Vendido') { // Cast to string to allow comparison
  const { error: propertyError } = await supabase
    // ... rest of the code
}