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
  /*
    Funcao de listagem de produtos
    Cria elemento 'section' no DOM
    Acrescenta a classe 'item' a 'section' criada
  */
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  /*
    Agregam ao elemento section, elementos filho 'span' com os valores das chaves (sku e name)
    Agrega ao elemento section, elemento filho 'img' com os valores da chave (image)
    Agrega ao elemento section, um botao para adicionar item ao carrinho
  */
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function sumValue() {
  let sum = 0;
  const totalValue = document.querySelector('.total-price');
  const cartItems = document.querySelectorAll('li');
  [...cartItems].forEach((element) => {
    // carrega os elementos do cartItems num array
    // e para cada elemento
    sum += parseFloat(element.innerHTML.split('$')[1]);
    // converte a string em numero e soma esses valores
    totalValue.innerHTML = sum;
  });

  // o elemento indicado pelo totalValue e carregado
  // com o valor do acumulador da soma
}

function saveCart() {
  // salva lista do carrinho
  const cartList = document.querySelector('.cart__items');
  const totalValue = document.querySelector('.total-price');
  localStorage.setItem('cart', cartList.innerHTML);
  // salva conteudo dos elementos da lista
  localStorage.setItem('value', totalValue.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  // remove elemento target do click
  sumValue();
  saveCart();
}

function loadCart() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cart');
  // carrega lista com conteudo do localStorage
  const cartItems = document.querySelectorAll('li');
  cartItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  // torna os itens da lista recarregada clicaveis
  sumValue();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function emptyCart() {
  // esvazia o carrinho
  const emptyCartBtn = document.querySelector('.empty-cart');
  const cartList = document.querySelector('.cart__items');
  const totalValue = document.querySelector('.total-price');
  emptyCartBtn.addEventListener('click', () => {
    // torna o botao clicavel
    cartList.innerHTML = '';
    // limpa a lista do carrinho
    localStorage.clearAll();
    // limpa tudo o que esta armazenado no localStorage
    totalValue.innerHTML = 0;
    // reseta valor da soma total
  });
}

function loadingAlert() {
  const loading = document.createElement('p');
  // cria elemento
  loading.className = 'loading';
  // adiciona classe
  loading.innerHTML = 'loading...';
  // carrega texto do elemento
  document.body.appendChild(loading);
  // fixa elemento criado ao body do HTML
}

function removeLoadingAlert() {
  const loading = document.querySelector('.loading');
  document.body.removeChild(loading);
  // remove elemento
}