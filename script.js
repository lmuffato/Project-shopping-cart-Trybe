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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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
  // código
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getProducts() {
  return new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => {
        response.json().then((data) => resolve(data));
      })
  });
}

function appendProducts(data) {
  data.results.forEach(result => {
    const container = document.querySelector('.items');
    container.appendChild(createProductItemElement(result));
  });
}

function appendToCart(data) {
  const buttons = document.querySelectorAll('.item button');
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const cartContainer = document.querySelector('.cart__items');
      const addToCart = createCartItemElement(data[index]);
      cartContainer.appendChild(addToCart);
    })
  });
}

async function createProductsList() {
  try {
    const data = await getProducts();
    await appendProducts(data);
    await appendToCart(data.results);
  } catch (error) {
    console.log('Falha na matrix')
  }
}

window.onload = function onload() {
  createProductsList();
};
