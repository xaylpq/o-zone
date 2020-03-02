'use strict';

// подключение чекбокса
function toggleCheckbox() {
  const checkbox = document.querySelectorAll('.filter-check_checkbox');

  checkbox.forEach(function (elem) {
    elem.addEventListener('change', function () {
      if (this.checked) {
        this.nextElementSibling.classList.add('checked');
      } else {
        this.nextElementSibling.classList.remove('checked');
      }
    });
  });
}


// подключение корзины
function toggleBasket() {
  const btnCart = document.querySelector('#cart'),
    modalCart = document.querySelector('.cart'),
    btnClose = document.querySelector('.cart-close');

  btnCart.addEventListener('click', () => {
    modalCart.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
  btnClose.addEventListener('click', () => {
    modalCart.style.display = 'none';
    document.body.style.overflow = '';
  });
}


// обработка корзины
function workingBasket() {
  const cards = document.querySelectorAll('.goods .card'),
    cartWrapper = document.querySelector('.cart-wrapper'),
    cartEmpty = document.querySelector('#cart-empty'),
    countGoods = document.querySelector('.counter');

  cards.forEach((card) => {
    const btn = card.querySelector('button');
    btn.addEventListener('click', () => {
      const cardClone = card.cloneNode(true);
      cartWrapper.appendChild(cardClone);
      showData();

      const removeBtn = cardClone.querySelector('.btn');
      removeBtn.textContent = 'Удалить из корзины';

      removeBtn.addEventListener('click', () => {
        cardClone.remove();
        showData();
      });
    });
  });
  
  function showData() {
    const cardsCounter = cartWrapper.querySelectorAll('.card'),
      cardsPrice = cartWrapper.querySelectorAll('.card-price'),
      cardTotal = document.querySelector('.cart-total span');
    let sum = 0;
    countGoods.textContent = cardsCounter.length;

    cardsPrice.forEach((cardPrice) => {
      sum += parseFloat(cardPrice.textContent);
    });
    cardTotal.textContent = sum;

    if (cardsCounter.length !== 0) {
      cartEmpty.remove();
    } else {
      cartWrapper.appendChild(cartEmpty);
    }
  }
}


// подключение фильтров
function actionPage() {
  const cards = document.querySelectorAll('.goods .card'),
        discountCheckbox = document.getElementById('discount-checkbox'),
        min = document.getElementById('min'),
        max = document.getElementById('max'),
        search = document.querySelector('.search-wrapper_input'),
        searchBtn = document.querySelector('.search-btn');

  discountCheckbox.addEventListener('click', filter);

  min.addEventListener('change', filter);
  max.addEventListener('change', filter);

function filter() {
  cards.forEach((card) => {
    const cardPrice = card.querySelector('.card-price'),
          price = parseFloat(cardPrice.textContent),
          goods = document.querySelector('.goods'),
          discount = card.querySelector('.card-sale');
    
    if ((min.value && price < min.value) || (max.value && price > max.value)) {
      // card.parentNode.style.display = 'none';
      card.parentNode.remove();
    } else if (discountCheckbox.checked && !discount) {
      // card.parentNode.style.display = 'none';
      card.parentNode.remove();
    } else {
      // card.parentNode.style.display = '';
      goods.appendChild(card.parentNode); // для того, чтобы акции выводились в категориях
    }
  });
}

// фильтр поиска
  searchBtn.addEventListener('click', () => {
    const searchText = new RegExp(search.value.trim(), 'i');

    cards.forEach((card) => {
      const title = card.querySelector('.card-title');
      if (!searchText.test(title.textContent)) {
        card.parentNode.style.display = 'none';
      } else {
        card.parentNode.style.display = '';
      }
    });
  });

}


// карточка товара и выгрузка
function getData() {
  const goodsWrapper = document.querySelector('.goods');
  return fetch('../db/db.json')
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Данные не были получены, ошибка: ' + response.status);
    }
  })
  .then((data) => 
    {
      return data;
    })
  .catch((err) => {
    console.warn(err);
    goodsWrapper.innerHTML = '<div style="color: red; font-size: 30px;">Упс, что-то пошло не так!</div>';
  });
}

function renderCards(data) {
  const goodsWrapper = document.querySelector('.goods');
  data.goods.forEach((good) => {
    const card = document.createElement('div'); 
    card.className = 'col-12 col-md-6 col-lg-4 col-xl-3'; 
    card.innerHTML = `
            <div class="card" data-category="${good.category}">
              ${good.sale ? '<div class="card-sale"> 🔥Hot Sale🔥 </div>' : ''}
              <div class="card-img-wrapper">
                <span class="card-img-top"
                  style="background-image: url('${good.img}')"></span>
              </div>
              <div class="card-body justify-content-between">
                <div class="card-price">${good.price} ₽</div>
                <h5 class="card-title">${good.title}</h5>
                <button class="btn btn-primary">В корзину</button>
              </div>
            </div>
    `;

    goodsWrapper.appendChild(card);

  });
}

function renderCatalog() {
  const cards = document.querySelectorAll('.goods .card'),
        catalogList = document.querySelector('.catalog-list'),
        catalogBtn = document.querySelector('.catalog-button'),
        catalogWrapper = document.querySelector('.catalog'),
        categories = new Set();
  cards.forEach((card) => {
    categories.add(card.dataset.category);
  });

  categories.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    catalogList.appendChild(li);
  });

  catalogBtn.addEventListener('click', (event) => {
    if (catalogWrapper.style.display) {
      catalogWrapper.style.display = '';
    } else {
      catalogWrapper.style.display = 'block';
    }

    if (event.target.tagName === 'LI') {
      cards.forEach((card) => {
        if (card.dataset.category === event.target.textContent) {
          card.parentNode.style.display = '';
        } else {
          card.parentNode.style.display = 'none';
        }
      });
    }
  });
}


getData().then((data) => {
  renderCards(data);
  toggleCheckbox();
  toggleBasket();
  workingBasket();
  actionPage();
  renderCatalog();
});
