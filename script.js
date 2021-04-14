const somarPrecos = () => {
  const Itens = document.querySelectorAll('.cart__item');
  document.getElementsByClassName('total-price')[0].innerText = Math.round(
    [...Itens].map((item) => item.innerHTML.match(/[\d.\d]+$/))
    .reduce((acc, add) => acc + parseFloat(add), 0) * 100,
    ) / 100;
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

const salvandoPagina = () => {
  const lista = document.getElementsByClassName('cart__items')[0].innerHTML;
  localStorage.setItem('chaveLista', lista);
};

function cartItemClickListener(event) {
  event.target.remove();
  salvandoPagina();
  somarPrecos();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function adicionarCarrinho(sku) {
  const itemId = sku;
  const ol = document.querySelector('.cart__items');
  const product = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const json = await product.json()
  .then((element) => createCartItemElement({
        sku: element.id, name: element.title, salePrice: element.price }));
  ol.appendChild(json);
  somarPrecos();
  salvandoPagina();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const botaoCarrinho = section.appendChild(createCustomElement('button', 'item__add', 
  'Adicionar ao carrinho!'));
  botaoCarrinho.addEventListener('click', () => adicionarCarrinho(sku));
  return section;
}

const pegarInfFetch = async (produto) => {
  await new Promise((sucesso) => setTimeout(sucesso, 2000));
  const section = document.querySelector('.items');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produto}`)
  .then((response) => response.json())
  .then((objeto) => {
     objeto.results.forEach((element) => {
     const dadosDosProdutos = { sku: element.id, name: element.title, image: element.thumbnail };
     section.appendChild(createProductItemElement(dadosDosProdutos));
    });
  });
  const loading = document.querySelector('.loading');
  loading.remove();
  return section;
};

pegarInfFetch('computador');

const criarPrecos = () => {
  const paragrafoTotalPrecos = document.createElement('p');
  const textoTotalPrecos = document.createElement('span');
  const containerPrecos = document.getElementsByClassName('cart')[0];
  paragrafoTotalPrecos.innerText = 'Total Preços: $';
  textoTotalPrecos.className = 'total-price';
  paragrafoTotalPrecos.appendChild(textoTotalPrecos);
  containerPrecos.appendChild(paragrafoTotalPrecos);
};

const clearAll = () => {
  const containerList = document.querySelector('.cart__items');
  containerList.innerHTML = '';
  somarPrecos();
  salvandoPagina();
};

const limparTudo = document.getElementsByClassName('empty-cart')[0];
limparTudo.addEventListener('click', clearAll);

window.onload = function onload() {
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('chaveLista');
  const lista = document.querySelectorAll('.cart__item');
  lista.forEach((element) => element.addEventListener('click', cartItemClickListener));
  criarPrecos();
  somarPrecos();
};