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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Requisito 3 //

function cartItemClickListener(event) {
  event.target.remove();
  const total = document.querySelector('.total-price');
  const price = Number(event.target.innerText.split('|')[2].split('$')[1]);
  total.innerText = Number(total.innerText) - price;
  total.innerText = Number(total.innerText).toFixed(1);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 1 //

const productsFetch = () => new Promise((resolve) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json()
      .then((data) => resolve(data.results)));
});

const productAsync = async () => {
  const myloading = document.querySelector('.loading');
  const data = await productsFetch();
  myloading.remove();
  data.forEach((obj) => {
    const enter = createProductItemElement({
      sku: obj.id,
      name: obj.title,
      image: obj.thumbnail,
    });
    document.querySelector('.items').appendChild(enter);
  });
};

// Requisito 2 //

const idFetch = (id) => new Promise((resolve) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => resolve(data));
});

async function getId(event) {
  const { id, title, price } = await idFetch(event.target.parentNode.firstChild.innerText);
  const x = createCartItemElement({ id, title, price });
  const cartItems = document.querySelector('.cart__items');
  const total = document.querySelector('.total-price');
  total.innerText = Number(total.innerText) + price;
  cartItems.appendChild(x);
}

const eventClick = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', getId);
  });
};

// Requisito 6 //

const clearItems = () => {
  const myItens = document.querySelector('.cart__items');
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    myItens.innerHTML = '';
  });
};

// Chamada das Funções //

window.onload = function onload() {
  productAsync().then(() => eventClick());
  clearItems();
};