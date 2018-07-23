const state = {
  tabs: ['ALL', 'COMPLETED', 'ACTIVE'],
  tab_active: 0,
  data: [],
  pending: [],
  loading: true,
}

// fetch 
fetch('https://raw.githubusercontent.com/samuelchvez/todos-fake-json-api/master/db.json')
  .then( response => response.json() )
  .then( responseJSON => { responseJSON.forEach( (element) => state.data.push(element) ) })
  .then( () => state.loading = false )
  .then( () => delay(1000)) //solo es para que se note mi loading si no carga muy rapido
  .then( () => render(state))
  .then( () => console.log(state.data[0]))
  .catch( (e) => alert(`Algo paso.\nError:\n${e}`))

const render = (lState) => {
  const root = document.getElementById('root');

  if (root.childNodes != null) {
    root.innerHTML = '';
  }

  // crear contenedores
  //header
  const header = document.createElement('nav');
  header.className = `header round`;
  //Botones adentro de header
  for (let i = 0; i < lState.tabs.length; i++){
    //create tabs
    const tab = createTab(lState, i);
    header.appendChild(tab);
  }

  //content
  const content = document.createElement('div');
  content.className = 'content round';

   //upcoming
   const upcoming = document.createElement('div');
   upcoming.className = 'upcoming round';
 

  if (lState.loading) {
    //loader
    const cargando = document.createElement('div');
    cargando.className = `loader`;
    content.appendChild(cargando);
  } else {
    //print tareas
    for (let i = 0; i < lState.data.length; i += 1) {
      const item = createItem(lState, i);
      if (item != undefined) {
        content.appendChild(item);
      }
    }

    //print tareas in uploading 
    for (let i = 0; i < lState.pending.length; i += 1) {
      const item = createItemPending(lState, i);
      if (item != undefined) {
        upcoming.appendChild(item);
      }
    }
  }

  //footer
  const footer = document.createElement('div');
  footer.className = 'footer round';

  // input text
  const todo_txt = document.createElement('input');
  todo_txt.setAttribute('type', 'text');
  todo_txt.className = 'insert';
  todo_txt.setAttribute('placeholder', 'Ingrese nueva tarea');
  // boton submit
  const submit = document.createElement('button');
  submit.className = 'submit';
  submit.innerHTML = 'ADD';
  // listener
  submit.onclick = () => insert(todo_txt, lState);

  footer.appendChild(todo_txt);
  footer.appendChild(submit);
  

  root.appendChild(header);
  root.appendChild(content);
  root.appendChild(upcoming);
  root.appendChild(footer);

}


const createTab = (lState, index) => {
  const tab = document.createElement('button');
  tab.innerHTML = `${lState.tabs[index]}`;
  if (index === lState.tab_active) {
    tab.className = `tab ${index} active`;
  } else {
    tab.className = `tab ${index}`;
  }
  tab.onclick = (self) => tabOnClick(self.target, lState);
  return tab;
}

const createItemPending = (lState, i) => {
  const complete = lState.pending[i].isCompleted;
  const item = document.createElement('div');
  item.className = `item ${i} round pending`;

  //text 
  const text = document.createElement('p');
  text.innerHTML = `${lState.pending[i].title}`;
  item.appendChild(text);

  //loading 
  const cargando = document.createElement('div');
  cargando.className = `loader small`;
  item.appendChild(cargando);

  // check if it is completed
  if (complete) {
    item.className = `${item.className} complete`;
  }

  return item;
}

const createItem = (lState, i) => {
  const complete = lState.data[i].isCompleted;
  const item = document.createElement('div');
  item.className = `item ${i} round`;

  //text 
  const text = document.createElement('p');
  text.innerHTML = `${lState.data[i].title}`;
  item.appendChild(text);

  // check if it is completed
  if (complete) {
    item.className = `${item.className} complete`;
  }

  // add listener
  item.onclick = (self) => itemOnClick(self.target, lState, i);

  // check tab
  if (lState.tab_active === 1) {
    // only completed
    if (complete) {
      return item;
    }
  } else if (lState.tab_active === 2) {
    // only active
    if (!complete) {
      return item;
    }
  } else if (lState.tab_active === 0) {
    // all
    return item;
  }
}

const tabOnClick = (self, lState) => {
  lState.tab_active = parseInt(self.className.split(' ')[1]);
  render(lState)
}

const itemOnClick = (self, lState, index) => {
  lState.data[index].isCompleted = !lState.data[index].isCompleted;
  console.log(lState.data[index].isCompleted);
  render(lState)
}

const insert = (input, lState) => {
  let todo = {
    id: 0,
    title: '',
    isCompleted: false,
  }

  //check if there si something
  if (input.value == '') {
    alert('Por favor ingresar alguna tarea.');
    return 1;
  }

  //fake uplaod
  todo.title = input.value;
  todo.id = parseInt(lState.data[lState.data.length - 1].id) + 1;

  lState.pending.push(todo);

  //actual load
  delay(3000)
  .then( () => lState.data.push(todo))
  .then( () => lState.pending.pop(todo))
  .then( () => render(lState));

  render(lState);
  return todo;
}

//delay
const delay = ms => new Promise(
  (resolve, reject) => setTimeout(resolve, ms,)
);


render(state);