const olcart = 'ol.cart__items';

const loadingThePage = () => {
  const loadingPage = document.createElement('section');
  loadingPage.className = 'loading';
  loadingPage.innerHTML = 'Loading...';
  document.querySelector('.items').appendChild(loadingPage);
};

const loadingRemove = () => {
  document.querySelector('.loading').remove();
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

function clearStorage() {
  localStorage.removeItem('shoppingCartSave');
}

const shoppingCartPrice = async () => {
  const updatePrice = document.querySelectorAll('li.cart__item');
  const priceAll = Array.from(updatePrice).reduce((acc, current) => {
    const support = current.innerText.lastIndexOf('PRICE');
    return (acc + Number(current.innerText.substr(support + 8)));
  }, 0);
  const totalItem = document.querySelector('span.total-price');
  totalItem.innerText = priceAll;
};

const buttonClear = () => {
  const clearAll = document.querySelector('.empty-cart');
  clearAll.addEventListener('click', () => {
    const clearItem = document.querySelector(olcart);
    clearItem.innerHTML = '';
    shoppingCartPrice();
    clearStorage();
  });
};

const shoppingCartSave = () => {
  const list = document.querySelector(olcart).innerHTML;
  localStorage.setItem('shoppingCartSave', list);
  shoppingCartPrice();
};

const updateProduct = () => {
  const list = document.querySelector('ol');
  list.innerHTML = localStorage.getItem('shoppingCartSave');
  shoppingCartPrice();
};

function cartItemClickListener(event) {
  event.target.remove();
  const removeItem = document.querySelector(olcart).innerHTML;
  localStorage.setItem('shoppingCartSave', removeItem);
  shoppingCartPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemById = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then((response) => response.json())
  .then((data) => {
    const computerCart = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    const itemAdd = createCartItemElement(computerCart);
    document.querySelector('.cart__items').appendChild(itemAdd);
    shoppingCartSave();
    shoppingCartPrice();
  });
};

const addItemButton = async (computer) => {
  computer.lastChild.addEventListener('click', (e) => {
    const sku = e.target.parentNode.firstChild.innerText;
    addItemById(sku);
  });
};

const consultAPI = (consult) => {
  setTimeout(() => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${consult}`)
      .then((response) => {
        response.json().then((data) => {
          data.results.forEach((computer) => {
            const objectComputers = {
              sku: computer.id,
              name: computer.title,
              image: computer.thumbnail,
            };
            const printComputers = createProductItemElement(objectComputers);
            document.querySelector('.items').appendChild(printComputers);
            addItemButton(printComputers);
          });
        });
      });
      loadingRemove();
    }, 3000);
};

window.onload = function onload() {
  loadingThePage();
  consultAPI('computador');
  buttonClear();
  updateProduct();
  shoppingCartPrice();
};
