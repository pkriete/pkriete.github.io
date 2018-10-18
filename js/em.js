const em = document.getElementById('em');

em.onclick = (e) => {
  e.preventDefault();
  
  setTimeout(() => {
    const val = ['mail', '@', 'pascal', '.', 'io'];

    em.innerText = val.join('');
    em.href = 'mailto:' + em.innerText;
  }, 10);
};
