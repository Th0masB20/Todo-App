let getElement = (id) => document.querySelector(id);
let root = getComputedStyle(getElement(":root"));

let todoArray = [];

window.addEventListener('beforeunload',saveData);
window.onload = loadData();
window.onload = loadTodoTab();

let createDiv = getElement(".createTaskDiv");
let createMenu = getElement(".taskCreationDiv");

function saveData(){
    alert(todoArray.length);
    let jsonData = JSON.stringify(todoArray,null, 2);
    localStorage.setItem('save', jsonData);
}

function loadData()
{
    if(localStorage.getItem('save'))
    {
        let jsonData = localStorage.getItem('save');
        todoArray = JSON.parse(jsonData);
    }
}

function showTaskCreation()
{
    if(getComputedStyle(createMenu).getPropertyValue('display') ==="none")
    {
        createDiv.children[0].style.display = "none";
        //remove active click
        createDiv.removeAttribute('id');
    
        createDiv.style.height = root.getPropertyValue("--creationHeight");
        setTimeout(() => createMenu.style.display = "block", 100);

        createDiv.classList.add("triggerDiv");
        for(let taskMenuChildren of createMenu.children)
        {
            taskMenuChildren.classList.add("triggerDiv");
        }
        for(let taskDivChildren of createDiv.children)
        {
            taskDivChildren.classList.add("triggerDiv");
        }
    }
}

function createTabElements(index, title, date)
{
    let todoList = getElement("#todoList");

    let li = document.createElement('li');
    let todoTab = document.createElement('div');

    let tabTitle = document.createElement('h2');
    let tabDate = document.createElement('p');

    let desDivContainer = document.createElement('div');
    let addDesButton = document.createElement('p');
    let deleteB = document.createElement('img');

    deleteB.setAttribute('id', 'trash');
    deleteB.setAttribute('src', '/images/trashcan.png');

    todoTab.setAttribute('id', index + 'todoTab');
    tabTitle.innerHTML = title;
    tabDate.innerHTML = date;

    desDivContainer.setAttribute('id', index + 'descriptionFlexContainer');
    addDesButton.setAttribute('id', index + 'addDetailButton');
    addDesButton.innerHTML = '+ add tab';

    todoTab.appendChild(tabTitle);
    todoTab.appendChild(tabDate);
    desDivContainer.appendChild(addDesButton);
    todoTab.appendChild(desDivContainer);
    todoTab.appendChild(deleteB);

    li.appendChild(todoTab);
    todoList.appendChild(li);

    addDesButton.setAttribute('onclick', 'addDetail(this)');
    deleteB.addEventListener('click', deleteTab);
}

function loadTodoTab(){
    for(let index = 0; index < todoArray.length; index++){
        tab = todoArray[index];

        let todoList = getElement("#todoList");

        let li = document.createElement('li');
        let todoTab = document.createElement('div');
    
        let tabTitle = document.createElement('h2');
        let tabDate = document.createElement('p');
    
        let desDivContainer = document.createElement('div');
        let addDesButton = document.createElement('p');
        let deleteB = document.createElement('img');
    
        deleteB.setAttribute('id', 'trash');
        deleteB.setAttribute('src', '../images/trashcan.png');
    
        todoTab.setAttribute('id', index + 'todoTab');
        tabTitle.innerHTML = tab.title;
        tabDate.innerHTML = tab.date;
    
        desDivContainer.setAttribute('id', index + 'descriptionFlexContainer');
        addDesButton.setAttribute('id', index + 'addDetailButton');
        addDesButton.innerHTML = '+ add tab';
    
        todoTab.appendChild(tabTitle);
        todoTab.appendChild(tabDate);
        desDivContainer.appendChild(addDesButton);
        todoTab.appendChild(desDivContainer);
        todoTab.appendChild(deleteB);
    
        li.appendChild(todoTab);
        todoList.appendChild(li);
    
        addDesButton.setAttribute('onclick', 'addDetail(this)');
        deleteB.addEventListener('click', deleteTab);

        for(let description of tab.descriptionList)
        {
            let descriptionDiv = document.createElement('div');
            let text = document.createElement('textarea');
            let editImage = document.createElement('span');
    
            descriptionDiv.setAttribute('class','myDescription');
            descriptionDiv.setAttribute('id', description.id);

            editImage.setAttribute('class','editImageContainer');

            text.setAttribute('class', 'desctiptionTextArea');
            text.innerHTML = description.description;
            text.readOnly = true;

            descriptionDiv.appendChild(text);
            descriptionDiv.appendChild(editImage);
            desDivContainer.appendChild(descriptionDiv);

            editImage.setAttribute('onClick', 'writePopupDes(this)');

            text.setAttribute('oninput', "updateTextBox(this)");
            text.addEventListener('keydown', hitEnter);
        }
    }
}

function createTodoTab(){
    let title = createMenu.children[1].value;
    let date = createMenu.children[2].value;

    let tabInfo = {title:title, date:date, descriptionList:[]};

    for(let i of todoArray)
    {
        if(title === i.title)
        {
            createDiv.style.height = root.getPropertyValue("--errorHeight");
            let setText = () => createMenu.children[0].innerHTML = "This task already excists.<br>Use a different task name";
            setTimeout(setText, 50);
            return;
        }
        else{
            createMenu.children[0].innerHTML = "";
            createDiv.style.height = root.getPropertyValue("--creationHeight");
        }
    }

    todoArray.push(tabInfo);

    let index = todoArray.findIndex(theObject => theObject.title === title);
    createTabElements(index, title, date);
}

function addDetail(object){
    let descriptionDiv = document.createElement('div');
    let text = document.createElement('textarea');
    let editImage = document.createElement('span');
    let parent = object.parentElement; // this is the descriptionDiv

    descriptionDiv.setAttribute('class','myDescription');
    let randomID = Math.floor(Math.random() * 9999999999);
    descriptionDiv.setAttribute('id', randomID);

    editImage.setAttribute('class','editImageContainer');

    text.setAttribute('class', 'desctiptionTextArea')

    descriptionDiv.appendChild(text);
    descriptionDiv.appendChild(editImage);
    parent.appendChild(descriptionDiv);

    editImage.setAttribute('onClick', 'writePopupDes(this)');

    text.setAttribute('oninput', "updateTextBox(this)");
    text.focus();
    text.addEventListener('keydown', hitEnter);
}

function updateTextBox(textBox){
    textBox.style.height = "auto";
    textBox.style.height = textBox.scrollHeight + 'px';
}

function hitEnter(e)
{
    //this is the textArea Div
    if(e.key=='Enter' && this.value != "")
    {
        this.readOnly = true;
        let descriptionParentIndex = this.parentElement.parentElement.id.charAt(0);
        let descriptionDiv = this.parentElement;

        //adds specific desctiption box to a map
        const descriptionInfo = {id:descriptionDiv.id, description: this.value, checkList:[]}
        todoArray[descriptionParentIndex].descriptionList.push(descriptionInfo);
    }
}

function reload(){
    let list = getElement('#todoList');
    while(list.lastChild)
    {
        list.firstChild.remove();
    }
    
    loadTodoTab();
}
function deleteTab(e){
    let id = e.target.parentElement.id.charAt(0);
    todoArray.splice(id,1);
    reload();
}

document.addEventListener("click", function (e){
    if(Boolean(e.target.getAttribute("class")) && !e.target.getAttribute("class").includes("triggerDiv"))
    {
        createDiv.children[0].style.display = "block"; //p element shows
        createDiv.setAttribute('id','activeClick');
        createMenu.children[0].innerHTML = "";

        createMenu.style.display = "none";
        createDiv.style.height = "30px";
    }
    else if(!Boolean(e.target.getAttribute("class")))
    {
        createDiv.children[0].style.display = "block"; //p element shows
        createDiv.setAttribute('id','activeClick');
        createMenu.children[0].innerHTML = "";

        createMenu.style.display = "none";
        createDiv.style.height = "30px";
    }
});


getElement(".addToList").addEventListener("click", createTodoTab);
createDiv.addEventListener("click", showTaskCreation);