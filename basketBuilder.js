jQuery(document).ready(function(){
    //hide answer field
    const answerItems = document.querySelectorAll('.answer-item');
    
    answerItems.forEach(item => {
      item.style.display = 'none'; // Hide each element
    });   
    
    let selectedImageIds = [];
    let selectedImageDict = {  };


    const imgNode = document.querySelectorAll(".draggable-img");

    imgNode.forEach((image) =>{
    image.addEventListener("dragstart", (ev) => { 
        console.log("dragStart");
        // Change the imgNode element's background color
        // to show that drag has started
        
        ev.currentTarget.classList.add("dragging");
        // Clear the drag data cache (for all formats/types)
        ev.dataTransfer.clearData();
        // Set the drag's format and data.
        // Use the event target's id for the data
        ev.dataTransfer.setData("text/plain", ev.target.id);
    });
        image.addEventListener("dragend", (ev) =>
        ev.target.classList.remove("dragging"),
        );
    }); 


    const target = document.querySelector("#target");

    target.addEventListener("dragover", (ev) => {
        console.log("dragOver");
        ev.preventDefault();
    });

    /* a function that will be used within the event listener to update the table of the shopping list
    when a new item is dropped*/
    function displayTable(){
        //finally populate the table
        var shoppingTable = document.getElementById('shoppingTableBody');
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
    }

    target.addEventListener("drop", (ev) => {
        console.log("Drop");
        ev.preventDefault();
        // Get the data, which is the id of the imgNode element
        const imageId = ev.dataTransfer.getData("text");
        const imgNode = document.getElementById(imageId);
        
        
        const updateTable = function(){
            return new Promise ((resolve, reject) => {
                selectedImageIds.push(imageId);
                if(imageId in selectedImageDict){
                    selectedImageDict[imageId] += 1; // increment the shopping table
                }
                else {
                    selectedImageDict[imageId] = 1; //else add
                }

                /*save the running value to the hidden input element for use in further questions
                to do this you need to fire and Expression Manager Function
                Helpful Forum Post:
                https://forums.limesurvey.org/index.php/forum/can-i-do-this-with-limesurvey/115486-how-to-insert-answer-via-javascript
                */
            $("#answer{SGQ}").val(selectedImageIds).trigger('keyup');

            console.log('answer is contained in hidden html element class = answer-item, current answer is: ', selectedImageIds);
            if(imageId){
                console.log('resolved')
                resolve();
            } else {
                reject(new Error('dictionaryCouldnt be updated'))
            }
        });
        }

        //now that the imageid is in the selectedImagIds list and selectedImageDict dictionary. they can be used to
        //change the apearance of the target circle.
        
        async function updateCircle(){
            try{
                await updateTable();
                //only run the code to update the circle once the table has been updated
                if (imgNode) {
                    // Clone the image and add it to the target circle
                    
                    // if this is the first image to be dropped, delete the prompt 
                        if (selectedImageIds.length === 1){
                            const promptText = document.getElementById('promptText');
                            promptText.parentNode.removeChild(promptText);
                        }
            
                    // if this is the first drop of this product, add to the target
                        
                    //// if this is the not the first drop of this product, wrap it in a new div with an additional text. 
                    ///this is styled with css to sit on top of the image
                
                    if (selectedImageDict[imageId] > 1){    
                        const oldImage= document.getElementById(imageId + '-dropped');
                        
                        if(oldImage){
                            oldImage.className = 'multiple-product';
                            const stackedWrapper = document.getElementById(imageId + '-parent');
            
                            const quantity = document.createElement('span');
                            quantity.id = imageId + '-overlay';
                            quantity.className = 'overlayText';
                            quantity.innerHTML = selectedImageDict[imageId] + 'x';
                            
                            //if there is already a quantity, delete it
                            const oldQuantity = document.getElementById(imageId+ '-overlay');
                            if (oldQuantity){
                                oldQuantity.remove();}
                            stackedWrapper.appendChild(quantity);
                        }  
                    } else {  
                        console.log('atleastmadeithere', imageId);  
                        const clonedImage = document.getElementById(imageId).cloneNode(true);
                        clonedImage.setAttribute('id', imageId +'-dropped');
                        clonedImage.setAttribute('class', 'single-product');
                        clonedImage.setAttribute('draggable', false);
                        
                        const stackedWrapper = document.createElement('div');
                        stackedWrapper.id = imageId + '-parent';
                        stackedWrapper.className = 'selectedImageWrapper';
                        
                        const circle = document.getElementById('target')
                        stackedWrapper.appendChild(clonedImage);
                        circle.appendChild(stackedWrapper);
                        
                     }
                }

            } catch(error) {
                console.log(error)
            }
                
                  
        }
        
        updateCircle();
        displayTable(); // update the display of the shopping table
        
    });

    // hitting the reset button needs to clear the shopping list table, the visible basket and also the answer field.

    const reset = document.querySelector("#reset");
    reset.addEventListener("click", function(){
        selectedImageIds = [];
        selectedImageDict ={  };
        while (target.firstChild) {
            target.removeChild(target.firstChild);
        }

        //Put the prompt back in
        const textPrompt = document.createElement("div");
        textPrompt.id = "promptText";
        textPrompt.textContent = "Drag desired products here!";

        target.appendChild(textPrompt);

        var shoppingTableBody = document.getElementById('shoppingTableBody');
        while (shoppingTableBody.firstChild) {
            shoppingTableBody.removeChild(shoppingTableBody.firstChild);
        }
        $("#answer{SGQ}").val([]).trigger('keyup');
    });   
});