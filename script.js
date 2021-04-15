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
const getItemPromise = async () => {
  const data = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((resolve) => resolve.json().then((Data) => Data.results));
  data.forEach((computador) => {
    const infoComputador = {
      sku: computador.id,
      name: computador.title,
      image: computador.thumbnail,
    };
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(infoComputador));
  });
}
getItemPromise();

// const appendChild = () => {
//   const sectionMain = document.querySelector('.items')
//   sectionMain.appendChild(createProductItemElement())
// }
// appendChild()
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
