function getMonthlyCasesDataOverEntireDataset(dataArray) {
    const result = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };
  
    dataArray.forEach((entry) => {
      const startDate = new Date(entry.data.startDate);
      const month = startDate.toLocaleString('default', { month: 'long' });
  
      // Increment the count for the corresponding month
      if (result[month] !== undefined) {
        result[month] += 1;
      }
    });
  
    return result;
}

export default getMonthlyCasesDataOverEntireDataset;