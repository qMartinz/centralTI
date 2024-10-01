let overlay = document.getElementById('task-edit');
let container = document.getElementById('edit-container');
let description = document.getElementById('description');
let title = document.getElementById('task-title');
let textarea = document.querySelector('.fake-text-area');
let edit = document.getElementById('description-edit');
let edittitle = document.getElementById('title-edit');
let edittextarea = document.getElementById('editor-textarea');
let btnsave = document.getElementById('save-edit');
let btncancel = document.getElementById('cancel-edit');

const emptyeditarea = `<p><br></p>`

container.classList.add('hide');
edit.classList.add('hide');
edittitle.classList.add('hide');

if (description.textContent === "") {
    description.classList.add('hide');
    textarea.classList.remove('hide');
} else {
    description.classList.remove('hide');
    textarea.classList.add('hide');
}

textarea.addEventListener('click', function (e) {
    e.preventDefault();
    description.classList.add('hide');
    textarea.classList.add('hide');
    edit.classList.remove('hide');
});

description.addEventListener('click', function (e) {
    e.preventDefault();
    description.classList.add('hide');
    textarea.classList.add('hide');
    edit.classList.remove('hide');
});

title.addEventListener('click', function (e) {
    e.preventDefault();
    title.classList.add('hide');
    edittitle.textContent = title.textContent;
    edittitle.classList.remove('hide');
    edittitle.focus();
});

edittextarea.addEventListener('keydown', function (e) {
    const p = edittextarea.querySelector('p');
    if (e.key === 'Backspace' && document.activeElement === edittextarea && p.innerHTML == `<br>` && edittextarea.childElementCount < 2) {
        e.preventDefault();
    }
});

edittitle.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && document.activeElement === edittitle) {
        e.preventDefault();

        if (!(/^\s*$/.test(edittitle.textContent))) {
            title.textContent = edittitle.textContent.trim();
            title.classList.remove('hide');
            edittitle.classList.add('hide');
        }
    }
});

edittitle.addEventListener('focusout', function (e) {
    if (!(/^\s*$/.test(edittitle.textContent))) {
        title.textContent = edittitle.textContent.trim();
        title.classList.remove('hide');
        edittitle.classList.add('hide');
    }
});

function editSave(e) {
    const p = edittextarea.querySelector('p');
    if (p.innerHTML == `<br>` && edittextarea.childElementCount < 2) { description.innerHTML = ''; } else { description.innerHTML = edittextarea.innerHTML; }

    textarea.classList.remove('hide');
    edit.classList.add('hide');

    if (description.innerHTML !== '') {
        description.classList.remove('hide');
        textarea.classList.add('hide');
    }

    if (description.innerHTML === '') {
        edittextarea.innerHTML = emptyeditarea;
        description.innerHTML = ``;
    } else {
        edittextarea.innerHTML = description.innerHTML;
    }
}

function editCancel(e) {
    edit.classList.add('hide');
    if (description.innerHTML === '') {
        edittextarea.innerHTML = emptyeditarea;
        textarea.classList.remove('hide');
    } else {
        edittextarea.innerHTML = description.innerHTML;
        description.classList.remove('hide');
    }
}

function openTaskEdit(id) {
    overlay.setAttribute('task-id', id);
    container.classList.remove('hide');
}

function closeTaskEdit() {
    overlay.setAttribute('task-id', '');
    container.classList.add('hide');
}