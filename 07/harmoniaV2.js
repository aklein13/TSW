// On mouseOver - show , on mouseLeave - hide

hideElement = (element) => element.style.display = 'none';
showElement = (element) => element.style.display = 'block';

displaySibling = (e) => {
  const {target} = e;
  showElement(target.nextElementSibling);
  target.addEventListener('mouseout', hideSibling);
};

displaySiblingPerm = (e) => {
  const {target} = e;
  showElement(target.nextElementSibling);
  target.removeEventListener('mouseout', hideSibling);
  target.removeEventListener('mouseover', displaySibling);
  target.removeEventListener('click', displaySiblingPerm);
  target.addEventListener('click', hideSibling);
};

hideSiblingPerm = (e) => {
  const {target} = e;
  hideElement(target.nextElementSibling);
  target.addEventListener('mouseover', displaySibling);
  target.removeEventListener('click', hideSibling);
};

hideSibling = (e) => {
  const {target} = e;
  hideElement(target.nextElementSibling);
  target.addEventListener('mouseover', displaySibling);
  target.addEventListener('click', displaySiblingPerm);
};

initApplication = () => {
  const toHide = document.querySelectorAll('.bd');
  toHide.forEach(hideElement);
  const toClick = document.querySelectorAll('.hd');
  toClick.forEach((element) => element.addEventListener('mouseover', displaySibling));
};

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    initApplication();
  }
};
