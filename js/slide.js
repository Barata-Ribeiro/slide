export default class Slide {
    constructor(slide, wrapper) {
        // Seleciona os elementos do slides com base no seletor fornecido
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        // Define o objeto 'dist' para armazenar informações de distância e posição
        this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    }

    transition(active) {
        // Define a transição CSS para o slide com base no valor de 'active'
        this.slide.style.transition = active ? 'transform .3s' : '';
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
        this.transition(false);
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
        this.transition(true);
        this.changeSlideOnEnd();
    }

    changeSlideOnEnd() {
        // Verifica se deve mudar de slide com base no movimento final e nos índices do slide
        if (this.dist.movement > 120 && this.index.next !== undefined) {
            this.activeNextSlide();
        } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
            this.activePrevSlide();
        } else {
            this.changeSlide(this.index.active);
        }
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
        // Calcula a posição do slide com base na margem e no tamanho do wrapper
        const margin = this.wrapper.offsetWidth - slide.offsetWidth / 2;
        return -(slide.offsetLeft - margin);
    }

    slidesConfig() {
        // Mapeia os elementos dos slides para obter suas posições iniciais
        this.slideArray = [...this.slide.children].map((element) => {
            const position = this.slidePosition(element);
            return { element, position };
        });
    }

    slidesIndexNav(index) {
        // Configura os índices do slide anterior, ativo e próximo
        const last = this.slideArray.length - 1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1,
        };
    }

    changeSlide(index) {
        // Move o slide para a posição do slide ativo
        const activeSlide = this.slideArray[index];
        this.moveSlide(activeSlide.position);
        // Atualiza os índices do slide
        this.slidesIndexNav(index);
        // Atualiza a posição final do slide
        this.dist.finalPosition = activeSlide.position;
    }

    // slide nav

    activePrevSlide() {
        // Ativa o slide anterior
        if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
    }

    activeNextSlide() {
        // Ativa o próximo slide
        if (this.index.next !== undefined) this.changeSlide(this.index.next);
    }

    init() {
        this.bindEvents();
        this.transition(true);
        this.addSlideEvents();
        this.slidesConfig();
        // Retorna a instância do objeto Slide para possibilitar a encadeação de métodos
        return this;
    }
}
