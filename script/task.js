function allowDrop(ev) {
  ev.preventDefault();
  ev.allowedEffect = "move";
}

function enterDropZone(ev) {
  if (ev.target.classList.contains('task')) ev.target = ev.target.parentElement;
  ev.target.setAttribute("drop-active", true);
  document.querySelectorAll('.task').forEach(task => task.style.pointerEvents = 'none');
}

function leaveDropZone(ev) {
  ev.target.removeAttribute("drop-active");
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  ev.target.setAttribute("drag-active", true);
}

function dropTask(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  ev.target.removeAttribute("drop-active");
  document.querySelectorAll('.task').forEach(task => task.style.pointerEvents = 'all');

  document.getElementById(data).querySelector('.task-status').textContent = ev.target.querySelector('.board-status').textContent;
  document.getElementById(data).removeAttribute("drag-active");
}

function dragEnd(ev) {
  document.querySelectorAll('.task').forEach(task => task.style.pointerEvents = 'all');
  ev.target.removeAttribute("drag-active");
}