'use strict';

/**
 * Класс отзывов
 */
class Feedback {
    /**
     * DTO
     * @param source - источник отзывов (файл *.json).
     * @param container - DOM-элемент в котором быдет находиться классс отзывов.
     */
    constructor(source, container = '.womenCollection__feedback') {
        this.source = source;
        this.container = container;
        this.fbItems = [];
    }

    /**
     * Метод добавления DOM-структуры отзыва.
     */
    _render() {
        // элемент <div> - для DOM-элементов для input.
        let $feedbackInput = $('<div/>', {
            class: 'feedback-input'
        });

        // input для имени.
        let inputName = `<input type="text" class="feedback-input-input1">`;

        // input для текста.
        let inputText = `<input type="text" class="feedback-input-input2">`;

        // кнопка для добавления отзыва.
        let $addBtn = $(`<button class="add-feedback">Add a comment</button>`);

        // элемент <div> - для DOM-элементов для отзывов.
        let $feedbackItem = $('<div/>', {
            class: 'feedback-item'
        });

        // Создаем структуру отзывов (верстка).
        let $comment = $(`<p class="comment">Comment</p>`);
        $feedbackInput.append($(`<p class="commentName">Enter your name: ${inputName}</p>`));
        $feedbackInput.append($(`<p class="commentText">Enter a comment: ${inputText}</p>`));
        $feedbackInput.append($addBtn);
        $comment.appendTo($(this.container));
        $feedbackInput.appendTo($(this.container));
        $feedbackItem.appendTo($(this.container));

        // Вешаем обработчик на кнопку добавить отзыв.
        $addBtn.on('click', e => {
            // создаем новый обьект для отзыва.
            let newFeedback = {
                id: this.fbItems.length + 1,
                author: $('.feedback-input-input1').val(),
                text: $('.feedback-input-input2').val(),
                isApproved: false,
            };
            this.fbItems.push(newFeedback);
            this._renderItem(newFeedback);
        });
    }

    /**
     * Метод инициализации класса отзывов.
     */
    init() {
        this._render();

        // Обрабатываем ajax запрос.
        fetch(this.source)
            .then(result => result.json())
            .then(data => {

                // Пробегаемся по отзывам.
                for (let i = 0; i < data.length; i++) {
                    this.fbItems.push(data[i]);
                    this._renderItem(data[i]);
                }
            })
    }

    /**
     * Метод отображение отзыва.
     * @param feedback - обьект с отзывом.
     */
    _renderItem(feedback) {
        // общий <div> отзыва.
        let $container = $('<div/>', {
            class: 'fb-item',
            'data-product': feedback.id,
            'data-isApproved': feedback.isApproved,
        });

        if (feedback.isApproved) {
            $container.removeClass('fb-item');
            $container.addClass('fb-item-approved');
        }

        // кнопка для удаления отзыва.
        let $removeBtn = $(`<button class="remove-feedback">Delete</button>`);

        // кнопка для одобрения отзыва.
        let $approved = $(`<button class="approved">Approve</button>`);

        // Формирует общую разметку.
        $container.append($(`<p class="feedback-author">Author: ${feedback.author}</p>`));
        $container.append($(`<p class="feedback-text">Comment: ${feedback.text}</p>`));
        $container.append($removeBtn);
        $container.append($approved);
        $container.appendTo($('.feedback-item'));

        // Вешаем обработчик на кнопку удалить отзыв.
        $removeBtn.on('click', e => {
            // удалим из массива this.fbItems отзыв с feedback.id.
            for (let i = 0; i < this.fbItems.length; i++) {
                if (this.fbItems[i].id === feedback.id) {
                    this.fbItems.splice(i, 1);
                }
            }

            // удаляем отзыв с feedback.id.
            $(`[data-product=${feedback.id}]`).remove();
        });

        // Вешаем обработчик на кнопку одобрить отзыв.
        $approved.on('click', e => {
            $(`[data-product=${feedback.id}]`).removeClass('fb-item');
            $(`[data-product=${feedback.id}]`).addClass('fb-item-approved');
        });
    }
}