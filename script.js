// constante criada ajustar uma queixa do lint por conta da string '.cart__items'aparecer muitas vezes
const cartItems = '.cart__items';

// Esta função responsável por salvar o conteúdo do carrinho de compras no browser do usuário
// ela é acionada sempre que o ocorre qualquer alteração no carrinho
const saveCart = () => {
  const cartList = document.querySelector(cartItems).innerHTML;
  localStorage.setItem('cartList', cartList);
};

// esta função recupera todos o itens do carrinho de compra, faz a leitura dos valores de 
// preço de cada um, soma o total e gera o texto para mostrar ao usuário
async function calcTotal() {
  const liCart = document.getElementsByTagName('li');
  let soma = 0;
  for (let index = 0; index < liCart.length; index += 1) {
    const price = parseFloat(liCart[index].innerText.split('$')[1], 10); // o preço vem sempre depois de um $
    soma += price;
  }
  let total = document.querySelector('.intro-total');
  if (total !== null) total.parentElement.removeChild(total); // esta linha serve para pagar o total anterior sempre que o carrinho form atualizado
  if (soma > 0) {
    const intro = document.createElement('p');
    intro.innerText = 'Preço total: ';
    intro.className = 'intro-total';
    total = document.createElement('span');
    total.innerText = soma;
    total.className = 'total-price';
    intro.appendChild(total);
    document.querySelector('.cart').appendChild(intro); 
  }  
}

// Esta função foi fornecida no arquivo, ela cria um elemento com a imagem do produto fornecida pela API
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Esta função foi fornecida no arquivo, é uma função genérica para criar elementos DOM apartir de
// tipo, nome de classe e conteúdo formecido nos parâmetro
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Esta função foi fornecida no arquivo, ela recupera o valor de SKU que fica "escondido" dentro
// de um elemento span de classe item__sku q não é visualizável pelo usuário
// ela foi utilizada no pela função callCreateCartItem 
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Esta função é responsavel por remover um elemento do carrinho de compras quando for clicado
function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
  saveCart();
  calcTotal();
}

// Esta função foi fornecida no arquivo, é responsável por criar e configurar um item do carrinho de compras
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Esta função foi criada para acionar o processo de criação de um item do carrinho de compras quando um 
// item de produto for clicado.
async function callCreateCartItem(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);
  const product = await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((result) => result.json());
  const cartObject = { sku, name: product.title, salePrice: product.price };
  const itemCart = createCartItemElement(cartObject);
  document.querySelector('ol.cart__items').appendChild(itemCart);
  saveCart();
  calcTotal();
}

// Esta função foi fornecida no arquivo, ela é resonsábel por criar o elemento do item de produto.
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', callCreateCartItem); // adicionei um eventListener ao botão para que este execute a inserção no carrinho de compras
  section.appendChild(button);  
  return section;
}

// Esta função faz o carregamento do produto na pagina, resgatando as informações na API do mercado livre
async function loadProducts() {
  const loadText = document.createElement('section');
  loadText.innerText = 'Aguarde o carregamento dos produtos';
  loadText.className = 'loading';
  document.querySelector('.items').appendChild(loadText);
  const recoveryData = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => result.json())
    .then((result) => result.results);
  loadText.parentElement.removeChild(loadText);
  recoveryData.forEach((computer) => {
    const computerObject = { sku: computer.id, name: computer.title, image: computer.thumbnail };
    document.querySelector('.items').appendChild(createProductItemElement(computerObject));
  });
}

// Esta função é responsáve por esvaziar o conteúdo do carrinho de compras sempre que o botão 'esvaziar carrinho' for clicado
const emptyCartList = () => {
  document.querySelector('ol.cart__items').innerHTML = '';
  calcTotal();
  saveCart();
};

// Alguns comandos e funções tiveram que ser colocados dentro do Onload pois dependiam da página estar completamente carregada
// o lister no botão de esvaziar o carrinho por exemplo, não tem como ser criado antes da pagina ser carregada, assim como o
// carregamento dos produtos e recuperação das informações arquivadas no browser.
window.onload = function onload() { 
  document.querySelector('.empty-cart').addEventListener('click', emptyCartList);
  const listCart = document.querySelector('.cart__items');
  const listContent = localStorage.getItem('cartList');
  if (listContent !== null) listCart.innerHTML = listContent;
  const liCart = document.getElementsByTagName('li');
  for (let index = 0; index < liCart.length; index += 1) {
    liCart[index].addEventListener('click', cartItemClickListener);
  }
  calcTotal();
  loadProducts();
};
