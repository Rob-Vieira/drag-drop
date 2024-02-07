# DragDrop

A função DragDrop permite habilitar a funcionalidade de arrastar e soltar elementos HTML em sua aplicação web.

## Instalação

```html
<script src="dragdrop.mim.js"></script>
```

## Como Usar
Para usar a função DragDrop, chame o script como descrito a acima.

### Lista simples
Essa é a forma mais simples de usar o DragDrop.

Html:
```html
<div data-drag-list>
    <div data-drag-item class="card">Card 01</div>
    <div data-drag-item class="card">Card 02</div>
    <div data-drag-item class="card">Card 03</div>
    <div data-drag-item class="card">Card 04</div>
</div>
```

Javascript:

```javascript
DragDrop();
```

### Multiplas listas
Para usar multiplas listas basta adiciar mais elementos com o atributo data-drag-list.

Html:
```html
<div data-drag-list>
    <div data-drag-item class="card">Card 01</div>
    <div data-drag-item class="card">Card 02</div>
    <div data-drag-item class="card">Card 03</div>
    <div data-drag-item class="card">Card 04</div>
</div>
<div data-drag-list>
    <div data-drag-item class="card">Card 05</div>
    <div data-drag-item class="card">Card 06</div>
    <div data-drag-item class="card">Card 07</div>
    <div data-drag-item class="card">Card 08</div>
</div>
```

### Itens bloqueados
Caso queira que algum item não seja arrastado, adicione o atributo data-drag-item-disabled.

Html:
```html
<div data-drag-list>
    <div data-drag-item data-drag-item class="card">Card 01</div>
    <div data-drag-item class="card">Card 02</div>
    <div data-drag-item data-drag-item-disabled class="card">Card 03</div>
    <div data-drag-item class="card">Card 04</div>
</div>
```

### Opções
Você pode personalizar algumas opções para adaptar o comportamento do DragDrop conforme suas necessidades.

##### scrollZone
Determina a altura, em pixels, da zona onde a rolagem automática é ativada. O valor padrão é 5.

##### scrollSpeed
Determina a velocidade da rolagem automática. O valor padrão é 100.

##### draggingClass
Define a classe CSS que será aplicada ao elemento durante o arraste. O valor padrão é uma string vazia.

##### cloneClass
Quando o arraste ocorre, um elemento com as mesmas dimensões que o elemento arrastado é criado e posicionado em seu lugar. Essa opção define a classe CSS que será aplicada ao elemento clone. O valor padrão é uma string vazia.

### Métodos

##### onDragBeforeStart
O método onDragBeforeStart é um callback opcional que é acionado antes do início do arraste de um elemento. Ele recebe como argumento um objeto contendo o evento do mouse ou toque que desencadeou o início do arraste.

```javascript
/**
 * Callback acionado antes do início do arraste de um elemento.
 * @param {Object} params - Objeto contendo informações sobre o evento que desencadeou o início do arraste.
 * @param {MouseEvent|TouchEvent} params.event - O evento do mouse ou toque que desencadeou o início do arraste.
 * @returns {void}
 */
```

##### onDragStart
O método onDragStart é um callback opcional que é acionado no início do arraste de um elemento. Ele recebe como argumentos um objeto contendo o elemento arrastado e o evento do mouse ou toque que desencadeou o início do arraste.

```javascript
/**
 * Callback acionado no início do arraste de um elemento.
 * @param {Object} params - Objeto contendo informações sobre o elemento arrastado e o evento que desencadeou o início do arraste.
 * @param {Element} params.item - O elemento arrastado.
 * @param {MouseEvent|TouchEvent} params.event - O evento do mouse ou toque que desencadeou o início do arraste.
 * @returns {void}
 */
```

##### onDragMove
O método onDragMove é um callback opcional que é acionado durante o arraste de um elemento. Ele recebe como argumentos um objeto contendo o elemento arrastado e o evento do mouse ou toque que está ocorrendo durante o arraste.

```javascript
/**
 * Callback acionado durante o arraste de um elemento.
 * @param {Object} params - Objeto contendo informações sobre o elemento arrastado e o evento de movimento.
 * @param {Element} params.item - O elemento arrastado.
 * @param {MouseEvent|TouchEvent} params.event - O evento do mouse ou toque que está ocorrendo durante o arraste.
 * @returns {void}
 */
```

##### onDragBeforeEnd
O método onDragBeforeEnd é um callback opcional que é acionado antes do final do arraste de um elemento. Ele recebe como argumentos um objeto contendo o elemento arrastado e o evento do mouse ou toque que desencadeou o final do arraste. 

```javascript
/**
 * Callback acionado antes do final do arraste de um elemento.
 * @param {Object} params - Objeto contendo informações sobre o elemento arrastado e o evento que desencadeou o final do arraste.
 * @param {Element} params.item - O elemento arrastado.
 * @param {MouseEvent|TouchEvent} params.event - O evento do mouse ou toque que desencadeou o final do arraste.
 * @returns {void}
 */
```

##### onDragEnd
O método onDragEnd é um callback opcional que é acionado no final do arraste de um elemento. Ele recebe como argumento um objeto contendo o evento do mouse ou toque que desencadeou o final do arraste.

```javascript
/**
 * Callback acionado no final do arraste de um elemento.
 * @param {Object} params - Objeto contendo informações sobre o evento que desencadeou o final do arraste.
 * @param {MouseEvent|TouchEvent} params.event - O evento do mouse ou toque que desencadeou o final do arraste.
 * @returns {void}
 */
```
