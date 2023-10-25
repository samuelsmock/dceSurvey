
    console.log(document.getElementById('basket').textContent);
    
    /* This script loads the selected products from the html file and dynamically populates the basket back into the html file. 
    The Image URLS are Stored in the JavaScript in contrast to the basketBuilder pair of html and javascript files, where the 
    image urls where contained in the html. 

    /*itemList is loaded from HTML file by finding the element with id = "basket" which is populated from the basketBuilder 
    Question via limesurvey's expression script function ({basketBuilder.shown}) */


    
    /*
    let itemList =(document.getElementById('basket').textContent.split(','));
    var productURLs = { 
        'Hard Cheese': "/upload/surveys/996739/images/picture1.png",
        'Yogurt': "/upload/surveys/996739/images/picture2.png",
        'Milk': "/upload/surveys/996739/images/picture3.png",
        'Soft Cheese': "/upload/surveys/996739/images/picture4.png",
        'Butter': "/upload/surveys/996739/images/picture5.png",
     }
     var HNVurls = ['/upload/surveys/996739/images/Screen%20Shot%202023-10-17%20at%2012.21.18%20PM.png', 
     '/upload/surveys/996739/images/Screen%20Shot%202023-10-17%20at%2012.21.37%20PM.png'];
*/


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

    let hiddenCircle = document.getElementById('hiddenCircle');
    
    let csaOptions = { 
        "a": { 
            'quantity': 75,
            'composition': false,
            'HNV': true,
            'priceFactor': 2
        },

        "b": { 
            'quantity': 25,
            'composition': true,
            'HNV': false,
            "priceFactor": 3
        }
    };

    let storePrices = { 
        "Milk": 1,
        'Yogurt': 5,
        'Cottage Cheese': 5,
        'Soft Cheese': 3,
        'Cream Cheese': 4
    };
    //unpack the list to a count dictionary

    for (var item of itemList){
        if (basket.hasOwnProperty(item)){
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

        if (quantityVariation == 0){
            const quantityWrapper = document.createElement('div');
            circleClone.style.width = baseCircleWidth + 'vw';
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
           smallCircle.style.width = (1-(quantityVariation/100))**(0.5)*baseCircleWidth + 'vw';   // radii are scaled so that the area ~(r2) cooresponds to quantity
           smallCircle.style.height = (1-(quantityVariation/100))**(0.5)* baseCircleWidth + 'vw';

           //add large circle
           const largeCircle = circleClone.cloneNode(true);
           largeCircle.style.width = (1+(quantityVariation/100))**(0.5)*baseCircleWidth + 'vw';
           largeCircle.style.height = (1+(quantityVariation/100))**(0.5)*baseCircleWidth + 'vw';

           quantityWrapper.appendChild(smallCircle);
           quantityWrapper.appendChild(circleClone);
           quantityWrapper.appendChild(largeCircle);

        

           return quantityWrapper;

        }
    };

    function compositionVisualizer(baseCircleElement, compositionBoolean){
        
        //clone the cricle to avoid altering the original but remove the id
        const circleClone = baseCircleElement.cloneNode(true);

        circleClone.removeAttribute('id');
        circleClone.className = 'compositionCircle';

        let baseCircleWidth = 8; // intended to be used with vw
        let compositionWrapper = document.createElement('div');
        compositionWrapper.className = "compositionWrapper";

        if(compositionBoolean == false){
            circleClone.style.width = baseCircleWidth + 'vw';
            circleClone.style.height = baseCircleWidth + 'vw';

            const symbol = document.createElement('text');
            symbol.innerHTML = '&#x2713'; // hex unicode for a checkmark
            symbol.id = 'green-check';
            
            compositionWrapper.appendChild(circleClone);
            compositionWrapper.appendChild(symbol);

            return compositionWrapper;
        }else if (compositionBoolean == true){
            circleClone.style.width = baseCircleWidth + 'vw';
            circleClone.style.height = baseCircleWidth + 'vw';

            //find the first item in the basket and remove it
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

    };

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
            }else if (key === 'quantity'){
                
                cell.appendChild(quantityVisualizer(usableCircleDiv, csaOptions[csa][key]))
                
                let span = document.createElement('div')
                span.className = 'quantityArrow'
                span.innerHTML = "<---- +/- " + csaOptions[csa][key] + "% ------->";
                
                cell.appendChild(span);
            } else if (key == 'composition'){

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
        });
    });
