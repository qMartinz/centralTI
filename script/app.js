let user = "Guga"

function onLogin(){
    var content = document.getElementById('content');
    content.innerHTML = `<iframe src="html/inicio.html" onload="this.insertAdjacentHTML('afterend', (this.contentDocument.body||this.contentDocument).innerHTML);this.remove();welcome();"></iframe>`;
}

function onLoginError(err){
    console.error('Error on login', err);
}

function onLogout(){
    var content = document.getElementById('content');
    content.innerHTML = '';
}

function welcome(){
    gapi.client.load('people', 'v1', function() {
        gapi.client.people.people.get({
            resourceName: "people/me",
            personFields: "names"
        }).then((response) => {
            document.getElementById('user').textContent = `Olá, ${response.result.names[0].givenName}!`;
        }, (error) => {
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