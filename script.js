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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  // console.log(id, title, thumbnail);
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
async function foundItems(endPoint) {
  return new Promise((resolve) => {
    fetch(endPoint)
      .then((response) => {
        response.json()
          .then((data) => {
            resolve(data.results);
          });
      });
      // reject(new Error('endpoint não existe.'));
  });
}

async function setItems() {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const datas = await foundItems(endPoint);
  datas.forEach((data) => {
    const newElement = createProductItemElement(data);
    document.querySelector('.items').appendChild(newElement);
  });
}

window.onload = function onload() {
  setItems();
};
