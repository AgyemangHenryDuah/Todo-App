document.addEventListener('DOMContentLoaded', () => {
    // Add Todo
    document.getElementById('submitAddTodo').addEventListener('click', async () => {
        const form = document.getElementById('addTodoForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to add todo');
            }

            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    });

    // Edit Todo
    document.querySelectorAll('.edit-todo').forEach(button => {
        button.addEventListener('click', (e) => {
            const todo = JSON.parse(e.target.dataset.todo);
            const form = document.getElementById('editTodoForm');

            form.elements.id.value = todo.id;
            form.elements.title.value = todo.title;
            form.elements.description.value = todo.description;
            form.elements.status.value = todo.status;
        });
    });

    // Submit Edit
    document.getElementById('submitEditTodo').addEventListener('click', async () => {
        const form = document.getElementById('editTodoForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const id = data.id;
        delete data.id;

        try {
            const response = await fetch(`/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update todo');
            }

            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    });

    // Delete Todo
    document.querySelectorAll('.delete-todo').forEach(button => {
        button.addEventListener('click', async (e) => {
            if (!confirm('Are you sure you want to delete this todo?')) {
                return;
            }

            const todoId = e.target.closest('.card').dataset.todoId;

            try {
                const response = await fetch(`/todos/${todoId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to delete todo');
                }

                e.target.closest('.card').remove();
            } catch (error) {
                alert(error.message);
            }
        });
    });

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
});