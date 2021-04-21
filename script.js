// os requisitos foram feitos com ajuda dos colegas Adelino Junior , Orlando Flores,Thiago souza ,Tiago santos,Jonathan Fernandes,Nilson Ribeiro,Marília , Lucas Lara , e o Prof. Zezé e Jack !!
const cartItems = '.cart__items';

// cria a imagem do computador dentro da seção criada.
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// cria o elemento 
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// cria uma seção na página referente a cada computador que é resposta da pesquina no API, com uma classe , um span com ID , o nome e uma figura.
function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}
// pega o texto (o ID em si) dentro da seção span do item.   
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// soma o valor total 
const totalCart = async () => {
  let total = 0;
  const lis = [...document.querySelectorAll('.cart__item')];
  const arrayOfLiContent = lis.map((li) => parseFloat(li.innerText.split('$')[1]));
  total = arrayOfLiContent.reduce((acc, current) => acc + current, 0);
  document.querySelector('.total-price').innerText = total;
};

// salvar carrinho de compras no local storage 
function toSaveOnLocal() {
  const toSaveItens = document.querySelector(cartItems);
  localStorage.setItem('cart Item', toSaveItens.innerHTML);
  }

// ao clicar no item no carrinho, remove ele da lista
function cartItemClickListener(event) {
  const { target } = event;
  if (target.classList.contains('cart__item')) {
    target.remove('li');
  }
  totalCart();
  toSaveOnLocal();
}

// pegar dados no localStorage e aparecer na página 
function takeOnLocalStorage() {
  const itemOnLocalStorage = localStorage.getItem('cart Item');
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = itemOnLocalStorage;
  const listaDeLis = document.querySelectorAll('.cart__item');
  [...listaDeLis].forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
}

// cria o item dentro da seção do carrinho de compras com as infos do produto.
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// apos o clique em adicionar ao carrinho , o ID do item é buscado e as informações referentes a esse ID é adicionado ao casrrinho. 
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

// ao clicar no botão adicionar ao carrinho, pega o ID do item a qual está relacionado na seção.
const pegaOsDadosItem = () => {
  const buttonAddToChart = [...document.querySelectorAll('.item__add')];
  buttonAddToChart.forEach((button) => {
    button.addEventListener('click', (event) => {
      const IdOfComputer = getSkuFromProductItem(event.target.parentElement);
      searchItemId(IdOfComputer);
    });
  });
};

// a informação de cada computador na pesquisa é adicionado a um item na section com a classe items e mostrado no html. 
const productsInformation = (computerInfos) => {
  computerInfos.forEach((computer) => {
    const computerSection = document.querySelector('.items');
    computerSection.appendChild(createProductItemElement(computer));
  });
  pegaOsDadosItem();
};

// acessa o API do mercado livre com os dados da pesquisa.
const searchComputerAPI = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
        .then((data) => {
          const computerInfos = data.results;
          productsInformation(computerInfos);
        });
    });
};

// chamar ele dentro da criação e cart inte

// cria o botão de esvaziar o carrinho.
const allItems = () => {
  const itensOnCart = document.querySelector(cartItems);
  itensOnCart.innerHTML = '';
  localStorage.clear();
  totalCart();
};
// ao clicar no botão de esvaziar carrinho , limpa todo o conteudo do carrinho.
const clearAllCart = () => {
  const buttonClearCart = document.querySelector('.empty-cart');
  buttonClearCart.addEventListener('click', allItems);
};

window.onload = function onload() {
  searchComputerAPI();
  pegaOsDadosItem();
  clearAllCart();
  takeOnLocalStorage();
  totalCart();
};

// localStorage 
// para salvar um valor no local storage: localStorage.setItem('chave', 'valor');
// para acessar o valor : localStorage.getItem('nomeDaChave');
// para salvar o valor da chave em uma variável : let nomeDaVariavel = localStorage.getItem('nomeDaChave');
// para deletar a chave : localStorage.removeItem('nomeDaChave');