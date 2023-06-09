let Folders = [];


const OpenNewFolderModal = document.querySelector('.newFolder')
const CloseNewFolderModal = document.querySelector('.closeNewFolderModal')
const FolderModal = document.querySelector('.folderModal');
const Modal = document.querySelector('dialog')



OpenNewFolderModal.addEventListener("click", () => {
    FolderModal.showModal();
    console.log("test1");
})

CloseNewFolderModal.addEventListener("click", () => {
    FolderModal.close();
})

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