// // Função  Realizada com a ajuda do Mauricio Viegas
// function addLocalStorage() {
//   const ol = document.querySelector('.cart__items');
//   localStorage.setItem('aa', ol.innerHTML);
// }

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

// Função  Realizada com a ajuda do zéze durante o plantão
function getProduct() {
  return new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => {
      response.json().then((data) => resolve(data));
    });
  });
}

// Função  Realizada com a ajuda do Mauricio Viegas
function carregaPagina(data) {
  data.results.forEach((result) => {
    const obj = createProductItemElement(result);
    document.querySelector('.items').appendChild(obj);          
  });
}

// Função  Realizada com a ajuda do Mauricio Viegas
function cartItemClickListener(event) {
  event.target.remove();
}

// Função  Realizada com a ajuda do Mauricio Viegas
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Função  Realizada com a ajuda do Mauricio Viegas
function addItemCard(data) {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const li = createCartItemElement(data.results[index]);
      document.querySelector('.cart__items').appendChild(li);
      // addLocalStorage();
    });
  });
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function clearButton() {
  const button = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  button.addEventListener('click', () => {
    ol.innerHTML = ' ';
  });
}

async function funcionamento() {
  const data = await getProduct();
  carregaPagina(data);
  addItemCard(data);
  clearButton();
}

window.onload = function onload() {
  funcionamento();
 };