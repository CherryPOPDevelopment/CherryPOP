(function () {
  const toggle = document.querySelector('.hamburger');
  const navigation = document.getElementById('primary-navigation');

  if (!toggle || !navigation) return;

  function setOpen(isOpen) {
    navigation.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
})();
