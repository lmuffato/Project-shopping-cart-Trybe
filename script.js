const cart = document.querySelector('.cart__items');

window.onload = function onload() {
  const saved = localStorage.getItem('cart');
  cart.innerHTML = saved;
 };

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

function cartItemClickListener(event) {
  cart.removeChild(event.target);
  localStorage.setItem('cart', cart.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const items = document.getElementById('product');
const container = document.querySelector('.container');
const loadingText = document.createElement('section');
loadingText.innerText = 'loading...';
loadingText.classList.add('loading');
container.appendChild(loadingText);

const createList = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((data) => {
    const { results } = data;
    results.forEach((item) => {
      const obj = {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      };
      const section = createProductItemElement(obj);
      items.appendChild(section);
    });
  })
  .then(() => {
    container.removeChild(loadingText);
  });
};

createList();

const verifiedFetchItems = (itemId) => {
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => response.json())
  .then((data) => {
    const obj = {
      sku: itemId,
      name: data.title,
      salePrice: data.price,
    };
    const li = createCartItemElement(obj);
    cart.appendChild(li);
    localStorage.setItem('cart', cart.innerHTML);
  });
};

const button = document.querySelector('.empty-cart');
button.addEventListener('click', () => {
  cart.innerHTML = '';
  localStorage.setItem('cart', cart.innerHTML);
});

document.body.addEventListener('click', (event) => {
  const list = event.target.className;
  if (list.includes('item__add')) {
    const parent = event.target.parentElement;
  const child = parent.firstChild;
  console.log(child.innerText);
  verifiedFetchItems(child.innerText);
  }
});
