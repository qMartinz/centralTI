let user = "Guga";
let agendamentos = [];

// Insira seu token de API do ClickUp aqui
const API_TOKEN = 'pk_75583978_2TF3DEM16IX8LW2CXX368H1M8NYYHD2S';
// ID da lista do ClickUp que você quer obter tarefas
const LIST_ID = '901105559393';

function getAgendamentos(agendamentosData) {
    let agndmnts = [];
    for (id = 0; id < agendamentosData.length; id++) {
        const element = agendamentosData[id];
        let agendamento = {};
        let chromesAgendados = [];
        Object.entries(element).forEach(element2 => {
            if (element2[0].startsWith("chrome") && element2[1] === "on") {
                chromesAgendados.push(element2[0]);
            } else if (!element2[0].startsWith("chrome")) {
                agendamento[element2[0]] = element2[1];
            }

            agendamento.chromes = chromesAgendados;
            agendamento.id = id;
        });
        agndmnts.push(agendamento);
    }
    return agndmnts;
}

/**
* 
* @param {Date} emprestimo Horário de empréstimo do agendamento
* @param {Date} devolucao Horário de devolução do agendamento
* @param {boolean} devolvido Verdadeiro caso o agendamento já tenha sido devolvido
* @returns {number} Valor de 0 à 2 correspondente ao status do agendamento
*/
function getStatus(emprestimo, devolucao, devolvido) {
    var status = 0
    var pastEmprestimo = new Date() >= new Date(emprestimo);
    var pastDevolucao = new Date() > new Date(devolucao);

    if (devolvido) return status;

    if (!pastDevolucao && pastEmprestimo) {
        status = 1;
    }

    if (pastDevolucao) {
        status = 2;
    }

    return status;
}

/**
* @param {number} id Número de 0 à 16 correspondente à turma que o agendamento é destinado
* @returns {string} Texto correspondente ao número especificado
*/
function getTurma(id) {
    switch (id) {
        case 0:
            return "Maternal";
        case 1:
            return "Jardim";
        case 2:
            return "Pré";
        case 3:
            return "1º Ano";
        case 4:
            return "2º Ano";
        case 5:
            return "3º Ano";
        case 6:
            return "4º Ano";
        case 7:
            return "5º Ano";
        case 8:
            return "6º Ano";
        case 9:
            return "7º Ano";
        case 10:
            return "8º Ano";
        case 11:
            return "9º Ano";
        case 12:
            return "1º Médio";
        case 13:
            return "2º Médio";
        case 14:
            return "3º Médio";
        case 15:
            return "Bilíngue";
        case 16:
            return "Uso Próprio";
        default:
            return "Turma Inválida";
    }
}

/**
* @param {number} status Número de 0 à 2 que define o status do agendamento
* @returns {string} O status no formato de texto
*/
function getStatusString(status) {
    switch (status) {
        case 0:
            return "Agendado";
        case 1:
            return "Em uso";
        case 2:
            return "Aguardando devolução";
        default:
            return "Status inválido";
    }
}

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
        ${assignees.length > 0 ? `<p class="task-property">Responsáveis: ${names.join(', ')}</p>` : ``}
        ${task.due_date ? `<p class="task-property">Data: ${new Date(Number(task.due_date)).toLocaleDateString()}</p>` : ``}`;

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
        }).then(async (response) => {
            document.getElementById('user').textContent = `Olá, ${response.result.names[0].givenName}!`;
            user = response.result.names[0].givenName;
            getTasks(document.getElementById('tasks'));
            getTaskAmount(document.getElementById('tasks-amount'));
            document.getElementById('side-content').hidden = false;
            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: '1C7Gg6vy9G0ZYQWYzI51orZpFcrI3QVHeXBXKN2VokaE',
                range: 'B2'
            }).then(function (response) {
                document.getElementById('qotd').innerHTML = `${response.result.values[0][0]}`;
            });

            await getSheetDataCallback("Agendamentos", (sheetData) => {
                agndmnts = [];
                for (var id = 0; id < sheetData.length; id++) {
                    const element = sheetData[id];
                    element.id = id;
                    agndmnts.push(element);
                }
                agendamentos = getAgendamentos(agndmnts).filter(agend => (getStatus(agend.emprestimohora, agend.devolucaohora, agend.devolvido) == 2 || new Date(agend.emprestimohora).getDate() == new Date().getDate()) && !agend.devolvido);

                appointmentTableCreate();
            });

            document.getElementById('appointments-amount').innerHTML = `${agendamentos.length}`;
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

async function showChromeList(id) {
    console.log(agendamentos);
    console.log(agendamentos.find(a => a.id == id));
    let chrms = agendamentos.find(a => a.id == id).chromes;

    const listaDiv = document.getElementById("listaChromes")
    listaDiv.hidden = false;

    const lista = listaDiv.querySelector("ul");
    lista.innerHTML = "";
    chrms.forEach(chrome => {
        const item = document.createElement("li");
        item.textContent = "Chrome " + chrome.replace("chrome", "");
        lista.appendChild(item);
    });
}

function returnChromeList() {
    document.getElementById('listaChromes').hidden = true;
    document.getElementById("listaChromes").querySelector("ul").innerHTML = "";
}

/**
* Cria uma linha de tabela para o agendamento especificado
* @param {Object} agendamento O objeto com os dados do agendamento
*/
function appointmentRowCreate(agendamento) {
    const linha = document.createElement("tr");
    document.getElementById("appointments").appendChild(linha);

    const id = document.createElement("td");
    id.textContent = agendamento.id;

    const data = document.createElement("td");
    let dmadata = agendamento.Date.split("T")[0].split("-");
    data.textContent = dmadata[2] + "/" + dmadata[1] + "/" + dmadata[0] + " às " + agendamento.Date.split("T")[1];

    const horainicio = document.createElement("td");
    let dmahorainicio = agendamento.emprestimohora.split("T")[0].split("-");
    horainicio.textContent = dmahorainicio[2] + "/" + dmahorainicio[1] + "/" + dmahorainicio[0] + " às " + agendamento.emprestimohora.split("T")[1];

    const horafim = document.createElement("td");
    let dmahorafim = agendamento.devolucaohora.split("T")[0].split("-");
    horafim.textContent = dmahorafim[2] + "/" + dmahorafim[1] + "/" + dmahorafim[0] + " às " + agendamento.devolucaohora.split("T")[1];

    const turma = document.createElement("td");
    turma.textContent = getTurma(agendamento.turma);

    const nome = document.createElement("td");
    nome.textContent = agendamento.nome;

    const email = document.createElement("td");
    email.textContent = agendamento.email;

    const status = document.createElement("td");
    status.textContent = getStatusString(getStatus(agendamento.emprestimohora, agendamento.devolucaohora, agendamento.devolvido));

    const chromes = document.createElement("td");
    var btnChromes = document.createElement("button");
    btnChromes.textContent = agendamento.chromes.length + " Chromes";
    btnChromes.classList.add("chromes");
    btnChromes.id = agendamento.id;
    btnChromes.onclick = function (e) { showChromeList(e.target.id); };
    chromes.appendChild(btnChromes);

    const obs = document.createElement("td");
    obs.textContent = agendamento["obs"];

    const obsdevol = document.createElement("td");
    obsdevol.textContent = agendamento["obsdevolucao"];

    const devolvido = document.createElement("td");
    var btnDevolvido = document.createElement("button");
    btnDevolvido.textContent = "Registrar";
    btnDevolvido.classList.add("devolvido");
    btnDevolvido.id = agendamento.id;
    btnDevolvido.onclick = function (e) {
        document.getElementById("devolucaoform-wrapper").hidden = false;
        document.getElementById("devolucaoform").querySelector('button[type="submit"]').id = e.target.id;
    };
    devolvido.appendChild(btnDevolvido);

    linha.appendChild(id);
    linha.appendChild(data);
    linha.appendChild(horainicio);
    linha.appendChild(horafim);
    linha.appendChild(turma);
    linha.appendChild(nome);
    linha.appendChild(email);
    linha.appendChild(status);
    linha.appendChild(chromes);
    linha.appendChild(obs);
    linha.appendChild(devolvido);
}

/**
* Cria a tabela com os agendamentos ainda não arquivados
*/
function appointmentTableCreate() {
    const firstChild = document.getElementById("appointments").firstElementChild;
    document.getElementById("appointments").innerHTML = "";
    document.getElementById("appointments").append(firstChild);

    // Filtra e ordena os agendamentos para criar uma linha na tabela para cada agendamento
    agendamentos.forEach(a => appointmentRowCreate(a));
}

/**
* Evento acionado quando o usuário registra um agendamento como devolvido
*/
document.getElementById("devolucaoform").addEventListener("submit", function (e) {
    let form = document.getElementById("devolucaoform");
    let submitButton = form.querySelector("[type='submit']");
    if (submitButton) submitButton.disabled = true;

    e.preventDefault();

    // Arquiva o agendamento
    registerReturn(e.target.querySelector('button[type="submit"]').id);

    const data = new FormData(e.target);
    const action = e.target.action;
    fetch(action, {
        method: 'POST',
        body: data,
    })
        .then(() => {
            form.hidden = true;
            form.reset();
            submitButton.disabled = false;
        });
});

/**
* Arquiva o agendamento e o define como devolvido
* @param {number} id Id do agendamento a ser devolvido
*/
async function registerReturn(id) {
    document.querySelectorAll(".devolvido").forEach(btn => btn.disabled = true);

    const range = "Agendamentos!" + "A" + (Number(id) + 2).toString();

    const data = {
        properties: "on"
    };

    const values = [
        ["on"]
    ];

    const resource = {
        values,
    };

    try {
        const result = await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: '1CJybEPi2DvzoqQjYFjCcbi8AyQlptxlT0uV9aTggFbk',
            range: range,
            valueInputOption: 'RAW',
            resource,
        });
    } catch (err) {
        console.error('Erro ao adicionar dados:', err);
    }
    document.getElementById('loading').hidden = false;
    addToArchive(agendamentos.find(a => a.id == id));
}

/**
* Adiciona o agendamento especificado à planilha de arquivados
* @param {Object} agendamento Os dados do agendamento
*/
async function addToArchive(agendamento) {
    const sheetrange = 'Arquivados';

    // Cria um array organizado com os valores a serem enviados para a planilha
    var agendValues = agendamento;
    delete agendValues.devolvido;
    agendValues.obsdevolucao = document.forms["devolucaoform"]["obs"].value;
    agendValues.id = agendValues.id.toString();
    agendValues.turma = agendValues.turma.toString();
    const values = [
        [agendValues.id, agendValues.Date, agendValues.emprestimohora, agendValues.devolucaohora, agendValues.turma, agendValues.nome, agendValues.email]
    ];

    for (let id = 0; id < 30; id++) {
        if (agendValues.chromes.includes("chrome" + id)) {
            values[0].push("on");
        } else {
            values[0].push("");
        }
    }

    values[0].push(agendValues.obs, agendValues.obsdevolucao);

    const resource = {
        values,
    };

    try {
        const result1 = await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: '1CJybEPi2DvzoqQjYFjCcbi8AyQlptxlT0uV9aTggFbk',
            range: sheetrange,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource,
        });
    } catch (err) {
        console.error('Erro ao adicionar dados:', err);
    } finally {
        await getSheetDataCallback("Agendamentos", (sheetData) => {
            agndmnts = [];
            for (var id = 0; id < sheetData.length; id++) {
                const element = sheetData[id];
                element.id = id;
                agndmnts.push(element);
            }
            agendamentos = getAgendamentos(agndmnts).filter(agend => (getStatus(agend.emprestimohora, agend.devolucaohora, agend.devolvido) == 2 || new Date(agend.emprestimohora).getDate() == new Date().getDate()) && !agend.devolvido);

            appointmentTableCreate();
            document.getElementById('appointments-amount').innerHTML = `${agendamentos.length}`;
        });

        document.getElementById('loading').hidden = true;
        document.getElementById('success').hidden = false;
    }
}

async function closeLoading(){
    document.getElementById("devolucaoform-wrapper").hidden = true;
    document.getElementById("devolucaoform").hidden = false;
    document.getElementById("success").hidden = true;
    document.querySelectorAll(".devolvido").forEach(btn => btn.disabled = false);
}
