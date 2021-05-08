const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const cart = document.querySelector('.cart__items');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const evento = document.createElement(element);
  evento.className = className;
  evento.innerText = innerText;
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;

//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

function cartItemClickListener(event) {
  const evento = event.target;
  cart.removeChild(evento);
}

function obtemProdutos() {
  const produtos = fetch(api)
  .then((response) => response.json())
  .then((response) => response.results);

  return produtos;
}

async function mostraProdutos() {
  const produtos = await obtemProdutos();
  const sectionItems = document.querySelector('.items');

  produtos.forEach(({ id: sku, title: name, thumbnail_id: imageId }) => {
      const image = `https://http2.mlstatic.com/D_NQ_NP_${imageId}-O.webp`;
      sectionItems.appendChild(createProductItemElement({ sku, name, image }));
  });
  itemAddEvent();
}

 //-----------------------------------------------------------------------------------------------------------------------------

 async function selecionaItem(event) {
  const evento = event.target;
  const cart = document.querySelector('.cart__items');
  const urlItem = `https://api.mercadolibre.com/items/${idItem}`;
  const idItem = evento.parentElement.firstChild.textContent;
  const { id: sku, title: name, price: salePrice } = await fetch(urlItem)
  .then((response) => response.json())
  .then((response) => response);

  cart.appendChild(createCartItemElement({ sku, name, salePrice }));
}

function itemAddEvent() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', setItem));
}

window.onload = () => {
  mostraProdutos();
  selecionaItem();
};