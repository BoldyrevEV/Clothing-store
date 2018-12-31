/**
 * Класс отображения товаров на странице сайта.
 */
class Product {

    /**
     * DTO
     * @param source - источник в котором хранятся все товары (файл *.json).
     * @param {HTMLElement} container - контейнер в котором будут лежать все товары.
     */
    constructor(source, container = '.items-shop') {
        this.source = source;
        this.container = container;
    }

    /**
     * Метод инициализации товаров.
     */
    init() {
        // Обрабатываем ajax запрос.
        fetch(this.source)
            .then(result => result.json())

            .then(data => {
                for (let product of data.contents) {
                    this._render(product);
                }
            });
    }

    /**
     * Метод создания DOM-структуры для товара.
     * @param {object} product - обьект с товаром из json файла.
     */
    _render(product) {
        // общий <div> товара.
        let $container = $(`<div class="items-thing"></div>`);

        // общий <a> товара с изображением, ценой и стоимостью.
        let $containerA = $(`<a class="box-product" href="singlpage.html"></a>`);
        $containerA.append($(`<img class="box-product-img" src="${product.src}" alt="Items7">`));
        $containerA.append($(`<p class="items-thing-name">${product.product_name}</p>`));
        $containerA.append($(`<p class="items-thing-price">$${product.price}.00</p>`));
        $containerA.appendTo($container);

        // общий <div> для конопки купить товар.
        let $addCart = $(`<div class="addCart"
                               data-id="${product.id_product}"
                               data-price="${product.price}"
                               data-title="${product.product_name}"
                               data-src="${product.src}">
                               </div>`);

        // Вложенный в $addCart <div> для конопки купить товар.
        let $add = $(`<div class="add"></div>`);
        $add.append($(`<img class="addBasket" src="img/Basket2.svg" alt="Basket">`));
        $add.append($(`<p class="addCart-text">Add to Cart</p>`));
        $add.appendTo($addCart);

        $addCart.appendTo($container);

        $container.appendTo(this.container);
    }
}