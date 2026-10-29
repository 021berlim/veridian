# Telas dos Aparelhos 3D (Zuse Labs)

Para trocar o conteúdo exibido na tela dos modelos 3D (Notebook e Celular):

1. **Substituição direta de imagem (PNG):**
   - Basta substituir o arquivo PNG correspondente mantendo o mesmo nome:
     - Notebook / Desktop: `screen-laptop.png` (resolução recomendada: **1920×1200**, proporção 16:10)
     - Celular / Mobile: `screen-phone.png` (resolução recomendada: **1170×2532**, proporção ~19.5:9)
   - O sistema 3D recarrega e ajusta a proporção automaticamente via Three.js sem necessidade de recompilar código.

2. **Uso de Vídeo (.mp4 / .webm):**
   - Adicione o vídeo na pasta e em `data/projects.ts` configure o objeto com `type: 'video'`:
   ```ts
   screens: {
     laptop: {
       type: 'video',
       src: '/projects/meu-projeto/demo-laptop.mp4',
       poster: '/projects/meu-projeto/screen-laptop.png'
     }
   }
   ```
