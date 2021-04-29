//  -------------------------------------------REQUISITO5---------------------------------------------

const cart = '.cart__items';// ----> atendendo os requisitos do lint, se criou uma constante para armazenar  a classe

// REQUISITO5-1 .soma o valor total dos itens no carrinho.
const totalBuy = async () => {
  let total = 0;
  const values = [...document.querySelectorAll('.cart__item')];
  const arrayOfLiContent = values.map((li) => parseFloat(li.innerText.split('$')[1]));
  total = arrayOfLiContent.reduce((acc, current) => acc + current, 0);
  document.querySelector('.totalprice').innerText = total.toFixed(2);
};

//  -------------------------------------------REQUISITO4---------------------------------------------

// REQUISITO4-1 .salvar carrinho de compras no local storage 
function saveCartList() {
  const savedItens = document.querySelector(cart);
  localStorage.setItem('onCart', savedItens.innerHTML);
  }

//  -------------------------------------------REQUISITO3---------------------------------------------

// REQUISITO3-1 .ao clicar no item no carrinho, remove ele da lista
function cartItemClickListener(event) {
  const { target } = event;
  if (target.classList.contains('cart__item')) {
    target.remove('li');
    saveCartList();
    totalBuy();
  }
}

// cont.requisito4-------->// REQUISITO4-2 .pegar dados no localStorage e aparecer na página 
function loadCartSaved() {
  const getCartSaved = localStorage.getItem('onCart');
  const ol = document.querySelector(cart);
  ol.innerHTML = getCartSaved;
  const itemsList = document.querySelectorAll('.cart__item');
  [...itemsList].forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
  totalBuy();
}

//  -------------------------------------------REQUISITO2---------------------------------------------

// REQUISITO2-4 .cria o item dentro da seção do carrinho de compras com as infos do produto.
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// REQUISITO2-3 .pega o ID dentro da seção span do produto. funcao necessaria para takeProductInfos()
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// REQUISITO2-2 .apos o clique em adicionar ao carrinho , o ID do produto é buscado e as informações referentes a esse ID é adicionado ao carrinho. funcao complementar para takeProductInfos()
const searchId = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => { 
      response.json()
      .then((data) => { 
        const infoById = data;
        document.querySelector(cart).appendChild(createCartItemElement(infoById));
        saveCartList();
        totalBuy();
      });
    });
};

// REQUISITO2-1 .ao clicar no botão, pega o ID do produto a qual está relacionado. funcao complementar para searchProduct()
const takeProductInfos = () => {
  const buttonAddCart = [...document.querySelectorAll('.item__add')];
  buttonAddCart.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = getSkuFromProductItem(event.target.parentElement);
      searchId(productId);
    });
  });
};

//  -------------------------------------------REQUISITO1---------------------------------------------

// REQUISITO1-3 .cria a imagem do computador dentro da seção criada. funcao necessaria para createProductItemElement()
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// REQUISITO1-3 .cria o elemento com a classe e o texto passados como parametro. funcao necessaria para createProductItemElement()
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// REQUISITO1-3 .cria uma seção na página referente a cada computador que é resposta da pesquina no API, com uma classe , um span com ID , o nome e uma figura. funcao necessaria para searchProduct()
function createProductItemElement({ id, title, thumbnail }) { // Solucao criada por Nathi-Zebral , mas poderia ser usado um map pra mapear os parametros para  id -> sku, title -> name, thumbnail -> image.
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// REQUISITO1-2 .a informação de cada produto na pesquisa é adicionado a um item na section com a classe items e mostrado no html. 
const searchProduct = (productInfos) => {
  productInfos.forEach((product) => {
    const computerSection = document.querySelector('.items');
    computerSection.appendChild(createProductItemElement(product));
  });
  takeProductInfos();
};

// REQUISITO1-1 .acessa o API do ML com os dados da pesquisa.
const input = 'computador';
const fetchProducts = (query) => fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => {
    response.json()
    .then((data) => { 
      const queryInfo = data.results;
      searchProduct(queryInfo);
    });
  });
//  ---------------------------------------------------------------------------------------------------------

window.onload = function onload() {
  fetchProducts(input);
  takeProductInfos();
  loadCartSaved();
  saveCartList();
};