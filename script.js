const classOl = '.cart__items';

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

  // Requisito 1
  // Coloca a 'const section' dentro da section.items(HTML)
  const itemsHTML = document.querySelector('.items');
  itemsHTML.appendChild(section);

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// o forEach trata os dados e já utiliza a função que o cria como novo elemento.
function dataTreatment(computersArray) {
  computersArray.forEach((element) => {
    const { id: sku, title: name, thumbnail: image } = element;
    createProductItemElement({ sku, name, image }); // função q usa o element e cria o item
  });
}

// Função que chama os dados do mercado livre e cria o array
async function fetchItems() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
      .then((computers) => {
        const computersArray = computers.results;
        dataTreatment(computersArray); // Linka a funcao com o proximo passo -tratamento
      });
    });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveList() {
  const saveItem = document.querySelector(classOl);
  localStorage.setItem('itemSalvo', saveItem.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  saveList();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 2
function addItem() {
  const items = document.querySelector('.items');
  const cartItems = document.querySelector(classOl);
  items.addEventListener('click', async (event) => {
    const productSku = getSkuFromProductItem(event.target.parentNode);
      fetch(`https://api.mercadolibre.com/items/${productSku}`)
      .then((response) => response.json())
        .then((dataPrice) => {
          const price = { sku: productSku, name: dataPrice.title, salePrice: dataPrice.price };
          cartItems.appendChild(createCartItemElement(price));
          saveList();
      });
    });
  }

  function getLocalStorage() {
    const ol = document.querySelector(classOl);
    ol.innerHTML = localStorage.getItem('itemSalvo');
    // Pegar as lis e colocar o evento de remover.
    const arrayli = [...document.querySelectorAll('.cart__item')]; // spreadOperator espalha os elementos em um array
    arrayli.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
  }

window.onload = function onload() {
  fetchItems();
  addItem();
  getLocalStorage();
 };