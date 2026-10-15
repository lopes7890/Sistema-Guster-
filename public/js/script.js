setTimeout(function() {
    
    const textoEspera = document.getElementById('texto-espera');
    if (textoEspera) {
        textoEspera.style.display = 'none';
    }

    const video = document.getElementById('meu-video');
    if (video) {
        video.style.display = 'block';
        video.play(); 
        document.getElementById('texto-conectado').style.display = 'block';
    }

}, 5000); 