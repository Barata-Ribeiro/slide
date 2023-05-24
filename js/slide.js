export default class Slide {
    constructor(slide, wrapper) {
        // Seleciona os elementos do slides com base no seletor fornecido
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        // Define o objeto 'dist' para armazenar informações de distância e posição
        this.dist = { finalPosition: 0, startX: 0, movement: 0 };
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

    onStart(event) {
        let movetype;
        // Verifica se o evento é do tipo'mousedown' ou 'touchmove'
        if (event.type === 'mousedown') {
            event.preventDefault();
            // Armazena a posição inicial do mouse
            this.dist.startX = event.clientX;
            // Seta o tipo do movimento para 'mousemove'
            movetype = 'mousemove';
        } else {
            // Armazena a posição inicial do touch, do primeiro dedo
            this.dist.startX = event.changedTouches[0].clientX;
            // Seta o tipo do movimento para 'touchmove'
            movetype = 'touchmove';
        }
        // Adiciona o eventListener 'mousemove' ao 'wrapper' e chama a função onMove quando ocorrer
        this.wrapper.addEventListener(movetype, this.onMove);
    }

    onMove(event) {
        // Verifica o tipo do evento e seta a posição final atualizada do slide de acordo com o tipo
        const pointerPosition = event.type === 'mousemove' ? event.clientX : event.changedTouches[0].clientX;
        // Obtém a posição final atualizada do slide
        const finalPosition = this.updatePosition(pointerPosition);
        // Move o slide para a nova posição
        this.moveSlide(finalPosition);
    }

    onEnd(event) {
        // Verifica se o evento e remove o evento de acordo com o tipo
        const moveType = event.type === 'mouseup' ? 'mousemove' : 'touchmove';
        // Remove o eventListener 'mousemove' do 'wrapper' para parar de mover o slide
        this.wrapper.removeEventListener(moveType, this.onMove);
        // Atualiza a posição final do slide
        this.dist.finalPosition = this.dist.movePosition;
    }

    addSlideEvents() {
        // Adiciona o eventListener 'mousedown' ao 'wrapper'
        // e chama a função onStart e onEnd nos eventos
        // mousedown e mouseup respectivamente.
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        // Adiciona os mesmos eventos para 'touch'
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }

    bindEvents() {
        // Atribui as funções a seguir vinculadas ao contexto atual (this)
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    // Slides config

    slidePosition(slide) {
        const margin = this.wrapper.offsetWidth - slide.offsetWidth / 2;
        return -(slide.offsetLeft - margin);
    }

    slidesConfig() {
        this.slideArray = [...this.slide.children].map((element) => {
            const position = this.slidePosition(element);
            return { element, position };
        });
    }

    slidesIndexNav(index) {
        const last = this.slideArray.length - 1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1,
        };
    }

    changeSlide(index) {
        const activeSlide = this.slideArray[index];
        this.moveSlide(activeSlide.position);
        this.slidesIndexNav(index);
        this.dist.finalPosition = activeSlide.position;
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        this.slidesConfig();
        // Retorna a instância do objeto Slide para possibilitar a encadeação de métodos
        return this;
    }
}
