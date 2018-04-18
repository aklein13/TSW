// On mouseOver - show , on mouseLeave - hide

hideElement = (element) => {
  element.style.display = 'none';
  element.hidden = true;
};

showElement = (element) => {
  element.style.display = 'block';
  element.hidden = false;
};

manageMouseOver = (e) => {
  const {nextElementSibling} = e.target;
  if (!nextElementSibling.permanent) {
    showElement(nextElementSibling);
  }
};

manageClick = (e) => {
  const {nextElementSibling} = e.target;
  if (!nextElementSibling.hidden && !nextElementSibling.permanent) {
    showElement(nextElementSibling);
    nextElementSibling.permanent = true;
  }
  else {
    hideElement(nextElementSibling);
    nextElementSibling.permanent = false;
  }
};

manageMouseOut = (e) => {
  const {nextElementSibling} = e.target;
  if (!nextElementSibling.permanent) {
    hideElement(nextElementSibling);
  }
};

initApplication = () => {
  const toHide = document.querySelectorAll('.bd');
  toHide.forEach(hideElement);
  const toClick = document.querySelectorAll('.hd');
  toClick.forEach((element) => {
    element.addEventListener('mouseover', manageMouseOver);
    element.addEventListener('mouseout', manageMouseOut);
    element.addEventListener('click', manageClick);
  });
};

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    initApplication();
  }
};
