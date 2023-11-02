    /* this refers to the row of your csa 
     characteristics table (csaCSVText in the custom.js file 
     of the design template)
    It is zero indexed */

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

    - The massive csvParser function is located in custom.js file in the test_solawi design template
    (Konfiguration - > Erweitert -> Designvorlagen -> salewi_test) and
    relies on correctly formated data in the csaCSVText variable
    
    - CSA attributes and baseline prices for each item are stored in 
    this custom.js file
    
******************************************************/
    let itemList =document.getElementById('basket').textContent.split(',');
    let csaDataFromHTML = document.getElementById('hiddenCSAAttributes').innerHTML;
    var productURLs = { 
        'Weichkäse': "/upload/surveys/996739/images/picture1.png",
        'Quark': "/upload/surveys/996739/images/picture2.png",
        'Milch': "/upload/surveys/996739/images/picture3.png",
        'Joghurt': "/upload/surveys/996739/images/picture4.png",
        'Schnittkäse': "/upload/surveys/996739/images/picture5.png",
    };
     var HNVurls = ['/upload/surveys/996739/images/Screen%20Shot%202023-10-17%20at%2012.21.18%20PM.png', 
     '/upload/surveys/996739/images/Screen%20Shot%202023-10-17%20at%2012.21.37%20PM.png'];

    let storePrices = JSON.parse(document.getElementById('hiddenPrices').innerHTML);
    console.log(storePrices);
    
/* these variables are used for external development environments *************************
    let itemList = ['Yogurt','Milk','Soft Cheese','Milk','Yogurt','Butter']
    let csaDataFromHTML = '[{ "a":{ "quant":75,"comp":false,"HNV":true,"priceFactor":1.5 },"b":{ "quant":0,"comp":true,"HNV":false,"priceFactor":2 } },{ "a":{ "quant":25,"comp":true,"HNV":false,"priceFactor":2 },"b":{ "quant":75,"comp":false,"HNV":true,"priceFactor":3 } },{ "a":{ "quant":50,"comp":true,"HNV":true,"priceFactor":2.5 },"b":{ "quant":50,"comp":false,"HNV":false,"priceFactor":4 } },{ "a":{ "quant":0,"comp":false,"HNV":false,"priceFactor":3 },"b":{ "quant":75,"comp":true,"HNV":true,"priceFactor":2 } },{ "a":{ "quant":10,"comp":false,"HNV":false,"priceFactor":2 },"b":{ "quant":75,"comp":true,"HNV":true,"priceFactor":1.5 } },{ "a":{ "quant":50,"comp":true,"HNV":true,"priceFactor":1.5 },"b":{ "quant":50,"comp":false,"HNV":false,"priceFactor":2 } }]'
    var productURLs = { 
        'Hard Cheese': "https://fastly.picsum.photos/id/80/200/200.jpg?hmac=uEQ6yExxeaopTOWf3oByB8KMH6Eip3-AVLN5jEMthko",
        'Yogurt': "https://fastly.picsum.photos/id/80/200/200.jpg?hmac=uEQ6yExxeaopTOWf3oByB8KMH6Eip3-AVLN5jEMthko",
        'Milk': "https://fastly.picsum.photos/id/80/200/200.jpg?hmac=uEQ6yExxeaopTOWf3oByB8KMH6Eip3-AVLN5jEMthko",
        'Soft Cheese': "https://fastly.picsum.photos/id/80/200/200.jpg?hmac=uEQ6yExxeaopTOWf3oByB8KMH6Eip3-AVLN5jEMthko",
        'Butter': "https://fastly.picsum.photos/id/80/200/200.jpg?hmac=uEQ6yExxeaopTOWf3oByB8KMH6Eip3-AVLN5jEMthko",
     }

     var HNVurls = ['https://fastly.picsum.photos/id/80/200/200.jpg?hmac=uEQ6yExxeaopTOWf3oByB8KMH6Eip3-AVLN5jEMthko', 
     'https://fastly.picsum.photos/id/955/200/200.jpg?hmac=_m3ln1pswsR9s9hWuWrwY_O6N4wizKmukfhvyaTrkjE'];
*****************************************/
    
    //hide answer field
    const answerItems = document.querySelectorAll('.answer-item');
    
    answerItems.forEach(item => {
      item.style.display = 'none'; // Hide each element
    });
    
    //it is difficult to pass JavaScript dictionaries between questions in limesurvey due to issues with
    //brackets. Therefore we pass the basket of items as a list and unpack to a dictionary
    // more info on bracket issue effecting JS dictionaries in LimeSurvey can be found here:
    //https://manual.limesurvey.org/Workarounds:_Manipulating_a_survey_at_runtime_using_Javascript
    
    
    let csaOptions = JSON.parse(csaDataFromHTML)[choiceCardNumber]; // assign based on which comparison (row in the csv) we are investigation 
   
    
    let basket = {  };  // note the extra spaces

    /*this script works by building an example html element that is later hidden. 
    It is used for the visualization requirements of the quantity and composition aspects of csa pairs
    */
    let hiddenCircle = document.getElementById('hiddenCircle'); 
    
    //unpack the list to a count dictionary
    for (var item of itemList){
        if(basket.hasOwnProperty(item)){
            basket[item]+= 1;
        }else{
            basket[item] = 1;
        }
    }
    
    // populate hidden circle with basket items
    
    for (const item in basket){
        let stackedWrapper = document.createElement('div');
        stackedWrapper.id = item + '-parent';
        stackedWrapper.className = 'selectedImageWrapper';
        
        /* add the quantity marker
        const quantity = document.createElement('span');
        quantity.id = item + '-overlay';
        quantity.className = 'overlayText';
        quantity.innerHTML = basket[item] + 'x';
        stackedWrapper.appendChild(quantity);
        */
        
        const imageElement = document.createElement('img');
        imageElement.src = productURLs[item];
        imageElement.setAttribute('id', item + '-dropped');
        imageElement.setAttribute('class', 'multiple-product');

        stackedWrapper.appendChild(imageElement);
        

        hiddenCircle.appendChild(stackedWrapper);      
    }

    let usableCircleDiv = hiddenCircle.cloneNode(true);
    hiddenCircle.style.display = 'none';
    
    // This function calculates the grocery store Cost of all products in the basket
    function priceCalculator(shoppingCart, priceList){
        let storeNet = 0;
        for (const product in priceList){
            if (basket.hasOwnProperty(product)){
                storeNet += Number(storePrices[product]) * Number(shoppingCart[product]);
            }
        }
        return storeNet;
    }

    /*takes in an html node pointing to a hidden circle
    already populated with item image and counters and returns an html node with the the information on quantity risk
    displayed dynamically */

    function quantityVisualizer(baseCircleElement, quantityVariation){
        
        //clone the cricle to avoid altering the original but remove the id
        const circleClone = baseCircleElement.cloneNode(true);

        circleClone.removeAttribute('id');
        circleClone.className = 'quantityCircle';

        let baseCircleWidth = 10; // intended to be used with vw so that in the extreme case of 100% quantity variation, you have room for all 3 circles

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
            cell.innerHTML = cell.innerHTML.replace(/&nbsp;/g, ' '); // remove unwanted spaces
        }
    }

    let choice = '';

    // Function to handle radio button change
const radioButtons = document.querySelectorAll('input[type="radio"]');
radioButtons.forEach(button => {
    button.addEventListener('change', function () {
        choice = this.value;
        csaOptions['response'] = choice;
        console.log(csaOptions);
        $("#answer{SGQ}").val(JSON.stringify(csaOptions)).trigger('change'); 
    });
});