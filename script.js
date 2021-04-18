// os requisitos foram feitos com ajuda dos colegas Adelino Junior , Orlando Flores,Thiago souza ,Tiago santos,Jonathan Fernandes,Nilson Ribeiro,Marília , Lucas Lara , e o Prof. Zezé e Jack !!

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

  function createProductItemElement({ id, title, thumbnail }) {
    const section = document.createElement('section');
    section.className = 'item';
    
    section.appendChild(createCustomElement('span', 'item__sku', id));
    section.appendChild(createCustomElement('span', 'item__title', title));
    section.appendChild(createProductImageElement(thumbnail));
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
    return section;
  }
  
  function getSkuFromProductItem(item) {
    return item.querySelector('span.item__sku').innerText;
  }

  function cartItemClickListener(event) {
    const { target } = event;
    if (target.classList.contains('cart__item')) {
    target.remove('li');
    }
  }

  function createCartItemElement({ id, title, price }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
}

  const searchItemId = (id) => {
      fetch(`https://api.mercadolibre.com/items/${id}`)
        .then((response) => {
          response.json()
            .then((data) => {
              const IDInfos = data;
              createCartItemElement(IDInfos);
              document.querySelector('.cart__items').appendChild(createCartItemElement(IDInfos));
            });
        });
    };

  const pegaOsDadosItem = () => {
    const buttonAddToChart = [...document.querySelectorAll('.item__add')];
    buttonAddToChart.forEach((button) => {
      button.addEventListener('click', (event) => {
        const IdOfComputer = getSkuFromProductItem(event.target.parentElement);
        searchItemId(IdOfComputer);
      });
    });
  };
  const productsInformation = (computerInfos) => {
    computerInfos.forEach((computer) => {
      const computerSection = document.querySelector('.items');
      computerSection.appendChild(createProductItemElement(computer));
    });
    pegaOsDadosItem();
  };
  
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

window.onload = function onload() { 
  searchComputerAPI();
  pegaOsDadosItem();
  };    
