function getAverageTreatmentTimePerYear(dataArray) {
    const treatmentTimes = {};
  
    dataArray.forEach((entry) => {
      if (entry.data.endDate && entry.data.status === 'cured') {
        const startDate = new Date(entry.data.startDate);
        const endDate = new Date(entry.data.endDate);
        const year = startDate.getFullYear();
  
        // Calculate treatment time in days
        const treatmentTime = (endDate - startDate) / (1000 * 60 * 60 * 24);
  
        // Initialize year in the treatmentTimes object if not present
        if (!treatmentTimes[year]) {
          treatmentTimes[year] = {
            totalTreatmentTime: 0,
            casesCount: 0,
          };
        }
  
        // Add treatment time and increment case count for the year the treatment started
        treatmentTimes[year].totalTreatmentTime += treatmentTime;
        treatmentTimes[year].casesCount += 1;
      }
    });
  
    // Calculate average treatment time per year in days
    const averageTreatmentTimes = {};
    Object.keys(treatmentTimes).forEach((year) => {
      const { totalTreatmentTime, casesCount } = treatmentTimes[year];
      averageTreatmentTimes[year] = totalTreatmentTime / casesCount;
    });
  
    return averageTreatmentTimes;
}

export default getAverageTreatmentTimePerYear;