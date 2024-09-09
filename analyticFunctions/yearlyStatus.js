function getYearlyStatusData(dataArray) {
    const result = {};
  
    dataArray.forEach((entry) => {
      const year = new Date(entry.data.startDate).getFullYear();
      const status = entry.data.status;
  
      // Initialize year in result if not already present
      if (!result[year]) {
        result[year] = { active: 0, cured: 0, dead: 0 };
      }
  
      // Update the count based on status
      if (status === 'active') {
        result[year].active += 1;
      } else if (status === 'cured') {
        result[year].cured += 1;
      } else if (status === 'dead') {
        result[year].dead += 1;
      }
    });
  
    return result;
}

export default getYearlyStatusData;