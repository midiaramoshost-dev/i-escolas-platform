

## Melhorar a Homepage com Slideshow de Imagens

### O que sera feito

A hero section da landing page sera aprimorada com um slideshow de imagens reais que mostram cenarios escolares, substituindo os slides atuais que usam apenas gradientes e icones. Isso tornara a pagina mais visualmente atraente e profissional.

### Mudancas planejadas

**1. Adicionar imagens de alta qualidade ao slideshow**

Os slides atuais (com icones e gradientes) serao substituidos por slides com imagens de fundo reais, usando URLs do Unsplash (imagens gratuitas de alta qualidade) com temas escolares:
- Slide 1: Sala de aula moderna / dashboard (tema: gestao inteligente)
- Slide 2: Professor interagindo com alunos (tema: diario digital)
- Slide 3: Pais acompanhando no celular (tema: portal do responsavel)
- Slide 4: Equipe escolar colaborando (tema: gestao completa)

Cada slide tera:
- Imagem de fundo com overlay escuro para contraste
- Titulo e descricao sobre a imagem
- Botao de acao (CTA)
- Indicadores de posicao (dots) na parte inferior
- Transicao automatica a cada 5 segundos

**2. Melhorias visuais adicionais na hero**

- Overlay gradiente sobre as imagens para garantir legibilidade do texto
- Indicadores de slide (dots) clicaveis abaixo do carrossel
- Altura maior do carrossel para dar destaque as imagens (h-80 md:h-96)
- Efeito de zoom suave nas imagens ao trocar de slide

### Detalhes tecnicos

**Arquivo modificado:** `src/pages/Index.tsx`

- Atualizar o array `heroSlides` para incluir URLs de imagens do Unsplash
- Reestruturar o componente do carrossel para usar `img` tags com `object-cover`
- Adicionar estado para rastrear o slide ativo e renderizar dot indicators
- Manter a auto-rotacao existente (useEffect com setInterval)
- Usar CSS overlay (`bg-black/50`) para garantir legibilidade do texto branco sobre imagens
- Adicionar efeito `transition-transform duration-700 group-hover:scale-105` para zoom suave

Nenhuma dependencia nova sera necessaria - sera usado o componente Carousel ja existente (embla-carousel-react).
