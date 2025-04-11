document.addEventListener('DOMContentLoaded', function () {
    const API_URL = "backend/tasks.php";
    const COMMENTS_API_URL = "backend/comments.php";
    let isEditMode = false;
    let edittingId;
    let tasks = [];
    let isCommentEditMode = false;
    let edittingCommentId = null;

    async function loadTasks() {
        try {
            const response = await fetch(API_URL, { method: 'GET', credentials: 'include' });
            if (response.ok) {
                tasks = await response.json();
                renderTasks(tasks);
            } else {
                if (response.status == 401) {
                    window.location.href = "index.html";
                }
                console.error("Error al obtener tareas");
            }
        } catch (err) {
            console.error(err);
        }
    }

    function renderTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach(function (task) {
            let commentsList = '';
            if (task.comments && task.comments.length > 0) {
                commentsList = '<ul class="list-group list-group-flush">';
                task.comments.forEach(comment => {
                    commentsList += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${comment.description}
                        <div>
                            <button type="button" class="btn btn-secondary btn-sm edit-comment me-2" 
                                    data-taskid="${task.id}" data-commentid="${comment.id}">
                                Edit
                            </button>
                            <button type="button" class="btn btn-danger btn-sm delete-comment" 
                                    data-taskid="${task.id}" data-commentid="${comment.id}">
                                Delete
                            </button>
                        </div>
                    </li>`;
                });
                commentsList += '</ul>';
            }

            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text"><small class="text-muted">Due: ${task.due_date}</small></p>
                    ${commentsList}
                    <button type="button" class="btn btn-sm btn-link add-comment" data-taskid="${task.id}">Add Comment</button>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                </div>
            </div>
            `;
            taskList.appendChild(taskCard);
        });

        document.querySelectorAll('.edit-task').forEach(button => {
            button.addEventListener('click', handleEditTask);
        });

        document.querySelectorAll('.delete-task').forEach(button => {
            button.addEventListener('click', handleDeleteTask);
        });

        document.querySelectorAll('.add-comment').forEach(button => {
            button.addEventListener('click', handleAddComment);
        });

        document.querySelectorAll('.delete-comment').forEach(button => {
            button.addEventListener('click', handleDeleteComment);
        });

        document.querySelectorAll('.edit-comment').forEach(button => {
            button.addEventListener('click', handleEditComment);
        });
    }

    function handleEditTask(event) {
        try {
            const taskId = parseInt(event.target.dataset.id);
            const task = tasks.find(t => t.id === taskId);

            document.getElementById('task-title').value = task.title;
            document.getElementById('task-desc').value = task.description;
            document.getElementById('due-date').value = task.due_date;

            isEditMode = true;
            edittingId = taskId;

            const modal = new bootstrap.Modal(document.getElementById("taskModal"));
            modal.show();
        } catch (error) {
            alert("Error trying to edit a task");
            console.error(error);
        }
    }

    async function handleDeleteTask(event) {
        const id = parseInt(event.target.dataset.id);
        try {
            const response = await fetch(`${API_URL}?id=${id}`, {
                credentials: 'include',
                method: 'DELETE'
            });
            if (response.ok) {
                loadTasks();
            } else {
                console.error("Problema al eliminar la tarea");
            }
        } catch (err) {
            console.error(err);
        }
    }

    function handleAddComment(event) {
        isCommentEditMode = false;
        edittingCommentId = null;
        document.getElementById('comment-task-id').value = event.target.dataset.taskid;
        document.getElementById('task-comment').value = '';

        // Actualizar el título del modal
        document.getElementById('commentModalLabel').textContent = 'Add Comment';

        const modal = new bootstrap.Modal(document.getElementById("commentModal"));
        modal.show();
    }

    function handleEditComment(event) {
        try {
            const taskId = parseInt(event.target.dataset.taskid);
            const commentId = parseInt(event.target.dataset.commentid);
            const task = tasks.find(t => t.id === taskId);
            const comment = task.comments.find(c => c.id === commentId);

            isCommentEditMode = true;
            edittingCommentId = commentId;
            document.getElementById('comment-task-id').value = taskId;
            document.getElementById('task-comment').value = comment.description;

            document.getElementById('commentModalLabel').textContent = 'Edit Comment';

            const modal = new bootstrap.Modal(document.getElementById("commentModal"));
            modal.show();
        } catch (error) {
            alert("Error al editar el comentario");
            console.error(error);
        }
    }

    async function handleDeleteComment(event) {
        const commentId = parseInt(event.target.dataset.commentid);
        try {
            const response = await fetch(`${COMMENTS_API_URL}?id=${commentId}`, {
                credentials: 'include',
                method: 'DELETE'
            });

            if (response.ok) {
                loadTasks();
            } else {
                console.error("Problema al eliminar el comentario");
            }
        } catch (err) {
            console.error(err);
        }
    }

    document.getElementById('comment-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const comment = document.getElementById('task-comment').value;
        const taskId = document.getElementById('comment-task-id').value;

        try {
            let response;
            if (isCommentEditMode) {
                response = await fetch(`${COMMENTS_API_URL}?id=${edittingCommentId}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment })
                });
            } else {
                response = await fetch(COMMENTS_API_URL, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        task_id: taskId,
                        comment
                    })
                });
            }

            if (response.ok) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('commentModal'));
                modal.hide();
                loadTasks();
            } else {
                console.error(isCommentEditMode ? "No se pudo actualizar el comentario" : "No se pudo agregar el comentario");
            }
        } catch (err) {
            console.error(err);
        }
    });

    document.getElementById('task-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-desc").value;
        const dueDate = document.getElementById("due-date").value;

        if (isEditMode) {
            const response = await fetch(`${API_URL}?id=${edittingId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title, description: description, due_date: dueDate })
            });
            if (!response.ok) {
                console.error("no se pudo actualizar la tarea");
            }
        } else {
            const newTask = {
                title: title,
                description: description,
                due_date: dueDate
            };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify(newTask),
                credentials: 'include'
            });
            if (!response.ok) {
                console.error("No se pudo agregar la tarea");
            }
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        loadTasks();
    });

    document.getElementById('commentModal').addEventListener('show.bs.modal', function () {
        document.getElementById('comment-form').reset();
    });

    document.getElementById("commentModal").addEventListener('hidden.bs.modal', function () {
        edittingCommentId = null;
        isCommentEditMode = false;
        document.getElementById('commentModalLabel').textContent = 'Add Comment';
    });

    document.getElementById('taskModal').addEventListener('show.bs.modal', function () {
        if (!isEditMode) {
            document.getElementById('task-form').reset();
        }
    });

    document.getElementById("taskModal").addEventListener('hidden.bs.modal', function () {
        edittingId = null;
        isEditMode = false;
    });

    loadTasks();
});