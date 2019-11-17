function itemTemplate(item){
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}
let list_item=document.getElementById("list_item");
let createField=document.getElementById("create_field");
let ourHTML=items.map((item)=>{
return itemTemplate(item);
}).join('');
list_item.insertAdjacentHTML("beforeend",ourHTML);
document.getElementById("create_form").addEventListener("submit",(e)=>{
e.preventDefault();
axios.post('/create_item',{text:createField.value}).then((response)=>{
   document.getElementById("list_item").insertAdjacentHTML("beforeend",itemTemplate(response.data));
   createField.value = ""
    createField.focus()
}).catch(()=>{
    console.log("please try again");
});
})

document.addEventListener("click",(e)=>{
    if(e.target.classList.contains("delete-me"))
    {
        if(confirm("Do you want to delete it ?")){
        axios.post('/delete_item',{id:e.target.getAttribute("data-id")}).then(()=>{
            e.target.parentElement.parentElement.remove();
        }).catch(()=>{
            console.log("please try again");
        });
    }
    }
    if(e.target.classList.contains("edit-me"))
    {
        let userInput=prompt("enter your desired new text",e.target.parentElement.parentElement.querySelector(".item-text").innerHTML);
        axios.post('/update_item',{text:userInput,id:e.target.getAttribute("data-id")}).then(()=>{
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML=userInput;
        }).catch(()=>{
            console.log("please try again");
        });
    }
})