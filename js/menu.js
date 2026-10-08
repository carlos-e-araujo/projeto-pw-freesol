document.addEventListener('DOMContentLoaded', () => {
    const btnAbrir = document.getElementById('btnAbrirMenu');
    const btnFechar = document.getElementById('btnFecharMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    function abrirMenu() {
        if (menuOverlay) {
            menuOverlay.classList.add('ativo');
            document.body.style.overflow = 'hidden';
        }
    }

    function fecharMenu() {
        if (menuOverlay) {
            menuOverlay.classList.remove('ativo');
            document.body.style.overflow = '';
        }
    }

    if (btnAbrir) {
        btnAbrir.addEventListener('click', abrirMenu);
    }

    if (btnFechar) {
        btnFechar.addEventListener('click', fecharMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', (evento) => {
            if (evento.target === menuOverlay) {
                fecharMenu();
            }
        });
    }

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape') {
            fecharMenu();
        }
    });
});
