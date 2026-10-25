# Portfólio — Gustavo Fantini

Site pessoal em português, com apresentação, projeto SiOPA, experiência profissional, formação, competências e contactos.

## Abrir localmente

Abra `index.html` no navegador. O site usa HTML, CSS e JavaScript, sem instalação de dependências ou processo de build.

Também pode usar a extensão Live Server do VS Code para acompanhar alterações.

## Editar

- `index.html`: conteúdo, datas, projetos e links.
- `styles.css`: identidade visual e adaptações para telemóveis.
- `script.js`: menu, navegação, preferência de movimento e ano do rodapé.
- `effects.js`: efeitos editoriais ligados ao scroll.
- `scene3d.js`: geometria, materiais, luzes e controlo da cena WebGL.
- `immersive.css`: abertura e narrativa visual com posicionamento fixo durante o scroll.
- `vendor/`: motor Three.js e licença, servidos localmente.

O conteúdo foi atualizado com base no currículo fornecido em outubro de 2026. A formação atual é Engenharia Informática na Universidade do Minho; o período na Ikatec termina em setembro de 2026. A conclusão da licenciatura está indicada como previsão.

O SiOPA e o respetivo link foram preservados do portfólio anterior. O site inclui email, LinkedIn, GitHub e o número português fornecido pelo autor, com ligações para chamada e WhatsApp. Não inclui morada completa ou data de nascimento.

O conteúdo apresenta interesses, projetos e percurso pessoal, sem foco em procura de emprego. A comunidade de promoções é apresentada com contacto por WhatsApp; os convites diretos para os grupos ainda não foram fornecidos. As experiências com IA são descritas como projetos pessoais com revisão e manutenção pelo autor.

## Acessibilidade e manutenção

O conteúdo permanece visível sem JavaScript. O menu usa um botão com estado acessível e pode ser fechado com Escape. Existem estilos de foco, ligação para saltar a navegação e suporte à preferência de movimento reduzido.

Não são necessários serviços externos para carregar os estilos ou executar o site. As alterações locais só aparecem no site publicado depois de serem enviadas e disponibilizadas pelo processo de publicação do repositório.

## Experiência 3D

A abertura apresenta um computador retrofuturista criado com geometria WebGL: carcaça clara, ecrã curvo com terminal verde, teclado, rato e cabos. No interior existem uma placa com circuitos, processador, módulos de memória e condensadores. As texturas do terminal, incluindo o cursor intermitente, e os reflexos de estúdio são gerados localmente por código.

Arrastar com o rato ou com o dedo roda o computador. Com o canvas focado, as setas rodam a vista e Home repõe a orientação. Na secção seguinte, o scroll afasta a carcaça e o painel frontal para revelar os componentes internos. A câmara recua durante a abertura e as peças voltam a encaixar no final, atravessando três capítulos.

O motor 3D é carregado localmente quando a cena se aproxima do ecrã. A segunda vista só inicializa quando necessário. A resolução é limitada em telemóveis; as vistas fora do ecrã e os separadores ocultos suspendem a renderização contínua.

A preferência de movimento reduzido pausa a animação automática, preservando uma renderização 3D estática e a rotação manual. O controlo Ativar efeitos / Pausar efeitos guarda uma escolha explícita para este site. Sem WebGL2 ou JavaScript, o conteúdo continua disponível e a peça tem uma alternativa em CSS.

Validação no Edge: renderização WebGL2, imagem alterada por arrasto, computador estático com movimento reduzido, três capítulos de scroll, abertura máxima a meio e remontagem no final, suspensão fora do ecrã e alternativa visual do computador sem WebGL. Layout verificado a 390 e 320 px, sem transbordo horizontal.
