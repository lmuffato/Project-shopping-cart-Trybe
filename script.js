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
  // coloque seu código aqui
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
  });
};

async function addItemButton(computer) {
  computer.lastChild.addEventListener('click', (e) => {
    const sku = e.target.parentNode.firstChild.innerText;

    addItemById(sku);
  });
}

const consultAPI = (consult) => {
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
};

window.onload = function onload() {
  consultAPI('computador');
};
