export default class Slide {
    constructor(slide, wrapper) {
        // Seleciona os elementos do slides com base no seletor fornecido
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        // Define o objeto 'dist' para armazenar informações de distância e posição
        this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    }

    onStart(event) {
        event.preventDefault();
        // Armazena a posição inicial do mouse
        this.dist.startX = event.clientX;
        // Adiciona o eventListener 'mousemove' ao 'wrapper' e chama a função onMove quando ocorrer
        this.wrapper.addEventListener('mousemove', this.onMove);
    }

    moveSlide(distX) {
        // Atualiza a posição do movimento
        this.dist.movePosition = distX;
        // Aplica a transformação CSS para mover o slide horizontalmente
        // baseado no 'distX'
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
    }

    updatePosition(clientX) {
        // Calcula a quantidade de movimento com base na diferença
        // entre a posição inicial e a posição atual do mouse
        this.dist.movement = (this.dist.startX - clientX) * 1.6;
        // Retorna a posição final atualizada do slide
        return this.dist.finalPosition - this.dist.movement;
    }

    onMove(event) {
        // Obtém a posição final atualizada do slide
        const finalPosition = this.updatePosition(event.clientX);
        // Move o slide para a nova posição
        this.moveSlide(finalPosition);
    }

    onEnd(event) {
        // Remove o eventListener 'mousemove' do 'wrapper' para parar de mover o slide
        this.wrapper.removeEventListener('mousemove', this.onMove);
        // Atualiza a posição final do slide
        this.dist.finalPosition = this.dist.movePosition;
    }

    addSlideEvents() {
        // Adiciona o eventListener 'mousedown' ao 'wrapper'
        // e chama a função onStart e onEnd nos eventos
        // mousedown e mouseup respectivamente.
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
    }

    bindEvents() {
        // Atribui as funções a seguir vinculadas ao contexto atual (this)
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        // Retorna a instância do objeto Slide para possibilitar a encadeação de métodos
        return this;
    }
}
