const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
// Items
let updatedOnLoad = false;
// Initialize Arrays
let listArrays = [];
// Drag Functionality
let dragged;
let draggingtheitem = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("listArrays")) {
    listArrays = JSON.parse(localStorage.listArrays);
  } else {
    listArrays = [
      ["Release the course", "Sit back and relax"],
      ["Work on projects", "Listen to music"],
      ["Being cool", "Getting stuff done"],
      ["Being uncool"],
    ];
  }
}
// Set localStorage Arrays
function updateSavedColumns() {
  localStorage.setItem("listArrays", JSON.stringify(listArrays));
}
// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.setAttribute("onblur", `updateItem(${index}, ${column})`);
  // Append Child
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  
  listArrays.forEach((array, column) => {
    listColumns[column].textContent = "";
    array.forEach((item, index) => {
      createItemEl(listColumns[column], column, item, index);
    });
  });
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

//  Update item - Delete if necessary or update array
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedcolumnEl = listColumns[column].children[id];
 if(!draggingtheitem){

    if (selectedcolumnEl.textContent.trim() === "") {
      selectedArray.splice(id, 1);
    } else {
      selectedArray[id] = selectedcolumnEl.textContent;
    }
    updateDOM();
 }
  
}
// Add to column List, reset textBox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedarray = listArrays[column];
  itemText.trim() !== "" && selectedarray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
}
// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}
// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}
// Allows arrays to refelect drag and Drop item
function rebuildArrays() {
  listArrays.forEach((_, index) => {
    listArrays[index] = Array.from(listColumns[index].children).map(
      (i) => i.textContent
    );
  });
  updateDOM();
}
// When items start draging
function drag(e) {
  dragged = e.target;
  draggingtheitem = true;
}
// Column allows to item allow
function allowDrop(e) {
  e.preventDefault();
}
// When the item enters
function dragEnter(column) {
  listColumns.forEach((cl) => {
    cl.classList.remove("over");
  });
  column.currentTarget.classList.add('over')
}
// Dropping item in column
function drop(e) {
  e.preventDefault();
  // Remove BackGround Color
  listColumns.forEach((cl) => {
    cl.classList.remove("over");
  });
  // Add item to column
  e.currentTarget.appendChild(dragged);
  // draging complete
  draggingtheitem = false;
  rebuildArrays();
}
// On Load
updateDOM();
