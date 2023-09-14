const api_key = "9f43ef81-239f-47ac-87ac-87b7922d101c";
const api_host = 'https://todo-api.coderslab.pl';


function apiListTasks() {
    return fetch(`${api_host}/api/tasks`,
        {
            headers: {Authorization: api_key}
        })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Can not connection with api/tasks')
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}

function apiListOperationsForTask(taskId) {
    return fetch(`${api_host}/api/tasks/${taskId}/operations`, {
        headers: {Authorization: api_key}
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Can not connection with api/tasks/${taskId}/operations")
            }
        })
        .catch(function (error) {
            console.log(error)
        });
}

function apiCreateTask(title, description) {
    return fetch(`${api_host}/api/tasks`, {
        headers: {
            'Authorization': api_key,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: title, description: description, status: 'open'}),
        method: 'POST'
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Can not connection with api/tasks")
            }
        })
        .catch(function (error) {
            console.log(error)
        });
}

function apiCreateOperation(description, taskId) {
    return fetch(`${api_host}/api/tasks/${taskId}/operations`, {
        headers: {
            'Authorization': api_key,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({description: description, timeSpent: 0})
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Can not connection with api/tasks/${taskId}/operations")
            }
        })
        .catch(function (error) {
            console.log(error)
        });
}

function apiDeleteTask(taskId) {
    return fetch(`${api_host}/api/tasks/${taskId}`, {
        headers: {'Authorization': api_key},
        method: 'DELETE'
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Can not connection with api/tasks/${taskId}")
            }
        })
        .catch(function (error) {
            console.log(error)
        });
}

function apiDeleteOperation(operationId) {
    return fetch(`${api_host}/api/operations/${operationId}`, {
        headers: {'Authorization': api_key},
        method: 'DELETE'
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Can not connection with api/tasks")
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function apiUpdateOperation(operationId) {
    return fetch(`${api_host}/api/operations/${operationId}`, {
        headers: {'Authorization': api_key},
        method: 'PUT'
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Can not connection with api/operation")
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function apiUpdateTask(taskId, title, description, status) {
    return fetch(`${api_host}/api/tasks/${taskId}`, {
        headers: {
            'Authorization': api_key,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: title, description: description, status: status}),
        method: 'UPDATE'
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Can not connection with api/operation")
            }
        }).catch(function (error) {
            console.log(error);
        });
}

function operationListenerOnInput(descriptionInput, addOperationForm, addOperationButton) {
    descriptionInput.addEventListener('input', function () {
        const errorMessage = addOperationForm.getElementById('operation-error-message');
        const shortDescription = addOperationForm.getElementById('short-description');

        if (descriptionInput.value.length >= 5) {
            if (shortDescription) {
                shortDescription.remove();
            }
        }
        if (descriptionInput.value === '') {
            addOperationButton.disabled = true;
            if (shortDescription) {
                shortDescription.remove();
            }
            if (!errorMessage) {
                const error = document.createElement('span');
                error.innerText = 'Operation must contain a description';
                error.style.color = 'red';
                error.style.fontSize = '16px';
                error.id = 'operation-error-message';
                addOperationForm.appendChild(error);
            }
        } else {
            addOperationButton.disabled = false;
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    });
}

const taskAddForm = document.querySelector('.js-task-adding-form');
const taskTitleInput = taskAddForm.children[0].firstElementChild;
const addTaskButton = taskAddForm.lastElementChild;
addTaskButton.disabled = true;

taskTitleInput.addEventListener('input', function () {
    const errorMessage = taskAddForm.querySelector('#error-message');
    const shortTitleError = taskAddForm.querySelector('#short-title');

    if (taskTitleInput.value.length >= 5) {
        if (shortTitleError) {
            shortTitleError.remove();
        }
    }

    if (taskTitleInput.value === '') {
        addTaskButton.disabled = true;
        if (shortTitleError) {
            shortTitleError.remove();
        }
        if (!errorMessage) {
            const error = document.createElement('span');
            error.id = 'error-message';
            error.innerText = "Task must contain a title";
            error.style.color = 'red';
            error.style.fontSize = '0.9rem'
            taskAddForm.firstElementChild.appendChild(error);
        }
    } else {
        addTaskButton.disabled = false;
        if (errorMessage) {
            errorMessage.remove();
        }
    }
});

taskAddForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formElements = e.currentTarget.children;

    const title = formElements[0].firstElementChild.value;
    const description = formElements[1].firstElementChild.value;

    if (Object.is(title, "")) {
        return;
    }

    const shortTitle = taskAddForm.querySelector('#short-title');
    if (title.length < 5) {
        if (!shortTitle) {
            const error = document.createElement('span');
            error.id = 'short-title';
            error.innerText = "Title must be at least 5 characters long";
            error.style.color = 'red';
            error.style.fontSize = '0.9rem'
            taskAddForm.firstElementChild.appendChild(error);
            return;
        }
    }

    if (!(title.length < 5)) {
        apiCreateTask(title, description)
            .then(function (task) {
                renderTask(task.data.id, title, description, task.data.status);
            });
        e.currentTarget.reset();
        addTaskButton.disabled = true;
        if (shortTitle) {
            shortTitle.remove();
        }
    }
});

function operationListenerOnSubmit(addOperationForm, taskId, ul, status, addOperationBtn) {
    addOperationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formElements = e.currentTarget.elements;
        const description = formElements[0].value;

        if (Object.is(description, '')) {
            return;
        }

        const shortDescriptionError = addOperationForm.querySelector('#short-description');
        if (description.length < 5) {
            if (!shortDescriptionError) {
                const error = document.createElement('span');
                error.id = 'short-description';
                error.innerText = "Title must be at least 5 characters long";
                error.style.color = 'red';
                error.style.fontSize = '0.9rem'
                addOperationForm.appendChild(error);
                return;
            }
        }

        if (!(description.length < 5)) {
            apiCreateOperation(description, taskId).then(function (operation) {
                renderOperation(ul, status, operation.data.id, description, 0)
            });
            e.currentTarget.reset();
            addOperationBtn.disabled = true;
            if (shortDescriptionError) {
                shortDescriptionError.remove();
            }
        }
    });
}

apiListTasks().then(function (tasksList) {
    tasksList.data.forEach(function (task) {
        renderTask(task.id, task.title, task.description, task.status)
    });
});

function renderOperation(ul, status, operationID, operationDescription, timeSpent) {

    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerText = operationDescription;

    const badgeSpan = document.createElement('span');
    badgeSpan.className = 'badge badge-success badge-pill ml-2';
    badgeSpan.innerText = formatTime(timeSpent);

    descriptionDiv.appendChild(badgeSpan);
    li.appendChild(descriptionDiv);

    const buttonDiv = document.createElement('div');
    const button15m = document.createElement('button');
    const button1h = document.createElement('button');
    const buttonDelete = document.createElement('button');

    if (Object.is(status, 'open')) {

        button15m.className = 'btn btn-outline-success btn-sm mr-2 js-task-open-only';
        button15m.innerText = '+15m';
        button1h.className = 'btn btn-outline-success btn-sm mr-2 js-task-open-only';
        button1h.innerText = '+1h';
        buttonDelete.className = 'btn btn-outline-danger btn-sm js-task-open-only';
        buttonDelete.innerText = 'Delete';

        buttonDiv.appendChild(button15m);
        buttonDiv.appendChild(button1h);
        buttonDiv.appendChild(buttonDelete);

        button15m.addEventListener('click', function () {
            apiUpdateOperation(operationID, operationDescription, timeSpent += 15)
                .then(function (operation) {
                    badgeSpan.innerText = formatTime(operation.data.timeSpent);
                });
        });

        button1h.addEventListener('click', function () {
            apiUpdateOperation(operationID, operationDescription, timeSpent += 60)
                .then(function (operation) {
                    badgeSpan.innerText = formatTime(operation.data.timeSpent);
                });
        });

        buttonDelete.addEventListener('click', function () {
            apiDeleteOperation(operationID).then(function () {
                li.remove();
            });
        });

        li.appendChild(buttonDiv);

    }

    ul.appendChild(li);

}


function renderTask(taskId, title, description, status) {

    let mainElement = document.getElementById('app');

    let section = document.createElement('section');
    section.className = 'card mt-5 shadow-sm';

    let divMain = document.createElement('div');
    divMain.className = 'card-header d-flex justify-content-between align-items-center';
    let divTitle = document.createElement('div');

    let h5 = document.createElement('h5');
    h5.innerText = title;

    let h6 = document.createElement('h6');
    h6.className = 'card-subtitle text-muted';

    divTitle.appendChild(h5);
    divTitle.appendChild(h6);

    divMain.appendChild(divTitle);

    let divButton = document.createElement('div')

    if (Object.is(status, 'open')) {

        let finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only'
        finishButton.innerText = 'Finish';
        divButton.appendChild(finishButton);

        finishButton.addEventListener('clicl', function () {
            apiUpdateTask(taskId, title, description, 'closed')
                .then(function () {
                    const openTaskElement = section.querySelectorAll('.js-task-open-only');
                    openTaskElement.forEach(function (e) {
                        e.parentElement.removeChild(e);
                    })
                })
        })
    }
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';
    divButton.appendChild(deleteButton);

    deleteButton.addEventListener('click', function () {
        apiDeleteTask(taskId).then(function () {
            section.remove();
        })
    })
    divMain.appendChild(divButton);
    section.appendChild(divMain);

    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';

    apiListOperationsForTask(taskId).then(function (operationsList) {
        operationsList.data.forEach(function (operation) {
            renderOperation(ul, status, operation.id, operation.description, operation.timeSpent);
        });
    });

    section.appendChild(ul);
    if (Object.is(status, 'open')) {

        const formDiv = document.createElement('div');
        formDiv.className = 'card-body js-task-open-only';

        const addOperationForm = document.createElement('form');
        const inputsDiv = document.createElement('div');
        inputsDiv.className = 'input-group';
        const descriptionInput = document.createElement('input');
        descriptionInput.type = 'text';
        descriptionInput.placeholder = 'Operation description';
        descriptionInput.className = 'form-control';
        descriptionInput.id = 'description-input';
        inputsDiv.appendChild(descriptionInput);

        const addOperationBtnDiv = document.createElement('div');
        addOperationBtnDiv.className = 'input-group-append';

        const addOperationBtn = document.createElement('button');
        addOperationBtn.className = 'btn btn-info';
        addOperationBtn.innerText = 'Add';
        addOperationBtn.disabled = true;

        addOperationBtnDiv.appendChild(addOperationBtn);
        inputsDiv.appendChild(addOperationBtnDiv);

        addOperationForm.appendChild(inputsDiv);
        formDiv.appendChild(addOperationForm);

        operationListenerOnInput(descriptionInput, addOperationForm, addOperationBtn);
        operationListenerOnSubmit(addOperationForm, taskId, ul, status, addOperationBtn);
        section.appendChild(formDiv);
    }
    mainElement.appendChild(section);
}

function formatTime(timeSpent) {
    const hours = Math.floor(timeSpent / 60);
    const minutes = timeSpent % 60;
    if (hours > 0) {
        return hours + 'h ' + minutes + 'm';
    } else {
        return minutes + 'm';
    }
}

