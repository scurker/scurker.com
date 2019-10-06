if(JSON.parse(localStorage.getItem('lightMode'))) {
  document.querySelector('[data-toggle="theme"]').setAttribute('aria-checked', 'false');
  document.body.classList.toggle('theme--light');
}

document.body.addEventListener('click', ({ target }) => {
  if(target.hasAttribute('data-toggle') && target.getAttribute('data-toggle') === 'theme') {
    const active = !(target.getAttribute('aria-checked') === 'true');
    document.body.classList.toggle('theme--light');
    localStorage.setItem('lightMode', String(!active));
    target.setAttribute('aria-checked', String(active));
  }
});