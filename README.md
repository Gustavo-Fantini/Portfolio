# Portfólio — Gustavo Fantini

Site pessoal em português, com apresentação, projeto SiOPA, experiência profissional, formação, competências e contactos.

## Abrir localmente

Abra `index.html` no navegador. O site usa HTML, CSS e JavaScript, sem instalação de dependências ou processo de build.

Também pode usar a extensão Live Server do VS Code para acompanhar alterações.

## Editar

- `index.html`: conteúdo, datas, projetos e links.
- `styles.css`: identidade visual e adaptações para telemóveis.
- `script.js`: menu, navegação, preferência de movimento e ano do rodapé.
- `effects.js`: cena 3D, rede interativa e efeitos ligados ao scroll.

O conteúdo foi atualizado com base no currículo fornecido em outubro de 2026. A formação atual é Engenharia Informática na Universidade do Minho; o período na Ikatec termina em setembro de 2026. A conclusão da licenciatura está indicada como previsão.

O SiOPA e o respetivo link foram preservados do portfólio anterior. O site inclui email, LinkedIn, GitHub e o número português fornecido pelo autor, com ligações para chamada e WhatsApp. Não inclui morada completa ou data de nascimento.

O conteúdo apresenta interesses, projetos e percurso pessoal, sem foco em procura de emprego. A comunidade de promoções é apresentada com contacto por WhatsApp; os convites diretos para os grupos ainda não foram fornecidos. As experiências com IA são descritas como projetos pessoais com revisão e manutenção pelo autor.

## Acessibilidade e manutenção

O conteúdo permanece visível sem JavaScript. O menu usa um botão com estado acessível e pode ser fechado com Escape. Existem estilos de foco, ligação para saltar a navegação e suporte à preferência de movimento reduzido.

Não são necessários serviços externos para carregar os estilos ou executar o site. As alterações locais só aparecem no site publicado depois de serem enviadas e disponibilizadas pelo processo de publicação do repositório.

## Efeitos visuais

A cena do perfil tem perspetiva 3D, camadas em profundidade, resposta amortecida ao cursor e reflexo que acompanha o rato. A abertura inclui uma rede animada em canvas que reage ao cursor. O scroll controla a deslocação do perfil, a revelação dos títulos palavra a palavra, a profundidade da ilustração SiOPA, o preenchimento do percurso e as linhas das competências. As competências e o contacto também respondem ao cursor com iluminação localizada.

Os efeitos usam APIs nativas, sem dependências. Um único ciclo requestAnimationFrame coordena a interação; o desenho da rede para quando a abertura sai do ecrã ou o separador fica oculto. A versão móvel reduz a complexidade visual e desativa a inclinação 3D do perfil.

O site respeita movimento reduzido por predefinição. O controlo Ativar efeitos / Pausar efeitos e o convite junto ao perfil permitem uma escolha explícita apenas neste site. A escolha fica guardada quando o armazenamento está disponível. Sem JavaScript, o conteúdo e os links continuam visíveis.

Validação no Edge: ativação a partir de movimento reduzido, camadas 3D e inclinação por movimento real do cursor, desenho da rede, revelação progressiva por scroll, percurso, pausa, persistência e menu móvel. Layout verificado a 390 e 320 px, sem transbordo horizontal.
