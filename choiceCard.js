    /* this refers to the row of your csa 
     characteristics table
    and is zero indexed */

    let choiceCardNumber = 1; 
     
     
     /* This script Does Several things:
    
    1: Loads the selected products from the 1st question, basketBuilder (which is pulled in via the HTML under <div id = 'basket'/>) 
    2: Dynamically populates the basket back into the html file in a big circle. This is necessary because the experiment design involves makeing changes
        to this for quantity and compositional risk visualization
    3: Looks up desired attributes for CSA A and CSA B for each choice card. Again, because of how limesurvey works, this is done in the HTML
        (<div id = 'csa-attributes'/>)
    4: Looks up price data for each type of product. These are taken to be grocery store base prices and are scaled as an attribute of
        of each CSA under the key "priceFactor" 

    Notes:
    -The Image URLS are Stored here in the JavaScript in contrast to the basketBuilder , where the 
    image urls where contained in the html.

    - The massive csvParser function relies on correctly formated data in the hidden limesurvey question with id 
    'csaAttributes' there is a template file in the resources tab of the survey's settings, but the columns are in order:
    choiceCard	a_quant	a_comp	a_HNV	a_priceFactor	b_quant	b_comp	b_HNV	b_priceFactor
******************************************************/


/* these variables are used for external development environments *************************
    //let csvText = (document.getElementById('csa-attributes').textContent).replace(/\n/g, "\\n");
    
    console.log('made it here');
    let itemList =(document.getElementById('basket').textContent.split(','));
    var productURLs = { 
        'Hard Cheese': "/upload/surveys/996739/images/picture1.png",
        'Yogurt': "/upload/surveys/996739/images/picture2.png",
        'Milk': "/upload/surveys/996739/images/picture3.png",
        'Soft Cheese': "/upload/surveys/996739/images/picture4.png",
        'Butter': "/upload/surveys/996739/images/picture5.png",
     };
     var HNVurls = ['/upload/surveys/996739/images/Screen%20Shot%202023-10-17%20at%2012.21.18%20PM.png', 
     '/upload/surveys/996739/images/Screen%20Shot%202023-10-17%20at%2012.21.37%20PM.png'];
*****************************************/


    let csvText = `choiceCard,a_quant,a_comp,a_HNV,a_priceFactor,b_quant,b_comp,b_HNV,b_priceFactor
            1,75,FALSE,TRUE,1.5,0,TRUE,FALSE,2
            2,25,TRUE,FALSE,2,75,FALSE,TRUE,3
            3,50,TRUE,TRUE,2.5,50,FALSE,FALSE,4
            4,0,FALSE,FALSE,3,75,TRUE,TRUE,2
            5,10,FALSE,FALSE,2,75,TRUE,TRUE,1.5
            6,50,TRUE,TRUE,1.5,50,FALSE,FALSE,2`;

    let itemList = ['Yogurt','Milk','Soft Cheese','Milk','Yogurt','Butter']
    
    var productURLs = { 
        'Hard Cheese': "https://fastly.picsum.photos/id/80/200/200.jpg?hmac=uEQ6yExxeaopTOWf3oByB8KMH6Eip3-AVLN5jEMthko",
        'Yogurt': "https://fastly.picsum.photos/id/80/200/200.jpg?hmac=uEQ6yExxeaopTOWf3oByB8KMH6Eip3-AVLN5jEMthko",
        'Milk': "https://fastly.picsum.photos/id/80/200/200.jpg?hmac=uEQ6yExxeaopTOWf3oByB8KMH6Eip3-AVLN5jEMthko",
        'Soft Cheese': "https://fastly.picsum.photos/id/80/200/200.jpg?hmac=uEQ6yExxeaopTOWf3oByB8KMH6Eip3-AVLN5jEMthko",
        'Butter': "https://fastly.picsum.photos/id/80/200/200.jpg?hmac=uEQ6yExxeaopTOWf3oByB8KMH6Eip3-AVLN5jEMthko",
     }

     var HNVurls = ['https://fastly.picsum.photos/id/80/200/200.jpg?hmac=uEQ6yExxeaopTOWf3oByB8KMH6Eip3-AVLN5jEMthko', 
     'https://fastly.picsum.photos/id/955/200/200.jpg?hmac=_m3ln1pswsR9s9hWuWrwY_O6N4wizKmukfhvyaTrkjE'];


    //it is difficult to pass JavaScript dictionaries between questions in limesurvey due to issues with
    //brackets. Therefore we pass the basket as a list and unpack to a dictionary
    // more info on bracket issue effecting JS dictionaries in LimeSurvey can be found here:
    //https://manual.limesurvey.org/Workarounds:_Manipulating_a_survey_at_runtime_using_Javascript

    
    let basket = {  };  // note the extra spaces

    /*this script works by building an example html element that is later hidden. 
    It is used for the visualization requirements of the quantity and composition aspects of csa pairs
    */
    let hiddenCircle = document.getElementById('hiddenCircle'); 
    
   


    let storePrices = { ///hard coded for now, could later be imported
        "Milk": 1,
        'Yogurt': 5,
        'Cottage Cheese': 5,
        'Soft Cheese': 3,
        'Cream Cheese': 4
    };

    //unpack the list to a count dictionary
    for (var item of itemList){
        if(basket.hasOwnProperty(item)){
            basket[item]+= 1;
        }else{
            basket[item] = 1;
        }
    }
    
 
    
 /* Function to parse CSV and convert it into a usable array of dictionaries, with each array element being one possible
 comparison of 2 CSAs. The value is the attributes of each csa (a and b)
 This may seem like a lot, but it is just mucking through parsing the csv which is only text into a
 usable array of dictionaries witht the correct variable types*/

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
        const outputDict = {};

        for (const key in oneDimensionalData[i]) {
            // Check if the key starts with "a_" or "b_"
            if (key.startsWith("a_") || key.startsWith("b_")) {
                // Get the prefix (either "a" or "b")
                const prefix = key.charAt(0);

                // Remove the prefix and underscore to get the key without prefix
                const keyWithoutPrefix = key.split('_')[1];

                // If the output dictionary doesn't have an entry for the prefix, create one
                if (!outputDict[prefix]) {
                    outputDict[prefix] = {};
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

console.log(csaOptions);

    // populate hidden circle with basket items
    
    for (const item in basket){
        let stackedWrapper = document.createElement('div');
        stackedWrapper.id = item + '-parent';
        stackedWrapper.className = 'selectedImageWrapper';

        const quantity = document.createElement('span');
        quantity.id = item + '-overlay';
        quantity.className = 'overlayText';
        quantity.innerHTML = basket[item] + 'x';
        
        const imageElement = document.createElement('img');
        imageElement.src = productURLs[item];
        imageElement.setAttribute('id', item + '-dropped');
        imageElement.setAttribute('class', 'multiple-product');

        stackedWrapper.appendChild(imageElement);
        stackedWrapper.appendChild(quantity);

        hiddenCircle.appendChild(stackedWrapper);      
    }

    let usableCircleDiv = hiddenCircle.cloneNode(true);
    hiddenCircle.style.display = 'none';
    

    // This function calculates the grocery store Cost of all products in the basket
    function priceCalculator(shoppingCart, priceList){
        let storeNet = 0;
        for (const product in priceList){
            if (basket.hasOwnProperty(product)){
                storeNet += storePrices[product] * shoppingCart[product];
            }
        }
        return storeNet;
    }

    /*takes in an html node pointing to a hideen circle
    already populated with item image and counters and returns an html node with the the information on quantity risk
    displayed dynamically */

    function quantityVisualizer(baseCircleElement, quantityVariation){
        
        //clone the cricle to avoid altering the original but remove the id
        const circleClone = baseCircleElement.cloneNode(true);

        circleClone.removeAttribute('id');
        circleClone.className = 'quantityCircle';

        let baseCircleWidth = 8; // intended to be used with vw so that in the extreme case of 100% quantity variation, you have room for all 3 circles

        if (quantityVariation === 0){
            const quantityWrapper = document.createElement('div');
            quantityWrapper.className = 'quantityWrapper';

            circleClone.style.width = baseCircleWidth + 'vw';
            circleClone.style.height = baseCircleWidth + 'vw';

            quantityWrapper.appendChild(circleClone);


            return quantityWrapper; // the circle and all child divs are dynamically sized in CSS to fit in whatever div they are placed
        }else{
            //create a new div "quantityWrapper" with 3 circles that are physically bigger or smaller by the variation listed
           const quantityWrapper = document.createElement('div');
           quantityWrapper.className = 'quantityWrapper';

           /*this is a workaround so that we can dynamically size the child circles in pixels based on the 
           width of the cell in the choice cards*/

           //const quantityWrapperWidthPX = ();
           

          
           
           circleClone.style.width = baseCircleWidth + "vw"; 
           circleClone.style.height = baseCircleWidth + 'vw';
            
         
          
           //add small circle
           const smallCircle = circleClone.cloneNode(true);
           smallCircle.style.width = Math.sqrt(1-(quantityVariation/100)) * baseCircleWidth + 'vw';   // radii are scaled so that the area ~(r2) cooresponds to quantity
           smallCircle.style.height = Math.sqrt(1-(quantityVariation/100)) * baseCircleWidth + 'vw';

           //add large circle
           const largeCircle = circleClone.cloneNode(true);
           largeCircle.style.width = Math.sqrt(1+(quantityVariation/100)) * baseCircleWidth + 'vw';
           largeCircle.style.height = Math.sqrt(1+(quantityVariation/100)) * baseCircleWidth + 'vw';

           quantityWrapper.appendChild(smallCircle);
           quantityWrapper.appendChild(circleClone);
           quantityWrapper.appendChild(largeCircle);

        

           return quantityWrapper;

        }
    }

    function compositionVisualizer(baseCircleElement, compositionBoolean){
        
        //clone the cricle to avoid altering the original but remove the id
        const circleClone = baseCircleElement.cloneNode(true);

        circleClone.removeAttribute('id');
        circleClone.className = 'compositionCircle';

        let baseCircleWidth = 8; // intended to be used with vw
        let compositionWrapper = document.createElement('div');
        compositionWrapper.className = "compositionWrapper";

        if(compositionBoolean === false){
            circleClone.style.width = baseCircleWidth + 'vw';
            circleClone.style.height = baseCircleWidth + 'vw';

            const symbol = document.createElement('text');
            symbol.innerHTML = '&#x2713'; // hex unicode for a checkmark
            symbol.id = 'green-check';
            
            compositionWrapper.appendChild(circleClone);
            compositionWrapper.appendChild(symbol);

            return compositionWrapper;
        }else if (compositionBoolean === true){
            circleClone.style.width = baseCircleWidth + 'vw';
            circleClone.style.height = baseCircleWidth + 'vw';

            /*find the first item in the basket and remove it
            this must be done twice, because limeSurvey inserts a blank space
            between circleMissingItem parent div and the class= selectedImageWrapper
            which is what we are trying to delete*/ 
            
            let circleMissingItem = circleClone.cloneNode(true);
            circleMissingItem.id = 'circleMissingItem';
            
            let itemToRemove = circleMissingItem.firstChild;
           
            
            if(itemToRemove){
                circleMissingItem.removeChild(itemToRemove);
                
                
            }
    
            if(itemToRemove.nodeName == '#text'){
                let nextToRemove = circleMissingItem.firstChild;
                circleMissingItem.removeChild(nextToRemove);
            }
            
            const symbol = document.createElement('text');
            symbol.innerHTML = '?';
            symbol.id = 'red-question';

            compositionWrapper.appendChild(circleClone);
            compositionWrapper.appendChild(symbol);
            compositionWrapper.appendChild(circleMissingItem);

            return compositionWrapper;
        }

    }

    //this script dynamically populates the table with the quantity visualizers and calculated price
    for (const csa in csaOptions) {
        

        // a nested loop runs through both csas and then all 4 characteristics
        for (const key in csaOptions[csa]) {

            //console.log(`${ key }-${ csa }`);
            const cell = document.getElementById(`${ key }-${ csa }`);
            if (key === 'priceFactor'){
                cell.textContent = csaOptions[csa][key]*priceCalculator(basket, storePrices) + '€';
            } 
            else if(key === 'HNV'){
                if (key){   
                    const imgElement = document.createElement('img');
                    imgElement.src = (csaOptions[csa][key] === true) ? HNVurls[1]: HNVurls[0];
                    cell.appendChild(imgElement);}
            }else if (key === 'quant'){
                
                cell.appendChild(quantityVisualizer(usableCircleDiv, csaOptions[csa][key]));
                
                let span = document.createElement('div');
                span.className = 'quantityArrow';
                span.innerHTML = (csaOptions[csa][key] == 0 ) ? 'No Quantity Risk': "<---- +/- " + csaOptions[csa][key] + "% ------->";
               
                cell.appendChild(span);
            } else if (key == 'comp'){

                cell.appendChild(compositionVisualizer(usableCircleDiv, csaOptions[csa][key]))

            }else{
                cell.textContent = csaOptions[csa][key];
            }
        }
    }

    let choice = '';

    // Function to handle radio button change
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', function () {
            choice = this.value;
            csaOptions['preference'] = choice;
        });
    });

    //return the characteristics of each csa, plus the preference all in one dict.
    //$("#answer{SGQ}").val(csaOptions).trigger('keyup'); 