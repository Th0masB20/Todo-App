let popBackground = getElement('.popupBackground'); 
let descriptionPopText = getElement("#popupText");
let desctiptionObject;
let descriptionParent; 

let publicChecklistCount = 0;

function writePopupDes(spanElement)
{
    //myDescription div
    descriptionParent = spanElement.parentElement; //description dark gray box
    todoMainParent = descriptionParent.parentElement; // main todo tab
    desctiptionObject = searchIdObject(descriptionParent.id, todoArray[todoMainParent.id.charAt(0)].descriptionList);

    descriptionPopText.value = desctiptionObject.description;
    popBackground.style.display = 'flex';
    renderCheckList();
}

function searchIdObject(id, array)
{
    for(let obj of array)
    {
        if(obj.id === id)
        {
            return obj;
        }
    }

    return null;
}

function updateDescription()
{
    desctiptionObject.description = descriptionPopText.value;
    descriptionParent.children[0].value = desctiptionObject.description;
    updateTextBox(descriptionParent.children[0]);
}

function escapeDescription(e){
    if(e.key === 'Escape')
    {
        popBackground.style.display = 'none';
        updateDescription();
        deleteList();
    }
}

function renderCheckList(){
    if(desctiptionObject.checkList.length === 0)
    {
        getElement("#checkboxContainer").style.display = 'none';
        return;
    }
    for(let data of desctiptionObject.checkList)
    {
        getElement("#checkboxContainer").style.display = 'block';

        let checkBox = document.createElement('input');
        let lable = document.createElement('lable') ;

        checkBox.setAttribute('type','checkbox');
        checkBox.setAttribute('id', data.id);
        checkBox.checked = data.isChecked;
        checkBox.addEventListener('change', isChecked);

        lable.setAttribute('for',data.id);
        lable.innerHTML = data.lable;
        if(data.isChecked)
        {
            lable.style.textDecoration = 'line-through';
        }

        getElement('#checkboxContainer').appendChild(checkBox);
        getElement('#checkboxContainer').appendChild(lable);
        getElement('#checkboxContainer').appendChild(document.createElement('br'));
    }
}

function deleteList(){
    while(getElement('#checkboxContainer').firstChild)
    {
        getElement('#checkboxContainer').lastChild.remove();
    }
}

function isChecked(){
    let lable = getElement(`[for="${this.id}"]`);
    checkBoxObject = searchIdObject(this.id, desctiptionObject.checkList);
    if(this.checked)
    {
        checkBoxObject.isChecked = true;
        lable.style.textDecoration = "line-through";
    }
    else{
        checkBoxObject.isChecked = false;
        lable.style.textDecoration = 'none';
    }
}

function addChecklist(){
    getElement("#checkboxContainer").style.display = 'block';
    if(desctiptionObject.checkList.length > 12) 
    {
        return;
    }
    let parentContainer = getElement('#checkboxContainer');
    let checkBox = document.createElement('input')
    let myInput = document.createElement('input');
    let myLable = document.createElement('lable');

    checkBox.setAttribute('type', 'checkbox');
    checkBox.setAttribute('id', publicChecklistCount);

    myLable.setAttribute('for', publicChecklistCount);
    parentContainer.appendChild(checkBox);
    parentContainer.appendChild(myInput);
    myInput.focus();

    checkBox.addEventListener('change', isChecked);

    myInput.addEventListener('keydown', (e) => 
    { 
        if(e.key == 'Enter') 
        {
            myLable.innerHTML = myInput.value
            myInput.remove();
            parentContainer.appendChild(myLable);
            parentContainer.appendChild(document.createElement('br'));
            desctiptionObject.checkList.push({id: checkBox.id, lable:myLable.innerHTML, isChecked:false});
            publicChecklistCount++;
            addChecklist();
        }; 

    });
}

document.addEventListener('keydown', escapeDescription);
getElement("#addCheckList").addEventListener('click', addChecklist);
