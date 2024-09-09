function getYearlyGenderData(dataArray) {
    const result = {};
  
    dataArray.forEach((entry) => {
      const year = new Date(entry.data.startDate).getFullYear();
      const gender = entry.data.sex;
  
      // Initialize year in result if not already present
      if (!result[year]) {
        result[year] = { male: 0, female: 0, unknown: 0 };
      }
  
      // Update the count based on sex
      if (gender === 'male') {
        result[year].male += 1;
      } else if (gender === 'female') {
        result[year].female += 1;
      } else {
        result[year].unknown += 1; // For entries without a specified or other gender
      }
    });
  
    return result;
}

export default getYearlyGenderData;