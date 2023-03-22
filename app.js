 

// ****** SELECT ITEMS **********
const form = document.querySelector(`.grocery-form`);
const alert = document.querySelector(`.alert`);
const grocery = document.getElementById(`grocery`);
const submitBtn = document.querySelector(`.submit-btn`);
const container = document.querySelector(`.grocery-container`);
const list = document.querySelector(`.grocery-list`)
const clear = document.querySelector(`.clear-btn`)

// edit option
let editElement;
let editFlag = false;
let editID = '';
// ****** EVENT LISTENERS **********
//submit form
form.addEventListener(`submit`, myFunction)
//clear item
clear.addEventListener(`click`, clearItem)
//load items
window.addEventListener(`DOMContentLoaded`, setUpitems)

function myFunction(e){
    e.preventDefault();
   const value = grocery.value;
   const id = new Date().getTime().toString();

   if(value && !editFlag){
    createListItem(id,value)
    // display alert
    displayAlert(`item added to the list`, `success`)
     //addclass
     container.classList.add("show-container");
//add to local storage
     addToLocalStorage(id, value);
     //back to default
     setBackToDefault()
   }
   else if(value &&  editFlag){
    editElement.innerHTML = value;
    displayAlert(`edit succesful`, 'success')
    editLocalStrorage(editID, value);
    setBackToDefault();
   }
   else{ 
        displayAlert("please input a value", "danger")
   }
  
}
// ****** FUNCTIONS **********
   

    //alert function
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`)

   
setTimeout(function(){
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`)
}, 1000)
}
// clear items
 function clearItem(){
    const item = document.querySelectorAll(`.grocery-item`)
    if(item.length > 0){
      item.forEach(function(item){
        list.removeChild(item)
      })
    }
    container.classList.remove("show-container");
    displayAlert(`empty list`, `danger`);
    setBackToDefault();
    localStorage.removeItem(`list`)
   }

   //deletefunction
   function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
      container.classList.remove(`show-container`)
    }
    displayAlert(`item deleted`, `danger`);
    setBackToDefault();

    //localstorage
    removeFromlocalStorage(id)
   }
   //editfunction
   function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    //set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = `edit`;

   }
// Set back too default
function setBackToDefault(){
  grocery.value = '';
  editFlag = false;
  editID = '';
  submitBtn.textContent = 'submit'
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value){
  const grocery = {id, value}
  let item = getFromLocalStorage()

  item.push(grocery);
  localStorage.setItem('list', JSON.stringify(item))
}
function removeFromlocalStorage(id){
  let items = getFromLocalStorage();
  items = items.filter(function(item){
    if(item.id!==id){
      return item
    }
  })
  localStorage.setItem('list', JSON.stringify(items))
}
function editLocalStrorage(id, value){
  let items = getFromLocalStorage(); 
  items = items.map(function(item){
    if(item.id === id){
      item.value = value;
    }
    return item;
  })
  localStorage.setItem('list', JSON.stringify(items))
}
function getFromLocalStorage(){
  return localStorage.getItem('list')? JSON.parse(localStorage.getItem('list'))
  :[];
}

// localStorage.setItem(`orange`, JSON.stringify([`item1`, `item2`]))
// const localItem = JSON.parse(localStorage.getItem('orange'))
// localStorage.removeItem('orange')
// ****** SETUP ITEMS **********
function setUpitems(){
  let items = getFromLocalStorage();
  if(items.length > 0){
    items.forEach(function(item){
      createListItem(item.id, item.value)
    })
    container.classList.add(`show-container`)
  }
}
function createListItem(id, value){
  const element = document.createElement(`article`)
  //addclass
  element.classList.add(`grocery-item`);
  //create attribute
  const attr = document.createAttribute(`data-id`);
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `  <p class="item">${value }</p>
  <div class="btn-container">
   <button type="button" class="edit-btn">
     <i class="fa-solid fa-edit"></i>
   </button>
   <button type="button" class="delete-btn">
   <i class="fa-solid fa-trash"></i>
 </button>
</div>`;
  const deleteBtn = element.querySelector(`.delete-btn`);
  const editBtn = element.querySelector(`.edit-btn`);
  deleteBtn.addEventListener(`click`, deleteItem);
  editBtn.addEventListener(`click`, editItem);

  //append child
  list.appendChild(element);
}