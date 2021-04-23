

  function createProductImageElement(imageSource) {
    const img = document.createElement('img');
    img.className = 'item__image';
    img.src = imageSource;
    return img;
  }

  function createCustomElement(element, className, innerText) {
    const e = document.createElement(element);
    e.className = className;
    e.innerText = innerText;
  return e;
  }

  function createProductItemElement({ id, title, thumbnail }) {
    const section = document.createElement('section');
    section.className = 'item';
    section.appendChild(createCustomElement('span', 'item__sku', id));
    section.appendChild(createCustomElement('span', 'item__title', title));
    section.appendChild(createProductImageElement(thumbnail));
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')) ;
    
    return section;
  } 

 // 2 passo
  function carregaPagina(resultado) {
    const recebArrayResults = resultado.results;
    recebArrayResults.forEach((element) => {
      const item = createProductItemElement(element) // criando o elemento
      const section = document.querySelector('.items');
      section.appendChild(item)
    });
  }
  
  function fetchMercadoLivre() {
   return new Promise((resolve) => {
     fetch("https://api.mercadolibre.com/sites/MLB/search?q=$computador")
       .then((response) => {
         response.json().then((data) => resolve(data));
       });
   }) 
  }; //1 passo

  /* async function inicioPagina() {
    const dados = await fetchMercadoLivre(); // tem todos os dados da API
    carregaPagina(dados); 
  } */

  window.onload = async function onload() {
    // inicioPagina();
    const dados = await fetchMercadoLivre(); // tem todos os dados da API, await aguarda o retorno da promise
    carregaPagina(dados); 
  }
  