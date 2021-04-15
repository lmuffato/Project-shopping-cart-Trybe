// Crie uma listagem de produtos

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

  const sectionPai = document.querySelector('.items');
  sectionPai.appendChild(section);

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// pegando o produto com api do mercado livre
function getProduct() {
  return new Promise((resolve) => {
    let produtos;

    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      produtos = data.results;
      produtos.forEach((produto) => createProductItemElement(produto)); 
      resolve();
    }); 
  });  
}
// fim de Crie uma listagem de produtos

// Crie uma listagem de produtos no cart
// Remova o item do carrinho de compras ao clicar nele
function cartItemClickListener(event) {
  const clicarItem = event.target;
  clicarItem.remove();
}

// crio os elementos html / adiciono o produto ao carrinho de compras
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  const addFilho = ol.appendChild(li);
  return addFilho;
}

// pego o conteudo do produto especifico pela api com o id do produto especifico
function getItem(id) {
  let itemAdd;
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      itemAdd = data;
      createCartItemElement(itemAdd);
    });
}

// uso essa função para buscar o conteudo do id do produto especifico
function getIDFromProductItem(item) {
  const iditem = item.querySelector('span.item__sku').innerText;
  return getItem(iditem);
}

// função para cliclar no botão e pegar o conteudo especifico desse clique
function clickAddToCart() {
  const btnAddToCart = document.querySelectorAll('.item__add');
  btnAddToCart.forEach((index) => {
      index.addEventListener('click', (event) => {
      const clicarBtn = event.target.parentNode;
      getIDFromProductItem(clicarBtn);
    });
  });
}
// fim de crie uma listagem de produtos no cart

// onload
window.onload = function onload() {
  getProduct().then(() => clickAddToCart());
};