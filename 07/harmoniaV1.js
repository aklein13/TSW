// On click => show / hide

hideElement = (element) => element.style.display = 'none';
showElement = (element) => element.style.display = 'block';

displaySibling = (e) => {
  const {target} = e;
  showElement(target.nextElementSibling);
  target.removeEventListener('click', displaySibling);
  target.addEventListener('click', hideSibling);
};

hideSibling = (e) => {
  const {target} = e;
  hideElement(target.nextElementSibling);
  target.removeEventListener('click', hideSibling);
  target.addEventListener('click', displaySibling);
};

initApplication = () => {
  const toHide = document.querySelectorAll('.bd');
  toHide.forEach(hideElement);
  const toClick = document.querySelectorAll('.hd');
  toClick.forEach((element) => element.addEventListener('click', displaySibling));
};

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    initApplication();
  }
};
