'use strict';

/**
 * Função DragDrop para habilitar a funcionalidade de arrastar e soltar elementos HTML.
 * @param {object} [options] - Objeto contendo opções de configuração para a função DragDrop.
 * @param {number} [options.scrollZone = 100] - A distância em pixels a partir da borda da área de rolagem em que a rolagem automática será ativada.
 * @param {number} [options.scrollSpeed = 5] - A velocidade de rolagem automática ao arrastar o elemento para fora da área de rolagem.
 * @param {string} [options.draggingClass = ''] - A classe CSS a ser aplicada ao elemento durante o arraste.
 * @param {string} [options.cloneClass = ''] - A classe CSS a ser aplicada ao clone do elemento durante o arraste.
 * @param {function({event: MouseEvent}): void} [options.onDragBeforeStart] - Função de retorno de chamada acionada antes do início do arraste. Recebe um objeto contendo o evento do mouse.
 * @param {function({item: Element, event: MouseEvent}): void} [options.onDragStart] - Função de retorno de chamada acionada no início do arraste. Recebe um objeto contendo o elemento arrastado e o evento do mouse.
 * @param {function({item: Element, event: MouseEvent}): void} [options.onDragMove] - Função de retorno de chamada acionada durante o arraste. Recebe um objeto contendo o elemento arrastado e o evento do mouse.
 * @param {function({item: Element, event: MouseEvent}): void} [options.onDragBeforeEnd] - Função de retorno de chamada acionada antes do final do arraste. Recebe um objeto contendo o elemento arrastado e o evento do mouse.
 * @param {function({event: MouseEvent}): void} [options.onDragEnd] - Função de retorno de chamada acionada no final do arraste. Recebe um objeto contendo o evento do mouse.
 */
function DragDrop(options = {
    // Configurações padrão caso não sejam fornecidas
    scrollZone: 100, // Distância a partir da borda da área de rolagem em que a rolagem automática será ativada
    scrollSpeed: 5, // Velocidade de rolagem automática ao arrastar o elemento para fora da área de rolagem
    draggingClass: '', // Classe CSS aplicada ao elemento durante o arraste
    cloneClass: '', // Classe CSS aplicada ao clone do elemento durante o arraste
    onDragBeforeStart: (event) => {}, // Função de retorno de chamada acionada antes do início do arraste
    onDragStart: (item, event) => {}, // Função de retorno de chamada acionada no início do arraste
    onDragMove: (item, event) => {}, // Função de retorno de chamada acionada durante o arraste
    onDragBeforeEnd: (item, event) => {}, // Função de retorno de chamada acionada antes do final do arraste
    onDragEnd: (event) => {}, // Função de retorno de chamada acionada no final do arraste
}) {
    // Elementos vazios para inicialização
    const emptyElement = document.createElement('div');
    const clone = document.createElement('div');

    // Variáveis de estado e configuração
    let scrollParent = emptyElement; // Elemento de rolagem pai
    let scrollParentReact = emptyElement.getBoundingClientRect(); // Retângulo de rolagem pai
    let scrollID = null; // ID da solicitação de animação para rolagem automática
    let scrollZone = options.scrollZone; // Distância a partir da borda da área de rolagem em que a rolagem automática será ativada
    let scrollSpeed = options.scrollSpeed; // Velocidade de rolagem automática ao arrastar o elemento para fora da área de rolagem
    let listParent = emptyElement; // Elemento pai da lista
    let item = emptyElement; // Elemento sendo arrastado
    let offsetTop = 0; // Deslocamento superior do elemento
    let offsetLeft = 0; // Deslocamento esquerdo do elemento

    /**
     * Função interna para lidar com o evento de clique ou toque inicial, iniciando o arraste.
     * @param {MouseEvent | TouchEvent} event - O evento de clique ou toque.
     * @returns {void}
     */
    function handlePointerDown(event) {
        // Função de retorno de chamada opcional antes do início do arraste
        options.onDragBeforeStart({ event });

        // Verifica se o elemento clicado possui os atributos necessários para ser arrastável
        if (!event.target.hasAttribute('data-drag-item') || event.target.hasAttribute('data-drag-disabled')) return;

        // Obtém uma referência para o elemento a ser arrastado e seu contêiner pai
        item = event.target;
        listParent = item.parentElement;

        // Obtém o elemento que será usado como área de rolagem durante o arraste
        scrollParent = getScrollParent(item.parentElement);
        scrollParentReact = scrollParent.getBoundingClientRect();

        // Calcula as coordenadas do cursor em relação ao elemento a ser arrastado
        let originalWidth = item.getBoundingClientRect().width;
        let originalHeight = item.getBoundingClientRect().height;
        offsetTop = event.clientY - item.getBoundingClientRect().top;
        offsetLeft = event.clientX - item.getBoundingClientRect().left;

        // Cria um clone do elemento e aplica estilos
        if (options.cloneClass !== '') clone.classList.add(options.cloneClass);
        clone.style.minHeight = getPX(item.offsetHeight);
        clone.style.width = '100%';

        // Desativa a seleção de texto durante o arraste
        setUserSelect(item, 'none');
        removeSelection(window);

        // Aplica estilos ao elemento arrastado e adiciona classes relevantes
        item.style.position = 'fixed';
        item.style.left = getPX(event.clientX - offsetLeft);
        item.style.top = getPX(event.clientY - offsetTop);
        item.style.minWidth = getPX(originalWidth);
        item.style.minHeight = getPX(originalHeight);
        if (options.draggingClass !== '') item.classList.add(options.draggingClass);
        item.setAttribute('data-dragging-item', '');

        // Insere o clone do elemento antes do elemento arrastado
        item.insertAdjacentElement('beforebegin', clone);

        // Função de retorno de chamada opcional no início do arraste
        options.onDragStart({ item, event });
    }

    /**
     * Função interna para lidar com o movimento do mouse ou toque durante o arraste.
     * @param {MouseEvent | TouchEvent} event - O evento de movimento do mouse ou toque.
     * @returns {void}
     */
    function handlePointerMove(event) {
        // Verifica se há um elemento em processo de arraste
        if (item == emptyElement) return;

        // Atualiza as coordenadas do elemento arrastado com base na posição do cursor
        item.style.left = getPX(event.clientX - offsetLeft);
        item.style.top = getPX(event.clientY - offsetTop);

        // Verifica se o cursor está dentro da área de rolagem e inicia a rolagem automática se necessário
        if (event.clientY < scrollParentReact.top + scrollZone && scrollParent.scrollTop > 0) {
            moveScrollSmoothly('goTop');
        } else if (event.clientY > scrollParentReact.bottom - scrollZone && scrollParent.scrollTop < scrollParent.scrollHeight - scrollParent.offsetHeight) {
            moveScrollSmoothly('goBottom');
        } else {
            cancelAnimationFrame(scrollID);
            scrollID = null;
        }

        if (scrollID !== null) return;

        // Lógica para reorganização dos elementos durante o arraste
        let elementsUnderPoints = document.elementsFromPoint(event.clientX, event.clientY);
        let newListParent = elementsUnderPoints.filter(item => item.hasAttribute('data-drag-list'))[0];

        if (newListParent && newListParent !== listParent) {
            if (newListParent.childElementCount == 0) newListParent.insertAdjacentElement('afterbegin', clone);

            newListParent.insertAdjacentElement('afterbegin', item);

            scrollParent = getScrollParent(item.parentElement);
            scrollParentReact = scrollParent.getBoundingClientRect();

            listParent = newListParent;
        }

        let neighborItem = elementsUnderPoints.filter(item => item.hasAttribute('data-drag-item') && !item.classList.contains('dragging'))[0];
        neighborItem = elementsUnderPoints.filter(item => item.hasAttribute('data-drag-item') && !item.hasAttribute('data-dragging-item'))[0];

        if (neighborItem) {
            let isDisabled = neighborItem.hasAttribute('data-drag-disabled');

            let react = neighborItem.getBoundingClientRect();
            let middleOfItem = react.top + (react.height / 2);

            if (event.clientY >= middleOfItem) {
                if (isDisabled && neighborItem.nextElementSibling) {
                    if (neighborItem.nextElementSibling.hasAttribute('data-drag-disabled')) return;
                }

                neighborItem.insertAdjacentElement('afterend', clone);
                neighborItem.insertAdjacentElement('afterend', item);
            } else if (event.clientY < middleOfItem) {
                if (isDisabled && neighborItem.previousElementSibling) {
                    if (neighborItem.previousElementSibling.hasAttribute('data-drag-disabled')) return;
                }

                neighborItem.insertAdjacentElement('beforebegin', clone);
                neighborItem.insertAdjacentElement('beforebegin', item);
            }
        }

        // Função de retorno de chamada opcional durante o arraste
        options.onDragMove({ item, event });
    }

    /**
     * Função interna para lidar com o evento de liberação do mouse ou toque, finalizando o arraste.
     * @param {MouseEvent | TouchEvent} event - O evento de liberação do mouse ou toque.
     * @returns {void}
     */
    function handlePointerUp(event) {
        // Função de retorno de chamada opcional antes do final do arraste
        options.onDragBeforeEnd({ item, event });

        // Restaura as propriedades e classes do elemento arrastado
        item.style = '';
        item.classList.remove('dragging');
        item.removeAttribute('data-dragging-item');
        item = emptyElement;

        // Remove o clone do elemento
        clone.remove();

        // Limpa as referências e o ID de solicitação de animação para rolagem automática
        listParent = emptyElement;
        cancelAnimationFrame(scrollID);
        scrollParent = emptyElement;
        scrollID = null;

        // Função de retorno de chamada opcional no final do arraste
        options.onDragEnd({ event });
    }

    /**
     * Converte um número em uma string com o em PX. Ex: 10px
     * @param {number} value 
     * @returns {string}
     */
    function getPX(value) {
        return `${value}px`;
    }

    /**
     * Remove a seleção de texto.
     * @param {Element} element 
     */
    function removeSelection(element) {
        const elementSelection = element.getSelection();

        if (elementSelection.rangeCount > 0) elementSelection.removeAllRanges();
    }

    /**
     * Define o atributo user-select do css.
     * @param {Element} element 
     * @param {string} value 
     */
    function setUserSelect(element, value) {
        element.style.userSelect = value;

        const children = element.getElementsByTagName('*');

        for (let child of children) {
            child.style.userSelect = value;
        }
    }

    /**
     * Retorna o elemento pai mais próximo que possuí a scrollbar ativo.
     * @param {Element} element 
     * @returns {Element}
     */
    function getScrollParent(element) {
        if (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
            return element;
        } else if (element == document.body) {
            return document.documentElement;
        } else {
            return getScrollParent(element.parentElement);
        }
    }

    /**
     * Movimenta a scrollbar em duas de forma suave.
     * @param {string} direction goTop | goBottom
     */
    function moveScrollSmoothly(direction) {
        cancelAnimationFrame(scrollID);

        function step() {
            scrollParent.scrollTop += (direction == 'goTop' ? -1 : 1) * scrollSpeed;
            scrollID = requestAnimationFrame(step);
        }

        scrollID = requestAnimationFrame(step);
    }

    // Função de inicialização
    function init() {
        // Adiciona manipuladores de eventos para mouse
        window.addEventListener('mousedown', handlePointerDown);
        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('mouseup', handlePointerUp);

        // Adiciona manipuladores de eventos para toque
        window.addEventListener('touchstart', (event) => handlePointerDown(event.touches[0]));
        window.addEventListener('touchmove', (event) => handlePointerMove(event.touches[0]));
        window.addEventListener('touchend', handlePointerUp);
    }

    // Inicializa o comportamento de arrastar e soltar
    init();
}