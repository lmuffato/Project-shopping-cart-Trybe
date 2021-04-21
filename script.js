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

const somaTodosItens = async () => {
  let total = 0;
  const meuvalor = [...document.querySelectorAll('.cart__item')]; 
  const minhadivida = meuvalor.map((li) => parseFloat(li.innerText.split('$')[1]));
  total = minhadivida.reduce((acc, current) => acc + current, 0);
  console.log(minhadivida);
  document.querySelector('.total-price').innerText = total;
};

function cartItemClickListener(event) {
  event.target.remove();
  somaTodosItens();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  // console.log(price);
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// x---------------------requisito 4--------------------------x

// x-----------------------requisito 6 ------------------------x

const addVazio = () => {
  const todasLi = document.querySelector(cartitems);
  todasLi.innerHTML = '';
};

const apagacart = () => {
  const caminho = document.querySelector('.empty-cart');
   caminho.addEventListener('click', addVazio);
};

// requisito feito com ajuda do GUilherme de Prais e Vinicius rodrigues

// x ----------------------requisito 2 ----------------------------x

const procuraId = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => {
    response.json()
    .then((data) => {
      const idinfo = data;
      document.querySelector(cartitems).appendChild(createCartItemElement(idinfo));
      somaTodosItens();
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

// com ajuda de Nathi zebral, Adelino Junior e outros amigos da sala de estudo consegui fazer o requisito 2

// x------------------------requisito 1 --------------------------x

const informaçoesApi = (interageApi) => {
  interageApi.forEach((computer) => { 
    const section = document.querySelector('.items');
    section.appendChild(createProductItemElement(computer));
  });
  pegaDadosID();
};

const interageApi = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador').then((response) => {
    response.json().then((data) => {
      const informaçoes = data.results;
      informaçoesApi(informaçoes);
    });
  });
 };

// consegui fazer o requisito 1 com ajuda do Adelino Junior, Tiago santos, tiago souza,Nathi zebral, Lucas lara, Marilia e os instrutores.
 window.onload = function onload() { 
   interageApi();
   pegaDadosID();
   apagacart();
};
