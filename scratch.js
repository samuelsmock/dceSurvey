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