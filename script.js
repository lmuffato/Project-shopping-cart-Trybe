//  -------------------------------------------REQUISITO3---------------------------------------------

// REQUISITO3-1 .ao clicar no item no carrinho, remove ele da lista
function cartItemClickListener(event) {
  const { target } = event;
  if (target.classList.contains('cart__item')) {
    target.remove('li');
  }
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
        document.querySelector('.cart__items').appendChild(createCartItemElement(infoById));
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
};