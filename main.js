let my_folder = JSON.parse(localStorage.getItem('my_folder')) || []; 


const FolderModal = document.querySelector('.folderModal');
const DestroyFolderModal = document.querySelector('.DestroyFolderModal');
const Modal = document.querySelector('dialog')
const FolderNameInput = document.querySelector('#FolderName');
const FoldersRenderPlace = document.querySelector('.folders')


document.addEventListener('DOMContentLoaded', function() {
  RenderFolders();
  defaultFolderSelect()



  const folderButtons = document.querySelectorAll('.FolderButton button');
  folderButtons.forEach(button => {
    button.addEventListener('click', function() {
      const selectedButton = document.querySelector('.FolderButton button[id="selected"]');
      if (selectedButton) {
        selectedButton.removeAttribute('id');
      }
      button.setAttribute('id', 'selected');
    });
  });

  const destroyFolderButton = document.querySelector('.DestroyFolder');
  destroyFolderButton.addEventListener('click', function() {
    const selectedButton = document.querySelector('.FolderButton button[id="selected"]');
    if (selectedButton) {
      const li = selectedButton.parentNode;
      const folderName = selectedButton.textContent;
      const index = Array.from(li.parentNode.children).indexOf(li);
      my_folder.splice(index, 1);
      localStorage.setItem('my_folder', JSON.stringify(my_folder));
      li.parentNode.removeChild(li);

      defaultFolderSelect()
      DestroyFolderModal.close();
    }
  });

  const addTaskButton = document.querySelector('.addNewTask');
  addTaskButton.addEventListener('click', function() {
    const selectedButton = document.querySelector('.FolderButton button[id="selected"]');
    if (selectedButton) {
      const folderName = selectedButton.textContent;
      const newTask = {
        name: 'New Task',
        // Dodaj inne właściwości zadania
      };

      const index = Array.from(selectedButton.parentNode.parentNode.children).indexOf(selectedButton.parentNode);
      const selectedFolder = my_folder[index];
      selectedFolder.tasks.push(newTask);

      // Aktualizuj localStorage lub wykonaj inne odpowiednie działania
      localStorage.setItem('my_folder', JSON.stringify(my_folder));

      console.log(`Created new task in folder: ${folderName}`);
      console.log(selectedFolder);
    }
  });
});

function defaultFolderSelect(){
  const defaultSelect = document.querySelector('.FolderButton button');
      if (defaultSelect) {
        defaultSelect.setAttribute('id', 'selected');
      }
}


// Showing and hiding Modals
const OpenNewFolderModal = document.querySelector('.newFolder')
OpenNewFolderModal.addEventListener("click", () => {
    FolderModal.showModal();
})
const CloseNewFolderModal = document.querySelector('.closeNewFolderModal')
CloseNewFolderModal.addEventListener("click", () => {
    FolderModal.close();
})

const OpenDestroyFolderModal = document.querySelector('.OpenDestroyFolderModal')
OpenDestroyFolderModal.addEventListener("click", () => {
    DestroyFolderModal.showModal();
})
const CloseDestroyFolderModal = document.querySelector('.closeDestroyFolderModal')
CloseDestroyFolderModal.addEventListener("click", () => {
    DestroyFolderModal.close();
})




//Clicking outside of the modal closes it 
Modal.addEventListener("click" , e =>{
  const dialogDimensions = Modal.getBoundingClientRect();
  if(
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ){
    Modal.close()
  }
})

function CreateNewFolder(...NameOfFolder){
  if(FolderNameInput.value === ''){
    console.log('Value should not be empty');
  }else{
    my_folder.push(NameOfFolder);
    localStorage.setItem('my_folder', JSON.stringify(my_folder)); 

    RenderFolders();
    defaultFolderSelect();
    FolderNameInput.value = '';
    FolderModal.close();
    console.log(my_folder);
  }
}





function RenderFolders() {
  FoldersRenderPlace.innerHTML = '';

  my_folder.forEach((element, index) => {
    const button = document.createElement('button');
    button.textContent = element;
    button.addEventListener('click', function() {
      const selectedButton = document.querySelector('.FolderButton button[id="selected"]');
      if (selectedButton) {
        selectedButton.removeAttribute('id');
      }
      button.setAttribute('id', 'selected');
    });

    const li = document.createElement('li');
    li.classList.add('FolderButton');
    li.appendChild(button);

    FoldersRenderPlace.appendChild(li);
  });
}
