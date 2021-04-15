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

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}
const appendElement = (element) => {
  const elementToAppend = createProductItemElement(element);
  document.querySelector('.items').appendChild(elementToAppend);
};

const createElements = (data) => {
  console.log(data);
  data.forEach((item) => {
    const obj = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };

    appendElement(obj);
  });
};

const fetchData = async () =>
  new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((resp) => resp.json())
      .then((data) => data.results)
      .then((elements) => {
        if (elements) resolve(elements);
        return reject(new Error('Falha ao buscar os dados!!'));
      });
  });

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

window.onload = async function onload() {
  try {
    const data = await fetchData();
    createElements(data);
  } catch (error) {
    console.log(error);
  }

  // const result = await fetchData();
  // createProductItemElement(result.results[1]);
};
