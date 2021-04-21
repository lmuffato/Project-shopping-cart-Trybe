const buscaComputadores = async () => { // => Requisito - 1
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador'; 
  const response = await fetch(url);
  const data = await response.json();
  const { results } = data;
  return results;
};

const buscaDadosProduto = async (addPont) => { // => Requisito - 2
  const url = `https://api.mercadolibre.com/items/${addPont}`;
  const response = await fetch(url);
  const data = await response.json();
  const { id, title, price } = data;
  const result = { sku: id, name: title, salePrice: price };
  return result;
  // console.log(result);
};

function createProductImageElement(imageSource) { // => Requisito - 1
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) { // => Requisito - 1
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // => Requisito - 1
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function getSkuFromProductItem(item) { // => Requisito - 2
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) { // => Requisito 3
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) { // => Requisito - 2
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const adicionaAoCart = async (event) => { // => Requisito - 2
  const eventItem = event.target; // => captura o botão
  // console.log(event.target);
  const skuId = getSkuFromProductItem(eventItem.parentElement); // => captura o elementoPai 
  const dadosDoProduto = await buscaDadosProduto(skuId);
  // console.log(dadosDoProduto);
  const cartItens = document.querySelector('.cart__items');
  cartItens.appendChild(createCartItemElement(dadosDoProduto));
};

const addEventBotao = () => { // => Requisito - 2
  const selecionarBotao = document.querySelectorAll('.item__add');
  selecionarBotao.forEach((botao) => {
    botao.addEventListener('click', adicionaAoCart);
  });
};

const adicionaElementos = async () => { // => Requisito - 1 : async e await ?
  const itensComputadores = await buscaComputadores();
  itensComputadores.forEach((item) => {
    const elementos = document.querySelector('.items');
    elementos.appendChild(createProductItemElement(item));
  });
  addEventBotao(); // => Requisito - 2 : Para essa função funcionar ela teve que ser chamada dentro da mesma função que foi adicionado os Elementos
};

window.onload = function onload() { 
  buscaComputadores();
  adicionaElementos();
};
