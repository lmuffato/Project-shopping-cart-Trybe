async function getResultsApiML(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function getSectionItems() {
  return document.getElementById('__items');
}

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

async function populatePageProducts(url) {
  const data = await getResultsApiML(url);
  data.results.forEach((product) => {
    const productObj = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };

    const section = createProductItemElement(productObj);
    getSectionItems().appendChild(section);
  });
}

window.onload = async function onload() {
  await populatePageProducts('https://api.mercadolibre.com/sites/MLB/search?q=computador');
};