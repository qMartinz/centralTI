let user = "Guga"

// Insira seu token de API do ClickUp aqui
const API_TOKEN = 'pk_75583978_2TF3DEM16IX8LW2CXX368H1M8NYYHD2S';
// ID da lista do ClickUp que você quer obter tarefas
const LIST_ID = '901105559393';

// Função para obter dados de tarefas
async function fetchClickUpTasks() {
    const response = await fetch(`https://api.clickup.com/api/v2/list/${LIST_ID}/task`, {
        method: 'GET',
        headers: {
            'Authorization': API_TOKEN
        }
    });
    const data = await response.json();
    return data.tasks;
}

// Função para exibir as tarefas no HTML
function displayTasks(tasks, element) {
    element.innerHTML = ''; // Limpar conteúdo anterior

    tasks.filter(task => {
        var assignees = task.assignees
            .filter(({ username }) => username !== "") // Filtra os assignees que têm username não nulo
            .map(({ username }) => username);
        var names = [];
        assignees.forEach(name => name.indexOf(' ') > -1 ? names.push(name.substring(0, name.indexOf(' '))) : names.push(name));

        console.log(names, names.length, user);
        return names.includes(user) || names.length < 1;
    }).sort((a, b) => Number(a.priority.id) - Number(b.priority.id)).forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');

        taskElement.onclick = function () { window.open(task.url, '_blank').focus() };

        var priorityString;
        switch (task.priority.id) {
            case '1':
                priorityString = 'Urgente';
                break;
            case '2':
                priorityString = 'Alta';
                break;
            case '3':
                priorityString = 'Normal';
                break;
            case '4':
                priorityString = 'Baixa';
                break;
        }

        var assignees = task.assignees
            .filter(({ username }) => username !== "") // Filtra os assignees que têm username não nulo
            .map(({ username }) => username);
        var names = [];
        assignees.forEach(name => name.indexOf(' ') > -1 ? names.push(name.substring(0, name.indexOf(' '))) : names.push(name));

        console.log(task.name, task.due_date);

        taskElement.innerHTML = `<h3>${task.name}</h3>
        <p class="task-status">${task.status.status.charAt(0).toUpperCase() + task.status.status.slice(1)}</p>
        <p class="task-property">Prioridade: <span class="task-priority">${priorityString}</span></p>
        ${assignees.length > 0 ? `<p class="task-property">Responsáveis: ${names.join(', ')}</p>`: ``}
        ${task.due_date ? `<p class="task-property">Data: ${new Date(Number(task.due_date)).toLocaleDateString()}</p>`: ``}`;

        var status;
        switch (task.status.id) {
            case 'sc901105559393_BJjZ8bHb':
                status = 0;
                break;

            case 'sc901105559393_KMPJFKlq':
                status = 1;
                break;

            default:
                status = null;
                break;
        }

        taskElement.setAttribute('status', status);
        taskElement.setAttribute('priority', Number(task.priority.id));
        element.appendChild(taskElement);
    });
}

function getTaskAmount(element) {
    fetchClickUpTasks().then(tasks => {
        tasks = tasks.filter(task => task.status.id !== 'sc901105559393_soGxgYLh').filter(task => {
            var assignees = task.assignees
                .filter(({ username }) => username !== "") // Filtra os assignees que têm username não nulo
                .map(({ username }) => username);
            var names = [];
            assignees.forEach(name => name.indexOf(' ') > -1 ? names.push(name.substring(0, name.indexOf(' '))) : names.push(name));
    
            console.log(names, names.length, user);
            return names.includes(user) || names.length < 1;
        });
        console.log(tasks);
        element.innerHTML = `${tasks.length}`;
    }).catch(error => {
        console.error('Erro ao buscar tarefas:', error);
        document.getElementById('tasks').innerText = 'Erro ao carregar tarefas';
    });
}

// Inicialização
function getTasks(element) {
    fetchClickUpTasks().then(tasks => {
        tasks = tasks.filter(task => task.status.id !== 'sc901105559393_soGxgYLh');
        displayTasks(tasks, element);
    }).catch(error => {
        console.error('Erro ao buscar tarefas:', error);
        document.getElementById('tasks').innerText = 'Erro ao carregar tarefas';
    });
}

function onLogin() {
    var content = document.getElementById('content');
    content.innerHTML = `<iframe src="html/inicio.html" onload="this.insertAdjacentHTML('afterend', (this.contentDocument.body||this.contentDocument).innerHTML);this.remove();welcome();"></iframe>`;

}

function onLoginError(err) {
    console.error('Error on login', err);
}

function onLogout() {
    var content = document.getElementById('content');
    content.innerHTML = '';
}

function welcome() {
    gapi.client.load('people', 'v1', function () {
        gapi.client.people.people.get({
            resourceName: "people/me",
            personFields: "names"
        }).then((response) => {
            document.getElementById('user').textContent = `Olá, ${response.result.names[0].givenName}!`;
            user = response.result.names[0].givenName;
            getTasks(document.getElementById('tasks'));
            getTaskAmount(document.getElementById('tasks-amount'));
        }).catch((error) => {
            console.error('Error on info get', error);
        });
    });

    document.getElementById('date').textContent = `Hoje é ${new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })}.`;
}

function changeContent(src) {
    var content = document.getElementById('content');
    content.innerHTML = `<iframe src="${src}" onload="this.insertAdjacentHTML('afterend', (this.contentDocument.body||this.contentDocument).innerHTML);this.remove();"></iframe>`;
}