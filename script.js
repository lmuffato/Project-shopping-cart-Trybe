/* eslint-disable no-param-reassign */
/* eslint-disable no-new */
/* eslint-disable no-unreachable */

// Constante declerada para os requisitos 3,4 e 6
const getOl = document.querySelector('.cart__items');
const getPrice = document.querySelector('.total-price');

// Requisito 5
// Requisito feito com ajuda do Guilherme Lira, via chamada Slack
const getParagrafo = document.querySelector('.total-price');
  
const verificaLista = () => {
  const listas = document.querySelectorAll('.cart__items li');

if (listas.length >= 1) return listas;
};

const precoTotal = (listas) => {
  let soma = 0;

  listas.forEach((li) => {
    const lista = li.innerText.split('$');
    const number = Number(lista[1]);
    soma += number;
  });

  if (soma === Math.round(soma)) return `${soma}`;
  if (soma === Number(soma.toFixed(1))) return `${soma.toFixed(1)}`;
   return `${soma.toFixed(2)}`;
};

const precoAsync = async () => {
  try {
    const li = await verificaLista();
    const total = await precoTotal(li);
    getParagrafo.innerText = total;
  } catch (error) {
    getParagrafo.innerText = '0';
  }
};

// Requisito 6
const emptyCar = document.querySelector('.empty-cart');

const empty = () => {
  emptyCar.addEventListener('click', () => {
   getOl.innerHTML = '';
   precoAsync();
  });
};

// Requisito 7
const removeLoading = () => document.querySelector('.loading').remove();

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Requisito 4 
const savingList = (() => {
  localStorage.setItem('Lista_de_Produtos', getOl.innerHTML);
  localStorage.setItem('Precos', getPrice.innerHTML);
});

// Requisito 3
function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  savingList();
  precoAsync();
}

const getListSaved = (() => {
  getOl.innerHTML = localStorage.getItem('Lista_de_Produtos');
  getPrice.innerHTML = localStorage.getItem('Precos');
  
  const getLi = document.querySelectorAll('.cart__item');

  getLi.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
});

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 1
// Requisito feito com a referência de código do Felipe Muller
// Link: https://github.com/tryber/sd-010-a-project-shopping-cart/blob/7186f9c6b920d6ba685a2c87bcb48e7c2488a5ec/script.js
const getPromiseComputer = () => (
   new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => {
        response.json().then((data) => {
          resolve(data);
        });
      });
  })
);

const AppendItem = (data) => {
  const items = document.querySelector('.items');
  data.results.forEach((element) => {
    const result = createProductItemElement(element);
    items.appendChild(result);
  });
};

// Requisito 2
const AppendIdItem = (data) => {
  const getButton = document.querySelectorAll('.item button');

  getButton.forEach((button, index) => {
    button.addEventListener('click', () => {
      const cart = document.querySelector('.cart__items');
      const element = createCartItemElement(data[index]);
      cart.appendChild(element);
      savingList();
      precoAsync();
    });
  });
};

async function carMarket() {
  try {
    const dado = await getPromiseComputer(); // requisito 1
    removeLoading(); // requisito7
    await AppendItem(dado); // requisito 1
    await AppendIdItem(dado.results); // requisito 2
  } catch (error) {
    console.log('Falha na pesquisa');
  }
}

window.onload = function onload() {
  carMarket();
  getListSaved();
  precoAsync();
  empty();
};
