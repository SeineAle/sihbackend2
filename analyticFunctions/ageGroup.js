function getAgeGroupData(dataArray) {
    const result = {
      '0-5 (Kids)': 0,
      '6-12 (Children)': 0,
      '13-19 (Teenagers)': 0,
      '20-35 (Young Adults)': 0,
      '36-50 (Adults)': 0,
      '51-65 (Middle Aged)': 0,
      '66+ (Seniors)': 0
    };
  
    dataArray.forEach((entry) => {
      const age = parseInt(entry.data.age);
  
      if (age >= 0 && age <= 5) {
        result['0-5 (Kids)'] += 1;
      } else if (age >= 6 && age <= 12) {
        result['6-12 (Children)'] += 1;
      } else if (age >= 13 && age <= 19) {
        result['13-19 (Teenagers)'] += 1;
      } else if (age >= 20 && age <= 35) {
        result['20-35 (Young Adults)'] += 1;
      } else if (age >= 36 && age <= 50) {
        result['36-50 (Adults)'] += 1;
      } else if (age >= 51 && age <= 65) {
        result['51-65 (Middle Aged)'] += 1;
      } else if (age >= 66) {
        result['66+ (Seniors)'] += 1;
      }
    });
  
    return result;
  }

export default getAgeGroupData;