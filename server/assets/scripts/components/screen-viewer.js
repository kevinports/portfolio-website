class ScreenViewer {
  constructor(el) {
    el.classList.add('js-enabled');
    el.classList.add('show-prompt');
    this.el = el;
    this.screen = el.querySelector('.screen-viewer__screen');
    this.screenInner = el.querySelector('.screen-viewer__screen--inner');
    this.menuItems = el.querySelectorAll('.screen-viewer__menu li');
    this.select = el.querySelector('.screen-viewer__menu--mobile');
    this.images = el.querySelectorAll('.screen-viewer__image');

    this.currentSelection = '1';

    this.listen();
    this.selectItem();
  }

  listen() {
    for (const item of this.menuItems) {
      item.addEventListener('click', this.handleMenuClick.bind(this))
    }

    this.select.addEventListener("change", (ev) => {
      this.currentSelection = ev.target.value;
      this.selectItem();
    });

    this.screenInner.addEventListener("scroll", () => {
      this.el.classList.remove('show-prompt');
    });

    this.screen.addEventListener('click', () => {
      window.scroll({
        top: this.el.getBoundingClientRect().top + window.scrollY - 24,
        left: 0,
        behavior: 'smooth'
      });
    });

    if(!window.IntersectionObserver) return;
    let observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio!=1){
          this.el.classList.add('no-scroll');
        }
        else {
          this.el.classList.remove('no-scroll');
        }
      });
    }, {threshold: 1});
    observer.observe(this.el);
  }

  handleMenuClick(ev) {
    ev.preventDefault();
    this.currentSelection = ev.target.id;
    this.selectItem();
  }

  selectItem() {
    this.screenInner.scrollTop = 0;

    for (const item of this.menuItems) {
      const el = item.querySelector('a');
      if (el.id === this.currentSelection) {
        el.classList.add('active');
        el.setAttribute('aria-selected', 'true');
      } else {
        el.classList.remove('active');
        el.setAttribute('aria-selected', 'false');
      }
    }

    for (const image of this.images) {
      if (image.dataset.index === this.currentSelection) {
        image.classList.remove('hidden');
        image.setAttribute('aria-hidden', 'false');
      } else {
        image.classList.add('hidden');
        image.setAttribute('aria-hidden', 'true');
      }
    }
  }
}

export default ScreenViewer;
