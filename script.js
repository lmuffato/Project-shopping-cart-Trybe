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
  const items = document.querySelector('.items');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  items.appendChild(section);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const cartItemClickListener = (event) => {
  const ol = document.querySelector('.cart__items');
  return ol.removeChild(event.target);
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  return li;
}

const getAPI = async () => {
  const fetchAPI = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const products = await fetchAPI.json();
  const endProducts = await products.results;
  return endProducts;
};

const requisiteProduct = async (product) => {
  const fetchAPI = await fetch(`https://api.mercadolibre.com/items/${product}`);
  const filteredItem = await fetchAPI.json();
  return filteredItem;
};

const addProductScreen = async () => {
    const arrayResults = await getAPI();
    return arrayResults.forEach((element) => {
      const items = { sku: element.id, name: element.title, image: element.thumbnail };
      createProductItemElement(items);
    });
};

const addEvent = async () => {
  const buttons = document.querySelectorAll('.item__add');
  return buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const idProduct = button.parentNode.children[0].innerHTML;
      const objectAPI = await requisiteProduct(idProduct);
      const product = { sku: objectAPI.id, name: objectAPI.title, salePrice: objectAPI.price };
      return createCartItemElement(product);
    });
  });
};

const removeItems = () => {
  const button = document.querySelector('.empty-cart');
  const listProducts = document.querySelector('.cart__items');
  button.addEventListener('click', () => {
  listProducts.innerHTML = '';  
  });
};

const createPage = async () => {
  try {
    await addProductScreen();
    await addEvent();
    removeItems();
  } catch (error) {
    return 'error';
  }
};

window.onload = function onload() { 
  createPage();
};

// referências https://medium.com/jaguaribetech/dlskaddaldkslkdlskdlk-333dae8ef9b8
// https://github.com/tryber/sd-010-a-project-shopping-cart/pull/30/commits/3f3791797ece0b2faf08c88a432028a7a2025687