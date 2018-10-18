const em = document.getElementById('em');

em.onclick = () => setTimeout(() => {
  const val = ['mail', '@', 'pascal', '.', 'io'];

  em.innerText = val.join('');
  em.href = 'mailto:' + em.innerText;
}, 10);
