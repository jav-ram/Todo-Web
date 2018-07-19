const state = {
  tabs: ['ALL', 'COMPLETED', 'ACTIVE'],
  tab_active: 0,
  data: [],
  loading: true,

}

//fetch 
fetch('https://raw.githubusercontent.com/samuelchvez/todos-fake-json-api/master/db.json')
  .then( response => response.json() )
  .then( responseJSON => { responseJSON.forEach( (element) => state.data.push(element) ) })
  .then( () => state.loading = false )

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

  if (!lState.loading) {
    createItems(lState);
  }

  root.appendChild(header);
  root.appendChild(content);

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

const tabOnClick = (self, lState) => {
  lState.tab_active = parseInt(self.className.split(' ')[1]);
  render(lState)
}

const createItems = (lState) => {
  for (let i = 0; i < lState.data.length; i++){
    // 
  }
}

render(state);