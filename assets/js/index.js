// Import Firebase SDK modules we need from the firebase package
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// initialize the database
const appSettings = {
  databaseURL: "https://realtime-database-704cb-default-rtdb.firebaseio.com/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

// Get references to the input field and add button elements
const inputFieldElement = document.getElementById("input-field");
const addButtonElement = document.getElementById("add-button");
const shoppingListElement = document.getElementById("shopping-list");

// Function to append a new item to the shopping list HTML element
onValue(shoppingListInDB, function (snapshot) {
  // Check if the database has items before appending them to the HTML element
  if (snapshot.exists()) {
    // Clear the shopping list before appending new items
    clearItemFromShoppingListElement();

    // Append items from database to shopping list
    let shoppingListArray = Object.entries(snapshot.val());

    // Loop through the shopping list array and append each item to the HTML element
    for (let i = 0; i < shoppingListArray.length; i++) {
      // Get the item object from the shopping list array
      let currentItem = shoppingListArray[i];

      // Append the item to the shopping list HTML element
      appendItemToShoppingListElement(currentItem);
    }
  } else {
    // Display a message if the database is empty
    shoppingListElement.innerHTML = "No items yet available.";
  }
});

// Add event listener to the add button to add new items to the shopping list database & list HTML element
addButtonElement.addEventListener("click", function () {
  // Get the input value from the input field element
  let inputValue = inputFieldElement.value;

  // Check if the input field is empty before adding the item to the database and list HTML element
  if (inputValue === "") {
    return;
  }

  // Add the new item to the database
  push(shoppingListInDB, inputValue);

  // Clear the input field element
  clearInputFieldElement();
});

// Function to clear the input field element
function clearInputFieldElement() {
  inputFieldElement.value = "";
}

// Function to clear the shopping list HTML element and database reference
function clearItemFromShoppingListElement() {
  // Clear the shopping list HTML element and database reference
  shoppingListElement.innerHTML = "";
}

// Function to append an item to the shopping list HTML element
function appendItemToShoppingListElement(item) {
  // Append the item to the shopping list HTML element
  //   shoppingListElement.innerHTML += `<li>${itemValue}</li>`;

  // Create a new list item element with a unique ID
  let itemID = item[0];

  // Create a new list item element with values
  let itemValue = item[1];

  // Create a new list item element and set its text content to the item value
  let newElement = document.createElement("li");
  newElement.textContent = itemValue;

  newElement.addEventListener("click", function () {
    // Prompt the user for confirmation before removing the item
    let confirmation = confirm(
      `Are you sure you want to remove "${itemValue}"?`
    );

    // If the user confirms, remove the item from the database and list HTML element, If the user cancels, do nothing
    if (confirmation) {
      // Remove the item from the database and list HTML element
      removeItemFromDatabaseAndList(itemID);
    }
  });

  // Append the new list item element to the shopping list HTML element using the append method instead of innerHTML
  shoppingListElement.append(newElement);
}

function removeItemFromDatabaseAndList(item) {
  let itemToRemove = ref(database, `shoppingList/${item}`);
  // Remove the item from the database and list HTML element
  remove(itemToRemove);
}
