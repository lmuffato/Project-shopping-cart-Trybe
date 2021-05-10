// Já tava aqui quando cheguei |>

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

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getItemId = async (event) => {
  const id = event.target.parentNode;
  const fetcH = await fetch(`https://api.mercadolibre.com/items/${id.dataset.id}`);
  const dataItem = fetcH.json();
  const cartItem = document.querySelector('.cart__items');
  cartItem.appendChild(createCartItemElement(dataItem));
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.dataset.id = sku;
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', getItemId);
  section.appendChild(button);

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

// Criadas por mim |>

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

window.onload = function onload() {
 getDataAPIML('computador');
};