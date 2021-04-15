const ul = document.querySelector('.cart__items');

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
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getIdFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// function cartItemClickListener(event) {
  
// }
// códigos feitos baseados no repositório do Renzo. Fui observando cada código e refatorando os que eram necessários para o meu entendimento.
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const createProductList = ({ results }) => {
  results.forEach((result) => {
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(result));
  });
};

const dataApi = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  return data;
  // console.log(data);
};

const fetchId = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const data = await response.json();
  return data;
};

const setCart = async () => {
  document.querySelectorAll('.item__add').forEach((event) =>
  event.addEventListener('click', async () => {
    try {
      const item = await fetchId(getIdFromProductItem(event.parentNode));
      console.log(item);
      ul.appendChild(createCartItemElement(item));
    } catch (error) {
        throw new Error('Erro no click');
    }
    console.log('Clicaram em mim');
  }));
};

const asyncAll = async () => {
  try {
    createProductList(await dataApi());
    await setCart();
  } catch (error) {
      throw new Error('Erro na função asyncAll');
  }
};

window.onload = function onload() {
  asyncAll();
};
