
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

    target.addEventListener("drop", (ev) => {
        console.log("Drop");
        ev.preventDefault();
        // Get the data, which is the id of the imgNode element
        const imageId = ev.dataTransfer.getData("text");
        const imgNode = document.getElementById(imageId);
        
        


        if (imgNode) {
        // Clone the image and add it to the target circle
        
        // if this is the first image to be dropped, delete the prompt 
            if (selectedImageIds.length == 0){
                const promptText = document.getElementById('promptText');
                promptText.parentNode.removeChild(promptText);
            }

        // if this is the first drop of this product, add to the target
            if (!selectedImageDict.hasOwnProperty(imageId)){    
                const clonedImage = imgNode.cloneNode(true);
                clonedImage.setAttribute('id', imageId +'-dropped');
                clonedImage.setAttribute('class', 'single-product');
                clonedImage.setAttribute('draggable', false);
                
                let stackedWrapper = document.createElement('div');
                stackedWrapper.id = imageId + '-parent';
                stackedWrapper.className = 'selectedImageWrapper'

                ev.target.appendChild(stackedWrapper);

                
                stackedWrapper.appendChild(clonedImage);
                
            }
        //// if this is the not the first drop of this product, wrap it in a new div with an additional text. 
        ///this is styled with css to sit on top of the image
        if (selectedImageDict.hasOwnProperty(imageId)){    
            const oldImage= document.getElementById(imageId + '-dropped');
            
            if(oldImage){
                oldImage.className = 'multiple-product';
                let stackedWrapper = document.getElementById(imageId + '-parent')

                let quantity = document.createElement('span');
                quantity.id = imageId + '-overlay';
                quantity.className = 'overlayText'
                quantity.innerHTML = selectedImageDict[imageId]+1 + 'x';
                
                //if there is already a quantity, delete it
                let oldQuantity = document.getElementById(imageId+ '-overlay');
                
                if (oldQuantity){
                    oldQuantity.remove();
                }
                stackedWrapper.appendChild(quantity);
            }
           
        }
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

        /*save the running value to the hidden input element for use in further questions
        to do this you need to fire and Expression Manager Function
        Helpful Forum Post:
        https://forums.limesurvey.org/index.php/forum/can-i-do-this-with-limesurvey/115486-how-to-insert-answer-via-javascript
        */

        selectedImageIds.push(imageId);
        if(imageId in selectedImageDict){
            selectedImageDict[imageId] += 1;
        }
        else {
            selectedImageDict[imageId] = 1;
        }

        displayTable();
        $("#answer{SGQ}").val(selectedImageIds).trigger('keyup'); // this Expression manager function is explained in comment above
        }
        
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
