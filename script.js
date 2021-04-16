//                        Requisito 1 - Crie uma listagem de produtos.

//              Função Nativa - Requisito 1              //
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

//              Função Nativa - Requisito 1              //
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

//              Função Nativa - Requisito 1              //
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

async function recoverMercadoLivreResults(term) {
  // OU: const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  // OU: const edpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  // OU: const response = await fetch(endpoint);
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`);
  const object = await response.json();
  // const obj = object.results;
  const { results: obj } = object;
  const itemsElement = document.querySelector('.items');

  obj.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    itemsElement.appendChild(element);
  });
}

//                        Requisito 4 - Carregue o carrinho de compras através do LocalStorage ao iniciar a página.
// const productPrice = document.querySelector('.total-price');

// salvar carrinho no localStorage
function storeCart() {
  const shopCart = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('cart', shopCart.innerHTML);
  // localStorage.setItem('productValue', productPrice.innerHTML);
}

//                        Requisito 3 - Remova o item do carrinho de compras ao clicar nele.
//              Função Nativa
function cartItemClickListener(event) {
  event.target.remove();
  storeCart(); // para remover do localStorage - Requisito 4
}

// Função auxiliar para o Requisito 4
// função para reinserir lista de produtos do localStorage
// sempre será executado ao abrir a página, ou seja, criará o evento

function updatePage() {
    const cart = document.querySelector('.cart__items');
    cart.innerHTML = localStorage.getItem('cart');
    const recoverItems = document.querySelectorAll('.cart__item');
    // adiciona o evento click no cart__item que está no carrinho de compras 
   [...recoverItems].forEach((listItem) => 
   listItem.addEventListener('click', cartItemClickListener));
    // productPrice.innerHTML = localStorage.getItem('productValue');
}

//                        Requisito 2 - Adicione o produto ao carrinho de compras

//              Função Nativa - Requisito 2 - captura id dos produtos             //
function getSkuFromProductItem(item) {
  console.log(item);
  return item.querySelector('span.item__sku').innerText;
}

//              Função Nativa - Requisito 2              //
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProductToCart() {
  // quando o usuário clicar no botão "Adicionar ao Carrinho!" que está em section class='items' (seção dos produtos)
  // e vai adicionar o produto na ol class='cart__items'  
  const selectItems = document.querySelector('.items');
  selectItems.addEventListener('click', async (event) => {
    const id = getSkuFromProductItem(event.target.parentNode);
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const object = await response.json();
    // const item = { sku: id, name: object.title, salePrice: object.price };
    const item = {
      sku: id,
      name: object.title,
      salePrice: object.price,
    }; 
    const getItemCart = createCartItemElement(item);
    const getItemsCart = document.querySelector('.cart__items');
    getItemsCart.appendChild(getItemCart); // novo elemnento na lista
    storeCart(); // para salvar o carrinho no localStorage - Requisito 4
  });
}
 
window.onload = function onload() {
  recoverMercadoLivreResults('computador');
  addProductToCart();
  updatePage();
};
