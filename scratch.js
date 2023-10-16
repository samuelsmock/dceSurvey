$(document).ready(function(){
    let selectedImageIds = [];
    let selectedImageDict = {  };


    const source = document.querySelectorAll(".draggable-img");

    source.forEach((image) =>{
    image.addEventListener("dragstart", (ev) => {
        console.log("dragStart");
        // Change the source element's background color
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
        // Get the data, which is the id of the source element
        const imageId = ev.dataTransfer.getData("text");
        const source = document.getElementById(imageId);
        
        

        selectedImageIds.push(imageId);
        if(imageId in selectedImageDict){
            selectedImageDict[imageId] += 1;
        }
        else {
            selectedImageDict[imageId] = 1;
        }

        if (source) {
        // Clone the image and add it to the target circle
        
        // if this is the first image to be dropped, delete the prompt and add a grid
            if (selectedImageIds.length == 1){
                const promptText = document.getElementById('promptText');
                var newDiv = document.createElement('div');
                newDiv.setAttribute('id', 'imageGrid');
                promptText.style.display = 'none';
                //targetCircle.appendChild(newDiv);   
            }

            const clonedImage = source.cloneNode(true);
            ev.target.appendChild(clonedImage);

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
                //save the running value to the hidden input element for use in further questions

        displayTable();
        $("#answer{SGQ}").val(JSON.stringify(selectedImageDict)).trigger('keyup');
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
        target.appendChild(document.createTextNode("Drag desired products here!"));

        var shoppingTableBody = document.getElementById('shoppingTableBody');
        while (shoppingTableBody.firstChild) {
            shoppingTableBody.removeChild(shoppingTableBody.firstChild);
        }
        $("#answer{SGQ}").val('').trigger('keyup');
    });
    
        
        
      
});