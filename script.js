function loadd () {
  const recuperaH = document.querySelector('.loading');
  recuperaH.innerText = 'loading...';
  console.log(recuperaH);
}

// Função realizada com a ajuda o Igson.
function totalPrice() {
  const list = document.querySelectorAll('li');
  const total = document.querySelector('.total-price');
  let soma = 0;
  list.forEach((item) => {
    const price = item.innerText.split('$')[1];
    soma += parseFloat(price);
  });
  total.innerText = soma;
}

function getOl() {
  return document.querySelector('.cart__items');
}

function addLocalStorage() {
  const ol = getOl();
  localStorage.setItem('list', ol.innerHTML);
}

function addHtml() {
  const ol = getOl();
  ol.innerHTML = localStorage.getItem('list');
}

function clearButton() {
  const button = document.querySelector('.empty-cart');// recupera o botao esvazia carrnho
  const ol = getOl();
  button.addEventListener('click', () => {
    ol.innerHTML = ' ';
    totalPrice();
  });
}

function cartItemClickListener(event) {
  event.target.remove();
  totalPrice();
}

 // Requisito 2
  function createCartItemElement({ id, title, price }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
  }
  
  function adicionarItem(recebeData) {
    const botoes = document.querySelectorAll('.item__add');
    botoes.forEach((botao, index) => {
        botao.addEventListener('click', () => {
          const trasLi = createCartItemElement(recebeData.results[index]);
          const ol = document.querySelector('.cart__items');
          ol.appendChild(trasLi);
          addLocalStorage();
          totalPrice();
        });
    });
  }

  // requisito 1
  
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
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
    return section;
  } 
 // 2 passo
  function carregaPagina(resultado) {
    const recebArrayResults = resultado.results;
    recebArrayResults.forEach((element) => {
      const item = createProductItemElement(element); // criando o elemento
      const section = document.querySelector('.items');
      section.appendChild(item);
    });
  }
  // _______________________________________________________________________
      
  function fetchMercadoLivre() {
   return new Promise((resolve) => {
     fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
       .then((response) => {
         response.json().then((data) => resolve(data));
       });
   }); 
  }

// 1 passo
  async function inicioPagina() {
    const dados = await fetchMercadoLivre(); // tem todos os dados da API
    carregaPagina(dados);
     adicionarItem(dados);
     clearButton();
     addHtml();
     await totalPrice();
     loadd();
  }

  window.onload = function onload() {
    inicioPagina();
  };