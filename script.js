// o primeiro requisitos foram feiots com ajuda dos colegas Adelino Junior , Orlando Flores,Thiago souza ,Tiago santos,Jonathan Fernandes,Nilson Ribeiro,Marília , Lucas Lara , e o Prof. Zezé e Jack !!
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
  
  const productsInformation = (computerInfos) => {
    computerInfos.forEach((computer) => {
      const computerSection = document.querySelector('.items');
      computerSection.appendChild(createProductItemElement(computer));
    });
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

  // function getSkuFromProductItem(item) {
    //   return item.querySelector('span.item__sku').innerText;
    // }
    
    // function cartItemClickListener(event) {
      //   // coloque seu código aqui
      // }
      
      // function createCartItemElement({ id, title, salePrice }) {
        //   const li = document.createElement('li');
        //   li.className = 'cart__item';
        //   li.innerText = `SKU: $ id} | NAME: ${title} | PRICE: $${salePrice}`;
        //   li.addEventListener('click', cartItemClickListener);
        //   return li;
        // }

window.onload = function onload() { 
  searchComputerAPI();
  };
