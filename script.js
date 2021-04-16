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

// async function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}
// Função requisito 01

const getApiComputer = async () => {
  const url = ('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const getFetch = await fetch(url);
  const dados = await getFetch.json();
  const dadosProducts = dados.results;
  const createItem = document.querySelector('.items');
  // console.log(dadosProducts);

  dadosProducts.forEach((dadoProduct) => {
    const obj = { sku: dadoProduct.id, name: dadoProduct.title, image: dadoProduct.thumbnail };
    const product = createProductItemElement(obj);
    createItem.appendChild(product);
  });

  // getIdButtons vai ser executada quando os elementos dinâmicos forem renderizados

  getIdButtons();
};

// Funções requisito 02

const getIdButtons = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const idDoBotao = getSkuFromProductItem(event.target.parentNode);
      addItemToCart(idDoBotao);
    });
  });
};
const addItemToCart = async (id) => {
  const url = (`https://api.mercadolibre.com/items/${id}`);
  const fetchUrl = await fetch(url);
  const fetchUrlJson = await fetchUrl.json();
  console.log(fetchUrlJson);
  const obj = { sku: fetchUrlJson.id, name: fetchUrlJson.title, salePrice: fetchUrlJson.price };
  document.querySelector('.cart__items').appendChild(createCartItemElement(obj));
};

window.onload = function onload() {
  getApiComputer();
  getIdButtons();
};
