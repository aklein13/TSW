const start = () => {
  // $('h3').text('test');
};

document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    start();
  }
};
