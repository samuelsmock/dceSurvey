//https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData

const sourceBank = document.getElementById('sourceBank');
const targetCircle = document.getElementById('targetCircle');
const selectedPicturesInput = document.getElementById('selectedPicturesInput');
const imageGrid = document.getElementById('image-grid');

let selectedImageIds = [];
let selectedImageDict = {};

const textBox = document.getElementById('promptText');

document.getElementById('helloButton').addEventListener('click', function() {
    
    // Create a new div element
    const newDiv = document.createElement("div");
    newDiv.textContent = "Hello";

    // Append the new div to the body
    document.body.appendChild(newDiv);

    console.log('hi')
});

// Prevent default behavior for drag events
sourceBank.addEventListener('dragover', (e) => {
    e.preventDefault();
});


targetCircle.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

// Handle image drag start
sourceBank.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id);
});

// Handle image drop
targetCircle.addEventListener('drop', (e) => {
    e.preventDefault();
    const imageId = e.dataTransfer.getData('text/plain');
    const imageElement = document.getElementById(imageId);              
    
    





 

    if (imageElement) {
        // Clone the image and add it to the target circle
        
        // if this is the first image to be dropped, delete the prompt and add a grid
        if (selectedImageIds == 0){
            var newDiv = document.createElement('div');
            newDiv.setAttribute('id', 'imageGrid');
            textBox.style.display = 'none';
            targetCircle.appendChild(newDiv);
            
        }

        // Function to add an image to the grid
        function addImage(droppedImageElement) {
            if (droppedImageElement.id in selectedImageDict) {
                // If the image already exists, stack it like two cards
                
                const stackedImage = document.getElementById(imageId + "-dropped")
                stackedImage.setAttribute('class', 'stacked-img')
                
            } else {
                // If the image is new, create a new image element
                const selectedImageGrid = document.getElementById('imageGrid')
                const clonedImage = droppedImageElement.cloneNode(true);
                clonedImage.classList.remove('draggable-img');
                clonedImage.setAttribute('class', 'dropped-image')
                clonedImage.setAttribute('id', imageId + "-dropped")
                selectedImageGrid.appendChild(clonedImage);
            }
        }
        
        addImage(imageElement)

        
       
        // Add the image ID to the selectedImageIds array and selectedImageDict
        selectedImageIds.push(imageId);
        if(imageId in selectedImageDict){
            selectedImageDict[imageId] += 1
        }
        else{
            selectedImageDict[imageId] = 1
        }

        // Update the hidden input value with the comma-separated list of selected image IDs
        selectedPicturesInput.value = selectedImageIds.join(',');

        // Get a reference to the table body
        var shoppingTable = document.getElementById('shoppingTable');
        shoppingTable.innerHTML = '';
        // Loop through the dictionary and create table rows
        for (var key in selectedImageDict) {
        if (selectedImageDict.hasOwnProperty(key)) {
            var row = shoppingTable.insertRow();
            var cell1 = row.insertCell(0); // Cell for the key
            var cell2 = row.insertCell(1); // Cell for the value

            cell1.innerHTML = key;
            cell2.innerHTML = selectedImageDict[key];
        }
        }
       

        // Reset the source image's draggable attribute so it can be dragged again
        imageElement.setAttribute('draggable', 'true');
    }
});