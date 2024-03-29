import './style.css';

let my_folder; // global for vite

let storedData = JSON.parse(localStorage.getItem('my_folder'));
if (Array.isArray(storedData)) {
    my_folder = storedData.map(folder => ({
    name: folder.name,
    tasks: Array.isArray(folder.tasks) ? folder.tasks.map(task => ({ ...task })) : []
  }));
}else {
    my_folder = [];
    localStorage.setItem('my_folder', JSON.stringify(my_folder));
}


const FolderModal = document.querySelector('.folderModal');
const TasksRenderPlace = document.querySelector('.tasks');
const DestroyFolderModal = document.querySelector('.DestroyFolderModal');
const addNewTaskModal = document.querySelector('.createNewTaskModal')
const Modals = document.querySelectorAll('dialog');
const FolderNameInput = document.querySelector('#FolderName');
const FoldersRenderPlace = document.querySelector('.folders')

window.addEventListener('load', function() {
  RenderFolders();
  defaultFolderSelect();
  RenderTasks();

  //Clicking outside the modal closes it
  Modals.forEach(modal => {
    modal.addEventListener("click", e => {
      const dialogDimensions = modal.getBoundingClientRect();
      if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
      ) {
        modal.close();
      }
    });
  });

  const folderButtons = document.querySelectorAll('.FolderButton button');
  folderButtons.forEach(button => {
    button.addEventListener('click', function() {
      const selectedButton = document.querySelector('.FolderButton button[id="selected"]');
      if (selectedButton) {
        selectedButton.removeAttribute('id');
      }
      button.setAttribute('id', 'selected');
      RenderTasks();
    });
  });

  const createFolderButton = document.getElementById('createFolderButton');
  createFolderButton.addEventListener('click', function() {
    const folderNameInput = document.getElementById('FolderName');
    CreateNewFolder(folderNameInput.value);
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

  const addTaskButton = document.querySelector('#createNewTaskButton')
  const nameOfNewTask = document.querySelector('#TaskName')
  const descr = document.querySelector('#TaskDescription')

  addTaskButton.addEventListener('click', function() {
    const selectedButton = document.querySelector('.FolderButton button[id="selected"]');
    RenderTasks();
    if (selectedButton) {
      const folderName = selectedButton.textContent;
      const newTask = {
        name: nameOfNewTask.value,
        description: descr.value,
        isDone: false,
      };

      const index = Array.from(selectedButton.parentNode.parentNode.children).indexOf(selectedButton.parentNode);
      const selectedFolder = my_folder[index];

      if (!selectedFolder.hasOwnProperty('tasks')) {
        selectedFolder.tasks = [];
      }

      AddNewTask(index, nameOfNewTask.value, descr.value);
      addNewTaskModal.close();
    }
  });

});

function defaultFolderSelect(){
  const defaultSelect = document.querySelector('.FolderButton button');
  if (defaultSelect) {
    defaultSelect.setAttribute('id', 'selected');
  }
  RenderTasks();
}

// Showing and hiding Modals
const OpenNewFolderModal = document.querySelector('.newFolder')
OpenNewFolderModal.addEventListener("click", () => {
  FolderModal.showModal();
})

const OpenDestroyFolderModal = document.querySelector('.OpenDestroyFolderModal')
const nameOfDeletingFolder = document.querySelector('#nameOfDeletingFolder')

OpenDestroyFolderModal.addEventListener("click", () => {
  nameOfDeletingFolder.innerHTML = document.querySelector('.FolderButton button[id="selected"]').textContent;
  DestroyFolderModal.showModal();
})

const CloseDestroyFolderModal = document.querySelector('.closeDestroyFolderModal')
CloseDestroyFolderModal.addEventListener("click", () => {
  DestroyFolderModal.close();
})

const addTaskButton = document.querySelector('.addNewTask')
addTaskButton.addEventListener('click', function(){
  console.log('true');
  addNewTaskModal.showModal()
})

export function CreateNewFolder(folderName) {
  if (folderName === '') {
    console.log('Value should not be empty');
  } else {
    const newFolder = {
      name: folderName,
      tasks: []
    };
    my_folder.push(newFolder);
    localStorage.setItem('my_folder', JSON.stringify(my_folder));

    RenderFolders();
    defaultFolderSelect();
    FolderNameInput.value = '';
    FolderModal.close();
    console.log(my_folder);
  }
}

function AddNewTask(folderIndex, taskName, taskDescription) {
  const newTask = {
    name: taskName,
    description: taskDescription,
    isDone: false,
    status: 'todo'
  };

  my_folder[folderIndex].tasks.push(newTask);
  localStorage.setItem('my_folder', JSON.stringify(my_folder, (key, value) => {
    if (key === 'tasks' && Array.isArray(value)) {
      return value.map(task => ({ ...task }));
    }
    return value;
  }));
  localStorage.setItem('my_folder', JSON.stringify(my_folder));

  RenderTasks();

  console.log(`Created new task in folder: ${my_folder[folderIndex]}`);
  console.log(my_folder[folderIndex]);
}

function priorityColorChange(folderIndex, taskIndex) {

  const task = my_folder[folderIndex].tasks[taskIndex];

  if (task.status === 'done') {
    task.status = 'inProgress';
  } else if (task.status === 'inProgress') {
    task.status = 'todo';
  } else if (task.status === 'todo') {
    task.isDone = false;
    task.status = 'done';
  }

  localStorage.setItem('my_folder', JSON.stringify(my_folder));
  RenderTasks();
}

function getPriorityClass(isDone, status) {
  switch (status) {
    case 'done':
      return 'done';
    case 'inProgress':
      return 'inProgress';
    case 'todo':
      return 'todo';
    default:
      console.error('Unknown status:', status);
      return '';
  }
}



function removeTask(folderIndex, taskIndex) {
  const task = my_folder[folderIndex].tasks[taskIndex];

  if (folderIndex >= 0 && folderIndex < my_folder.length && task.status == 'done') {
    const folder = my_folder[folderIndex];
    if (taskIndex >= 0 && taskIndex < folder.tasks.length) {
      folder.tasks.splice(taskIndex, 1);
      localStorage.setItem('my_folder', JSON.stringify(my_folder));
      RenderTasks();
    }
  }
}



function RenderTasks() {
  TasksRenderPlace.innerHTML = '';

  const selectedButton = document.querySelector('.FolderButton button[id="selected"]');
  if (selectedButton) {
    const index = Array.from(selectedButton.parentNode.parentNode.children).indexOf(selectedButton.parentNode);
    const selectedFolder = my_folder[index];

    if (selectedFolder.hasOwnProperty('tasks')) {
      selectedFolder.tasks.forEach((task, taskIndex) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="task">
            <div class="title_control">
              <button class="priorityButton ${getPriorityClass(task.isDone, task.status)}" data-index="${index}" data-task-index="${taskIndex}"></button>
              <div class="taskName ${getPriorityClass(task.isDone, task.status)}">
                <h3>${task.name} </h3>
              </div>
              <button class="deleteTask" data-index="${index}" data-task-index="${taskIndex}">
                <img src='xSolid.svg' alt='Close Button'>
              </button>
            </div>
            <div class="taskDescription">
              ${task.description}
            </div>
          </div>
        `;

        const priorityButton = li.querySelector(".priorityButton");
        const deleteButton = li.querySelector(".deleteTask");

        priorityButton.addEventListener("click", handlePriorityButtonClick);
        deleteButton.addEventListener("click", handleDeleteButtonClick);

        TasksRenderPlace.appendChild(li);
      });
    }
  }
}

function handlePriorityButtonClick(event) {
  const index = event.target.getAttribute("data-index");
  const taskIndex = event.target.getAttribute("data-task-index");
  priorityColorChange(index, taskIndex);
}

function handleDeleteButtonClick(event) {
  const index = event.target.getAttribute("data-index");
  const taskIndex = event.target.getAttribute("data-task-index");
  removeTask(index, taskIndex);
}



function RenderFolders() {
  FoldersRenderPlace.innerHTML = '';

  my_folder.forEach((element, index) => {
    const button = document.createElement('button');
    button.textContent = element.name;
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
