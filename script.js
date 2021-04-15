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

// Requisito 2

function cartItemClickListener(event) {
  // coloque seu código aqui
  console.log(event.target); // linha inserida apenas para evitar erro atual do lint
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function clickButtons(callback) {
  const arrayButtons = document.querySelectorAll('.item__add');
  arrayButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const computer = callback[index]; 
      fetch(`https://api.mercadolibre.com/items/${computer.id}`)
        .then((resp) => resp.json())
          .then((r) => {
            const objItem = {
              sku: r.id,
              name: r.title,
              salePrice: r.price,
            }; 
            const cartItems = document.querySelector('.cart__items');
            cartItems.appendChild(createCartItemElement(objItem));
          });
    });
  });
}

//  Requisito 1

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

async function fetchProducts() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
      .then((r) => r);
}

async function getProducts() {
  const items = document.querySelector('.items');
  const produtos = await fetchProducts()
    .then((resp) => resp.results);
    produtos.forEach((computador) => {
      const objItem = {
        sku: computador.id,
        name: computador.title,
        image: computador.thumbnail,
      };
      const item = createProductItemElement(objItem);
      items.appendChild(item);
    });
    clickButtons(produtos);
  }

/*

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/

window.onload = function onload() { 
   getProducts();
   clickButtons();
};
