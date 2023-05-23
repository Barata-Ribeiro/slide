export default class Slide {
    constructor(slide, wrapper) {
        // Seleciona os elementos do slides com base no seletor fornecido
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    }

    onStart(event) {
        event.preventDefault();
        this.dist.startX = event.clientX;
        // Adiciona o eventListener 'mousemove' ao 'wrapper' e chama a função onMove quando ocorrer
        this.wrapper.addEventListener('mousemove', this.onMove);
    }

    moveSlide(distX) {
        this.dist.movePosition = distX;
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
    }

    updatePosition(clientX) {
        this.dist.movement = (this.dist.startX - clientX) * 1.6;
        return this.dist.finalPosition - this.dist.movement;
    }

    onMove(event) {
        const finalPosition = this.updatePosition(event.clientX);
        this.moveSlide(finalPosition);
    }

    onEnd(event) {
        // Remove o eventListener 'mousemove' do 'wrapper' para parar de mover o slide
        this.wrapper.removeEventListener('mousemove', this.onMove);
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
