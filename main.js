let storedData = JSON.parse(localStorage.getItem('my_folder'));
if (Array.isArray(storedData)) {
  my_folder = storedData.map(folder => ({
    name: folder.name,
    tasks: Array.isArray(folder.tasks) ? folder.tasks.map(task => ({ ...task })) : []
  }));
}

const FolderModal = document.querySelector('.folderModal');
const TasksRenderPlace = document.querySelector('.tasks');
const DestroyFolderModal = document.querySelector('.DestroyFolderModal');
const addNewTaskModal = document.querySelector('.createNewTaskModal')
const Modals = document.querySelectorAll('dialog');
const FolderNameInput = document.querySelector('#FolderName');
const FoldersRenderPlace = document.querySelector('.folders')

document.addEventListener('DOMContentLoaded', function() {
  RenderFolders();
  defaultFolderSelect();
  RenderTasks();

  //Clicking outside of the modal closes it
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

const addTaskButton = document.querySelector('.addNewTask')
addTaskButton.addEventListener('click', function(){
  console.log('true');
  addNewTaskModal.showModal()
})
const closeNewTaskModal = document.querySelector('.closeNewTaskModal')
closeNewTaskModal.addEventListener("click", () => {
  addNewTaskModal.close();
})

function CreateNewFolder(folderName) {
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
    status: 'todo' // Dodajemy deklarację statusu z wartością "todo"
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

function priorityColorChange(taskIndex) {
  my_folder.forEach((folder, folderIndex) => {
    folder.tasks.forEach((task, index) => {
      if (index === taskIndex) {
        if (task.status === 'done') {
          task.status = 'inProgress';
        } else if (task.status === 'inProgress') {
          task.status = 'todo';
        } else if (task.status === 'todo') {
          task.isDone = false;
          task.status = 'done';
        }
      }
    });
  });
  localStorage.setItem('my_folder', JSON.stringify(my_folder));
  RenderTasks();
}



function getPriorityClass(isDone, status) {
  if (isDone) {
    return 'done';
  } else {
    if (status === 'inProgress') {
      return 'inProgress';
    } else if (status === 'todo') {
      return 'todo';
    } else {
      return '';
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
      selectedFolder.tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <button class="priorityButton ${getPriorityClass(task.isDone, task.status)}" onclick="priorityColorChange(${index})"></button>
          <div class="taskName ${getPriorityClass(task.isDone, task.status)}">
            <h2>${task.name}</h2>
          </div>
          &nbsp
          <div class="taskDescription">
            ${task.description}
          </div>
          <button class="deleteTask" onclick="my_folder[${index}].tasks.splice(${index}, 1); localStorage.setItem('my_folder', JSON.stringify(my_folder)); RenderTasks();">Delete</button>
        `;

        TasksRenderPlace.appendChild(li);
      });
    }
  }
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
