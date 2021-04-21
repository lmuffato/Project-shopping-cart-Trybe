const cartitems = '.cart__items';
const additem = '.item__add';

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// x---------------------requisito 5 -------------------------x

// requisito 5 feito com auxilio dos colegas Adelino junior e Rafael Medeiros

const somaTodosItens = async () => {
  let total = 0;
  const meuvalor = [...document.querySelectorAll('.cart__item')]; 
  const minhadivida = meuvalor.map((li) => parseFloat(li.innerText.split('$')[1]));
  total = minhadivida.reduce((acc, current) => acc + current, 0);
  document.querySelector('.total-price').innerText = total;
};

// x ------------parte do requisito 4 --------------x

const savelocalstorage = () => {
  const saveItem = document.querySelector(cartitems);
  localStorage.setItem('cart item', saveItem.innerHTML);
};

function cartItemClickListener(event) {
  event.target.remove();
  somaTodosItens();
  savelocalstorage();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  // console.log(price);
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// x---------------------requisito 4---------------------------x

// requisito feito com ajuda dos colegas Adelino Junior, Nathi zebral e Rafael Medeiros

const pegaNoLoading = () => {
  const itemNoLocal = localStorage.getItem('cart item');
  const ol = document.querySelector(cartitems);
  ol.innerHTML = itemNoLocal;
  const lista = document.querySelectorAll(cartitems);
  lista.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
};

// x-----------------------requisito 6 ------------------------x

// requisito feito com ajuda do GUilherme de Prais e Vinicius rodrigues

const addVazio = () => {
  const todasLi = document.querySelector(cartitems);
  todasLi.innerHTML = '';
  somaTodosItens();
  localStorage.clear();
};

const apagacart = () => {
  const caminho = document.querySelector('.empty-cart');
   caminho.addEventListener('click', addVazio);
};

// x----------------------requisito 7 ----------------------------x

const meuLoading = () => {
  const minhaDiv = document.createElement('div');
  minhaDiv.className = 'loading';
  minhaDiv.innerText = 'loading...';
  document.querySelector('#xablau').appendChild(minhaDiv);
};

const deletaLoading = () => {
  document.querySelector('.loading').remove();
};

// x----------------------requisito 2 ----------------------------x

// com ajuda de Nathi zebral, Adelino Junior e outros amigos da sala de estudo consegui fazer o requisito 2

const procuraId = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => {
    response.json()
    .then((data) => {
      const idinfo = data;
      document.querySelector(cartitems).appendChild(createCartItemElement(idinfo));
      somaTodosItens();
      savelocalstorage();
    });
  });
};

const pegaDadosID = () => {
  const caminho = document.querySelectorAll(additem);
  caminho.forEach((button) => {
    button.addEventListener('click', (event) => {
       const idDoPc = getSkuFromProductItem(event.target.parentElement);
       procuraId(idDoPc);
    });
  });
};

// x------------------------requisito 1 --------------------------x

// consegui fazer o requisito 1 com ajuda do Adelino Junior, Tiago santos, tiago souza,Nathi zebral, Lucas lara, Marilia e os instrutores.

const informaçoesApi = (interageApi) => {
  interageApi.forEach((computer) => { 
    const section = document.querySelector('.items');
    section.appendChild(createProductItemElement(computer));
  });
  pegaDadosID();
  somaTodosItens();
};

const interageApi = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => {
    response.json().then((data) => {
      const informaçoes = data.results;
      informaçoesApi(informaçoes);
    });
  });

 window.onload = function onload() { 
   meuLoading();
   interageApi().then(deletaLoading);
   pegaDadosID();
   apagacart();
   somaTodosItens();
   pegaNoLoading();
};
