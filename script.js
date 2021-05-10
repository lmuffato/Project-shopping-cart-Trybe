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

/*  function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
} */

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getDataAPIML(query) {
  const fetcH = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const fetchedObj = await fetcH.json();
  const itemList = document.querySelector('.items');
  fetchedObj.results.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const newItem = createProductItemElement({ sku, name, image });
    itemList.appendChild(newItem);
  });
}

function getItemId() {
  const items = document.querySelector('.items');
  items.addEventListener('click', (e) => {
    const item = e.target.parentNode;
    const sku = item.querySelector('span.item__sku').innerText;
    fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then((data) => {
      const productSpecs = {
        sku,
        name: data.title,
        salePrice: data.price,
      };
      const cartList = document.querySelector('.cart__items');
      cartList.appendChild(createCartItemElement(productSpecs));
    });
  });
}

window.onload = function onload() {
 getDataAPIML('computador');
 getItemId();
};