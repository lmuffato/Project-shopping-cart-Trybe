const buscaComputadores = async () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador'; 
  const response = await fetch(url);
  const data = await response.json();
  const { results } = data;
  return results;
};

// buscaComputadores();

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
const adicionaElementos = async () => { // async e await ?
  const itensComputadores = await buscaComputadores();
  itensComputadores.forEach((item) => {
    const elementos = document.querySelector('.items');
    elementos.appendChild(createProductItemElement(item));
  });
};

/* function getSkuFromProductItem(item) {
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
} */

window.onload = function onload() { 
  buscaComputadores();
  adicionaElementos();
};
