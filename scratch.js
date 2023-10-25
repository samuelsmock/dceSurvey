let csvText = `choiceCard,a_quant,a_comp,a_HNV,a_priceFactor,b_quant,b_comp,b_HNV,b_priceFactor
            1,75,FALSE,TRUE,1.5,0,TRUE,FALSE,2
            2,25,TRUE,FALSE,2,75,FALSE,TRUE,3
            3,50,TRUE,TRUE,2.5,50,FALSE,FALSE,4
            4,0,FALSE,FALSE,3,75,TRUE,TRUE,2
            5,10,FALSE,FALSE,2,75,TRUE,TRUE,1.5
            6,50,TRUE,TRUE,1.5,50,FALSE,FALSE,2`;

function parseCSV(csv) {
    const lines = csv.split('\n'); // an array of lines in dictionary
    const headers = lines[0].split(',').map(header => header.trim());
    const oneDimensionalData = [];
  
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      const entry = { };
  
      for (let j = 0; j < headers.length; j++) {
        entry[headers[j]] = row[j].trim();
      }
      
      oneDimensionalData.push(entry);
      
    }
  
  /* oneDimensionalData now consists of an array. Each element is 1 choice card and a 
  dictionary with prefixes key values(eg a_comp). Next, we further unpack this to have a 
  two dimensional dictionary for each choice card ie {a: {comp: 23; }....}
  */
      let twoDimensionalData = [];
      for (let i =0; i < oneDimensionalData.length; i++){
          const outputDict = {  };
  
      for (const key in oneDimensionalData[i]) {
          // Check if the key starts with "a_" or "b_"
          if (key.startsWith("a_") || key.startsWith("b_")) {
              // Get the prefix (either "a" or "b")
              const prefix = key.charAt(0);
  
              // Remove the prefix and underscore to get the key without prefix
              const keyWithoutPrefix = key.split('_')[1];
  
              // If the output dictionary doesn't have an entry for the prefix, create one
              if (!outputDict[prefix]) {
                  outputDict[prefix] = {  };
              }
  
              // Add the value to the output dictionary in a way that type casts booleans and floats correctly
              if (oneDimensionalData[i][key] === "TRUE" || oneDimensionalData[i][key] === "FALSE"){
                  outputDict[prefix][keyWithoutPrefix] = (oneDimensionalData[i][key] ==="TRUE") ? true : false;
              }else if (!isNaN(oneDimensionalData[i][key])) {
                  outputDict[prefix][keyWithoutPrefix] = parseFloat(oneDimensionalData[i][key]);
              } else {
              outputDict[prefix][keyWithoutPrefix] = (oneDimensionalData[i][key]); // If it doesn't match any known type, return the string itself
              }
  
          }  
      }
      twoDimensionalData.push(outputDict);
      }
      return twoDimensionalData;
  }
  
  let csaOptions = parseCSV(csvText)[choiceCardNumber]; // assign 
  