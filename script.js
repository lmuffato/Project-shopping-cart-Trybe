/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

/* function cartItemClickListener(event) {
  // coloque seu código aqui
} */

/* function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */

// #1 - Função que acessa a API do Mercado Livre buscando pelo termo "computador".
async function acessarAPI() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const data = await response.json();
  return data.results;
}

// # 5 - Função que pega a imagem enviada pela função "createProductItemElement",
// cria uma TAG HTML do tipo "img", coloca essa TAG com a classe "item__image",
// indica a fonte da imagem (Parâmetro dessa mesma função) e retorna a imagem.
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// #4 - Função utilizada para criar um novo elemento com uma identificação, classe
// e texto baseado nas informações enviadas pela função "createProductItemElement".
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// #3 - Preciei mudar "sku" para "id", "name" para "title" e "image" para "thumbnail",
// pois são os nomes utilizados na API do Mercado Livre. Essa função separa os objetos
// "id, title e thumbnail" e também adiciona um botão para cada um desses novos elementos.
// A função também coloca tudo isso dentro de uma "section" com a classe "item".
function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// # 2 - Função que pega a busca feita na API do Mercado Livre e envia
// como parâmetro da função "createProductItemElement".
async function resultadosAPI() {
  const computadores = await acessarAPI();
  computadores.forEach((computador) => {
    const cadaItem = document.querySelector('.items');
    cadaItem.appendChild(createProductItemElement(computador)); 
  });
}

window.onload = function () {
  acessarAPI();
  resultadosAPI();
};
