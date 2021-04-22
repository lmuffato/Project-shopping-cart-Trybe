// os requisitos foram feitos com ajuda dos colegas Adelino Junior , Orlando Flores,Thiago souza ,Tiago santos,Jonathan Fernandes,Nilson Ribeiro,Marília , Lucas Lara ,Anderson Nascimento, Carlos Sá, Samuel e o Prof. Zezé e Jack !!
const cartItems = '.cart__items';

//  requisito 1.3 Cria a imagem do computador dentro da seção criada.
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// requisito 1.3 Cria o elemento com a classe e o texto passados como parametro. 
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// requisito 1.3 Cria uma seção na página referente a cada computador que é resposta da pesquina no API, com uma classe , um span com ID , o nome e uma figura.
function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// requisito 2.3 pega o texto (o ID em si) dentro da seção span do item.   
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// requisito 5.1 soma o valor total dos itens no carrinho.
const totalCart = async () => {
  let total = 0;
  const lis = [...document.querySelectorAll('.cart__item')];
  const arrayOfLiContent = lis.map((li) => parseFloat(li.innerText.split('$')[1]));
  total = arrayOfLiContent.reduce((acc, current) => acc + current, 0);
  document.querySelector('.total-price').innerText = total;
};

// requisito 4.1 salvar carrinho de compras no local storage 
function toSaveOnLocal() {
  const toSaveItens = document.querySelector(cartItems);
  localStorage.setItem('cart Item', toSaveItens.innerHTML);
  }

// requisito 3 ao clicar no item no carrinho, remove ele da lista
function cartItemClickListener(event) {
  const { target } = event;
  if (target.classList.contains('cart__item')) {
    target.remove('li');
  }
  totalCart();
  toSaveOnLocal();
}

// requisito 4.2 pegar dados no localStorage e aparecer na página 
function takeOnLocalStorage() {
  const itemOnLocalStorage = localStorage.getItem('cart Item');
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = itemOnLocalStorage;
  const listaDeLis = document.querySelectorAll('.cart__item');
  [...listaDeLis].forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
}

// requisito 2.4 cria o item dentro da seção do carrinho de compras com as infos do produto.
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 2.2 apos o clique em adicionar ao carrinho , o ID do item é buscado e as informações referentes a esse ID é adicionado ao casrrinho. 
const searchItemId = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => {
      response.json()
        .then((data) => {
          const IDInfos = data;
          document.querySelector(cartItems).appendChild(createCartItemElement(IDInfos));
          totalCart();
          toSaveOnLocal();
        });
    });
};

// requisito 2 ao clicar no botão criado dinamicamente (adicionar ao carrinho), pega o ID do item a qual está relacionado na seção.
const pegaOsDadosItem = () => {
  const buttonAddToChart = [...document.querySelectorAll('.item__add')];
  buttonAddToChart.forEach((button) => {
    button.addEventListener('click', (event) => {
      const IdOfComputer = getSkuFromProductItem(event.target.parentElement);
      searchItemId(IdOfComputer);
    });
  });
};

// requisito 1.2 A informação de cada computador na pesquisa é adicionado a um item na section com a classe items e mostrado no html. 
const productsInformation = (computerInfos) => {
  computerInfos.forEach((computer) => {
    const computerSection = document.querySelector('.items');
    computerSection.appendChild(createProductItemElement(computer));
  });
  pegaOsDadosItem();
};

// requisito 7.1 colocar o texto loading enquanto carrega o api.
const createLoadingSpan = () => {
  const span = document.createElement('span');
  span.className = 'loading';
  span.innerText = 'loading...';
  const sectionItens = document.querySelector('.items');
  sectionItens.appendChild(span);
  return span;
};
// requisito 7.2 deleta o span após o carregamento da API
const deleteLoadingSpan = () => {
  document.querySelector('.loading').remove();
};

// Requisito 1.1 acessa o API do mercado livre com os dados da pesquisa.
const searchComputerAPI = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
        .then((data) => {
          const computerInfos = data.results;
          productsInformation(computerInfos);
        });
    });

// requisito 6.1 cria o botão de esvaziar o carrinho.
const allItems = () => {
  const itensOnCart = document.querySelector(cartItems);
  itensOnCart.innerHTML = '';
  localStorage.clear();
  totalCart();
};

// requisto 6.2 ao clicar no botão de esvaziar carrinho , limpa todo o conteudo do carrinho.
const clearAllCart = () => {
  const buttonClearCart = document.querySelector('.empty-cart');
  buttonClearCart.addEventListener('click', allItems);
};

window.onload = function onload() {
  createLoadingSpan();
  searchComputerAPI().then(deleteLoadingSpan);
  pegaOsDadosItem();
  clearAllCart();
  takeOnLocalStorage();
  totalCart();
};
