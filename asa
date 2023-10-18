console.log(document.getElementById('basket').textContent);
        
let itemList =(document.getElementById('basket').textContent.split(','));
let basket = {  };  


for (var item of itemList){
    if (basket.hasOwnProperty(item)){
        basket[item]+= 1;
    }else{
        basket[item] = 1;
    }
}

console.log(basket);

// Variable to store the user's choice

csaOptions = { 
    "a": { 
        'quantity': 50,
        'composition': true,
        'HNV': true,
        'priceFactor': 2
     },

    "b": { 
        'quantity': 25,
        'composition': false,
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

//this function dynamically populates the table with the characteristics and calculated price
for (const csa in csaOptions) {
    
    for (const key in csaOptions[csa]) {
        console.log(`${ key }-${ csa }`);
        const cell = document.getElementById(`${ key }-${ csa }`);
        if (key == 'priceFactor'){
            cell.textContent = csaOptions[csa][key]*priceCalculator(basket, storePrices);
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
