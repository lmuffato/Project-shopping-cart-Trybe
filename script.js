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

function cartItemClickListener(event) {
  const cartItem = event.target;
  cartItem.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//  2° Task

const fetchCart = (id) => {
  const singleItem = fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((r) => r.json())
      .then((r) => r);
  return singleItem;
};

async function mountCart(event) {
  const section = event.target.parentElement;
  const skuId = section.firstChild.innerText;
  const items = await fetchCart(skuId);
  document.querySelector('.cart__items')
    .appendChild(createCartItemElement(
      { sku: items.id, name: items.title, salePrice: items.price },
));
}

//  1° Task

const fetchProduct = () => {
  const response = fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
     .then((r) => r.json())
       .then((r) => r.results);
   return response;
 };

async function creatItensList() {
  const itens = await fetchProduct();
  itens.forEach(({ id, thumbnail, title }) => {
    document.querySelector('.items')
      .appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
  const btn = document.querySelectorAll('.item__add');
  btn.forEach((element) => {
    element.addEventListener('click', mountCart);
 });
}

//  ------

window.onload = function onload() {
  creatItensList();
 };
