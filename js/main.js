document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav') || document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }
  const fab = document.getElementById('fab') || document.querySelector('.fab-wrap');
  const fabMain = fab && fab.querySelector('.fab-main');
  if (fab && fabMain) {
    fabMain.addEventListener('click', () => {
      const open = fab.classList.toggle('open');
      fabMain.setAttribute('aria-expanded', open);
    });
  }
});
