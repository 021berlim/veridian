# Spec: página de case + aparelhos 3D

## Design (herdar do site)
Fundo #0a0a0b, vermelho #c72c3b, grafite #2b2d31, Space Grotesk, labels mono caixa alta com tracking largo. Sem cards, sem pílulas acima de títulos, sem blur desnecessário; só tipografia e linhas finas 1px. Cantos arredondados só em mídia/mockups. Reaproveitar o visual do CaseDrawer atual (cabeçalho "CASE STUDY // CATEGORIA • ANO", título grande, subtítulo cinza, blocos Contexto/Desafio/Solução/Resultado/Stack).

## Rota
app/projetos/[slug]/page.tsx (Server Component) com generateStaticParams a partir de data/projects.ts, generateMetadata (title "Nome | Zuse Labs", description = tagline), notFound() se slug inválido. Voltar: link "← PROJETOS" para /#projetos; ESC também volta.

## Contrato do palco 3D
// components/projects/case/stage/types.ts
export type DeviceKind = 'laptop' | 'phone'
export type ScreenSource = { type: 'image' | 'video'; src: string; poster?: string }
export type ProjectScreens = { laptop: ScreenSource; phone?: ScreenSource } // phone ausente => usar laptop com object-fit cover
export type DeviceStageProps = { screens: ProjectScreens; initialDevice?: DeviceKind; accent?: string; className?: string }
// Export default de components/projects/case/stage/DeviceStage.tsx (client component), sempre carregado via dynamic(ssr:false) pela página.

## Comportamento 3D (obrigatório)
- Segurar botão esquerdo e arrastar gira o modelo (yaw livre com inércia, pitch limitado a ±30°). Após ~3s parado, retorna suavemente à pose frontal.
- Clique (event.delta < 4px) alterna notebook <-> celular com transição: o aparelho atual sai (escala+rotação+opacity), o outro entra; no notebook a tampa abre de 0° a ~105° ao entrar e fecha ao sair.
- Também existem botões DOM acessíveis "NOTEBOOK" / "CELULAR" (aria-pressed) e a dica mono "ARRASTE PARA GIRAR // CLIQUE PARA TROCAR" que some após a primeira interação.
- Teclado: ←/→ gira, Enter/Space alterna. Canvas com touch-action: pan-y (scroll vertical da página continua funcionando; arraste horizontal gira).
- Aparelhos PROCEDURAIS (RoundedBox, bezel, dobradiça, notch/ilha, botões laterais, base do notebook), sem arquivos .glb. Materiais metálicos escuros (grafite) com detalhe vermelho sutil. Estrutura pronta para trocar por useGLTF depois.
- Tela = mesh com meshBasicMaterial (toneMapped=false) usando TextureLoader (image) ou VideoTexture (video, muted, loop, playsInline, autoplay). colorSpace SRGB, anisotropy máxima, cover sem distorcer (ajustar repeat/offset à proporção).
- Luz: <Environment> com <Lightformer> procedurais (NÃO usar preset/HDR remoto), ContactShadows estáticas (frames=1) ou sombra falsa.
- Performance: dpr [1, 1.75]; frameloop pausado quando fora da viewport (IntersectionObserver); sem shadows reais; vídeo pausa fora da viewport; suspender renderização em aba oculta.
- Fallbacks: sem WebGL ou prefers-reduced-motion => imagem estática da tela dentro de moldura CSS arredondada (sem rotação), mantendo os botões. Skeleton enquanto carrega.
- Animações só com useFrame + MathUtils.damp (sem libs novas).

## Propriedade de arquivos (NÃO editar fora da sua área)
Agent-A-Pagina: app/projetos/**, components/projects/case/** EXCETO stage/, edições mínimas em ProjectIndex (trocar abrir-modal por <Link>), nav/footer se necessário.
Agent-B-3D: components/projects/case/stage/** (somente).
Agent-0 (já feito): data/projects.ts (tipos/campos), types, docs, remoção do modal.
Agent-QA: só corrige bugs após A e B terminarem.
