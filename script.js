const main = document.querySelector("main");
const todo = document.querySelector(".todo .task");

const done = document.querySelector("#complete");

// ================= POP-UP ====================
const popUp = document.querySelector(".pop-up");
// =========== POP TITLE (EDIT OR ADD TASK) ====
const pop_title = popUp.querySelector("h1");

const submit_btn = popUp.querySelector("#submit");

// =============== DELETE ACTION POP-UP =============
const del_popup = main.querySelector(".delete_popup");

// ============= EMPTY SECTION RENDER ================
const empty_task = main.querySelector(".empty_task");
const empty_done = main.querySelector(".empty_done");

// ============ TITLE AND DESCIPTION ELEMENT ==========
let titleEl;
let descEl;

// ============ TITLE AND DESCIPTION INPUTS ==========
const title_input = popUp.querySelector(".title input");
const desc_Input = popUp.querySelector(".desc textarea");

const task_id = new Date().getTime().toString();


let delete_item;

//Storage Items

main.addEventListener("click", (e) => {
  const id = e.target;
  descEl = id.parentElement.querySelector("p");
  titleEl = id.parentElement.querySelector("h3");

  // ============= POPING THE ADD CONTAINER ========
  if (id.id == "add_task") {
    pop_title.innerHTML = "Add Task";
    title_input.value = "";
    desc_Input.value = "";
    popUp.style.display = "flex";
  }
  // SELECTING OBJECT TO BE DELETED
  if (id.id == "delete") {
    delete_item = id.parentElement.parentElement;
    del_popup.style.display = "flex";
  }

  // ============= SELECTING OBJECT TO BE EDITTED ================
  if (id.id == "edit") {
    pop_title.innerHTML = `Edit Task`;
    title_input.value = titleEl.innerHTML.trim();
    desc_Input.value = descEl.innerHTML.trim();

    popUp.style.display = "flex";
  }

  // =========== HANDLNG THE MOVE TASK ACTION ===========
  if (id.id == "move") {
    if(todo.childElementCount == 2){
      empty_task.style.display = "block"
    }
    empty_done.style.display = "none";
    done.innerHTML += `
    <article>
    <span class="head">
        <h3 id="task-title">${titleEl.innerHTML} </h3>
        <i class='bx bx-trash btn' id="delete"></i>
    </span>
    <p class="remarks"><i class='bx bxs-check-circle'></i> Completed Task</p>
</article>`;
    todo.removeChild(id.parentElement);

  }

  //POPING UP THE DELETE OVERLAY ONLY
  if (id.className == "delete_popup") {
    if (id.className !== "delete_popup") {
      return;
    } else {
      del_popup.style.display = "none";
    }
  }
  // CANCEL POP UP
  if (id.id == "cancel_pop") {
    del_popup.style.display = "none";
    console.log("hello");
  }

  // ======= HANDLING DELETE ACTION ==========
  if (id.id == "del_pop") {
    // ============= DELETING FROM TASK MANAGER =============
    if (delete_item.parentElement.className == "task") {
      todo.removeChild(delete_item);
      checkTask(todo, empty_task);
      deleteLocalStorage(task_id)
      del_popup.style.display = "none";
    }

    // ========== DELETING FROM COMPLETED TASK ==============
    if (delete_item.parentElement.id == "complete") {
      done.removeChild(delete_item);
      console.log(done.childElementCount);
      checkTask(done, empty_done)
      del_popup.style.display = "none";
    }
  }
});

// =============== POP-UP EDIT AND ADD TASK SECTION  =============
popUp.addEventListener("click", (e) => {
  e.preventDefault();
  const id = e.target;

  // ========= DISPLAYING AND HIDDING POP-UP ===============
  if (
    id.className == "task_popup" ||
    id.parentElement.className == "task_popup" ||
    id.parentElement.className == "title" ||
    id.parentElement.className == "desc"
  ) {
    popUp.style.display = "flex";
  } else {
    popUp.style.display = "none";
  }

  // ===== END OF DISPLAYING AND HIDDING OF POP-UP =========

  // ========== HANDLING SUBMIT FOR ADDING AND EDITING TASK ==========
  if (id.id == "submit") {
    // ====== HANDLING SUBMIT TO ADD TASK =====
    if (pop_title.innerHTML == "Add Task") {
      if (title_input.value == "" || desc_Input.value == "") {
        return;
      } else {
        // ====== TASK CONTAINER (ARTICLE) =========
        const article = document.createElement("article");
        const attr = document.createAttribute("data-id");
        attr.value = task_id;
        article.className = "task-item";
        article.setAttributeNode(attr);
        // ======= TASK =======
        const task = `
                    <span class="head">
                        <h3 id="task-title">${title_input.value}</h3>
                        <i class='bx bx-trash btn' id="delete"></i>
                    </span>
                    <p>${desc_Input.value}
                    </p>
                    <i class='bx bx-edit btn' id="edit"></i>
                    <i class='bx bx-right-arrow-alt btn' id="move"></i>
                `;
        article.innerHTML += task;
        todo.appendChild(article);
        checkTask(todo, empty_task);
        popUp.style.display = "none";
        addToLocalStorage(task_id, title_input.value, desc_Input.value)
        createTask()
      }
    }

    // ====== HANDLING SUBMIT TO EDIT TASK =====
    if (pop_title.innerHTML == "Edit Task") {
      if (title_input.value == "" || desc_Input.value == "") {
        return;
      } else {
        console.log(title_input.value, desc_Input.value);

        titleEl.innerHTML = title_input.value;
        descEl.innerHTML = desc_Input.value; 
        
        editLocalStorage(id, title_input.value, desc_Input.value )
        popUp.style.display = "none";
        // console.log(titleEl.innerText);
      }
    }
  }
});

// ====== HIDING AND RENDERING EMPTY TASK MANAGER ======
function checkTask(container, display) {
  if (container.childElementCount == 1) {
    display.style.display = "block";
  } else {
    display.style.display = "none";
  }
}


function addToLocalStorage(id, title, desc){
  const task = {id:id, title:title, desc:desc}
  const item_Arr = getItemsLocalStorage()

  item_Arr.push(task); 
  localStorage.setItem("list", JSON.stringify(item_Arr))
  console.log(item_Arr)
}

function deleteLocalStorage (id){
  let items = getItemsLocalStorage();
  items = items.filter(function(item) {
    if(item.id !== id ){
      return item
    }
  })
  localStorage.setItem("list", JSON.stringify(items) )

}

function editLocalStorage (id, title, desc){
  let items = getItemsLocalStorage()
  items = items.map(function (item){
    if(item.id === id){
      item.title = title
      item.desc = desc 
    }
    return item
  })
  localStorage.setItem("list", JSON.stringify(items))

}

function getItemsLocalStorage(){
  return localStorage.getItem("list")? 
  JSON.parse(localStorage.getItem("list")):[];
}




