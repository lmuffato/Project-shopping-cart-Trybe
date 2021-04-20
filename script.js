const olClassName = '.cart__items';

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Funções requisito 04

const getElementOnLoad = () => {
  const liItems = document.querySelectorAll('.cart__item');
  return liItems;
};

const saveInLocalStorage = () => {
  const array = [];
  getElementOnLoad().forEach((liItem) => {
    array.push(liItem.innerHTML);
  });
  localStorage.setItem('liItem', array.join('#'));
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  saveInLocalStorage();
}

const loadItemsInLocalStorage = () => {
  if (localStorage.getItem('liItem') !== null) {
    const olItems = document.querySelector(olClassName);
    const itemsToRestore = localStorage.getItem('liItem').split('#');
    itemsToRestore.forEach((itemRestored) => {
      const li = document.createElement('li');
      li.innerHTML = itemRestored;
      li.className = 'cart__item';
      li.addEventListener('click', cartItemClickListener);
      olItems.appendChild(li);
    });
  }
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Funções requisito 02
// Agradecimento ao pessoal que me ajudou na elaboração do raciocínio: Adelino Junior , Orlando Flores,Thiago souza ,Tiago santos, Nilson Ribeiro,Marília , Lucas Lara , Leonardo Mallman, Nathi Zebral  e os Professores Zezé e Jack !!
const addItemToCart = async (id) => {
  const url = (`https://api.mercadolibre.com/items/${id}`);
  const fetchUrl = await fetch(url);
  const fetchUrlJson = await fetchUrl.json();
  const obj = { sku: fetchUrlJson.id, name: fetchUrlJson.title, salePrice: fetchUrlJson.price };
  document.querySelector('.cart__items').appendChild(createCartItemElement(obj));
  saveInLocalStorage();
};

const getIdButtons = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const idDoBotao = getSkuFromProductItem(event.target.parentNode);
      addItemToCart(idDoBotao);
    });
  });
};
// Função requisito 01

const getApiComputer = async () => {
  const url = ('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const getFetch = await fetch(url);
  const dados = await getFetch.json();
  const dadosProducts = dados.results;
  const createItem = document.querySelector('.items');
  // console.log(dadosProducts);

  dadosProducts.forEach((dadoProduct) => {
    const obj = { sku: dadoProduct.id, name: dadoProduct.title, image: dadoProduct.thumbnail };
    const product = createProductItemElement(obj);
    createItem.appendChild(product);
  });

  // getIdButtons vai ser executada quando os elementos dinâmicos forem renderizados

  getIdButtons();
};

const clearAll = () => {
  const olItem = document.querySelector(olClassName);
  getElementOnLoad().forEach((liItem) => {
    olItem.removeChild(liItem);
  });
  localStorage.clear();
};

const clearCart = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', clearAll);
};

window.onload = function onload() {
  getApiComputer();
  getIdButtons();
  getElementOnLoad();
  loadItemsInLocalStorage();
  clearCart();
};
