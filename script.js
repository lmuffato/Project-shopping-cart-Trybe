// A maioria dos códigos foram feitos baseados no repositório do Renzo. Fui observando cada código e refatorando os que eram necessários para o meu entendimento.
window.onload = function onload() { };

const ol = document.querySelector('.cart__items');
const prices = document.querySelector('.total-price');

const setStorage = () => {
  localStorage.setItem('cart', ol.innerHTML);
  localStorage.setItem('priceCart', prices.innerHTML);
};

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
const updatePrice = async () => {
  const items = await document.querySelectorAll('li.cart__item');
  const totalPrice = [...items].reduce((acc, element) => {
    const curr = parseFloat(element.dataset.price);
    
    const total = acc + curr;
    // TODO lembrar de refatorar para trocar o ponto por vírgula com replace
    return total;
  }, 0);
  // Dica do Rafael Medeiros na thread https://trybecourse.slack.com/archives/C01L16B9XC7/p1618869252243000
  // indicação da seguinte documentação https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
  prices.innerText = totalPrice;
  // TODO implementar valor em reais
  // new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(totalPrice);
  // `R$${totalPrice.toFixed(2).replace('.', ',')}`;
};

// metodo target desestruturado do elemento clicado do addEventListener e utilizado.

function cartItemClickListener({ target }) {
  target.remove();
  setStorage();
  updatePrice();
}

const removeItem = () => {
  document.querySelectorAll('.cart__item')
    .forEach((e) => e.addEventListener('click', cartItemClickListener));
};

const loadStorage = () => {
  ol.innerHTML = localStorage.getItem('cart');
  // prices.innerHTML = localStorage.getItem('priceCart');
  removeItem();
  updatePrice();
};

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  // Elisa França me enviou a documentação sobre o dataset que mapea o DOMString e guarda os valores de determinado elemento
  // https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLOrForeignElement/dataset
  li.dataset.price = price;
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createProductList = ({ results }) => {
  results.forEach((result) => {
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(result));
  });
};

const fetchApi = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  return data;
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
      ol.appendChild(createCartItemElement(item));
      setStorage();
      updatePrice();
    } catch (error) {
        throw new Error('Erro no click');
    }
  }));
};

const emptyCart = () => {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', () => {
    ol.innerHTML = '';
    setStorage();
    updatePrice();
  });
};

const loadingApi = setTimeout(() => document.querySelector('.loading').remove(), 2000);

const asyncAll = async () => {
  try {
    createProductList(await fetchApi());
    await setCart();
    emptyCart();
    loadingApi();
  } catch (error) {
      throw new Error('Erro na função asyncAll');
  }
};

asyncAll();
loadStorage();
