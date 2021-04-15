window.onload = function onload() { };

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

const getItems = document.querySelector('.items');
const loadingApiText = document.createElement('h1');
loadingApiText.innerText = 'loading';
loadingApiText.className = 'loading';

const fetchComputers = () => {
  getItems.appendChild(loadingApiText);
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((data) => {
    const { results } = data;
    results.forEach((result) => {
      const product = {
        sku: result.id,
        name: result.title,
        image: result.thumbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(product));
    });
  })
  .then(() => {
    getItems.removeChild(loadingApiText);
  });
};
fetchComputers();

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const cartItems = document.querySelector('.cart__items');

function cartItemClickListener(event) {
  cartItems.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((data) => {
    const product = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    cartItems.appendChild(createCartItemElement(product));
  });
};

document.body.addEventListener('click', (event) => {
  const classList = event.target.className;
  if (classList.includes('item__add')) {
    const item = event.target.parentElement.firstChild;
    addToCart(item.innerText);
  }
});

const clearBtn = document.querySelector('.empty-cart');
clearBtn.addEventListener('click', () => {
  cartItems.innerHTML = '';
});
