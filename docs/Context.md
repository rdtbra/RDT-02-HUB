# Contexto do projeto RDT-02-HUB

## Prompt de contexto

Você está trabalhando no projeto local `RDT-02-HUB`, localizado em:

```text
C:\Dados\Hubs\RDT-02-HUB
```

O projeto é um hub pessoal organizado por atividades. Ele reúne materiais, referências, ferramentas de IA, acessos online e registros de retomada em uma interface adequada para Windows, tablets e celulares Android.

## Limite de escopo

Este arquivo descreve somente o projeto `RDT-02-HUB`.

Não misture aqui as rotinas de automação Windows do `C:\Dados\Automation\DV-17-AUT`. O Automation pode ser citado apenas como referência externa ou integração futura; seus scripts, atalhos, VMs e regras devem ser tratados no contexto próprio do projeto de Automação.

`RDT-00-HUB` e `RDT-01-HUB` são fontes de referência histórica/conceitual. Não altere esses projetos automaticamente ao trabalhar no `RDT-02-HUB`.

## Objetivo e princípios

- Organizar atividades como pastas de trabalho com contexto, materiais e recursos relacionados.
- Permitir encontrar, abrir e retomar atividades confortavelmente em Windows, tablet e celular.
- Associar um mesmo recurso a várias atividades quando necessário.
- Distinguir recursos online, locais e remotos, indicando limitações de disponibilidade.
- Manter os dados exportáveis em formatos comuns.
- Usar sincronização privada entre aparelhos, sem tornar o catálogo público.
- Preservar as fontes e evitar duplicações durante importações.
- Não substituir leitores, editores, aplicativos de anotação ou o ambiente de virtualização.

## Decisões recentes de interface e publicação

- O nome visual do produto é **RDT**. `RDT-02-HUB` continua sendo o nome técnico do repositório, do projeto Firebase e do endereço do GitHub Pages.
- A barra lateral pode ser recolhida e reaberta por botão. Essa interação deve continuar funcionando em desktop, tablet e celular.
- Toda alteração aprovada no conteúdo de `dist/` deve ser commitada e enviada ao GitHub Pages como parte do procedimento padrão. Após publicar, atualizar os identificadores de versão dos assets quando necessário para evitar cache antigo.
- Os links das IAs são genéricos e apontam para os serviços atuais; autenticação, histórico, assinatura e contexto permanecem próprios do navegador/dispositivo do usuário.

## Estrutura do projeto

- `dist/`: aplicação estática publicada e executável localmente.
- `dist/index.html`: entrada da aplicação.
- `dist/assets/`: CSS, JavaScript, imagens, configuração do Firebase e arquivos de sincronização.
- `dist/data/catalog.js`: catálogo gerado de categorias e atividades.
- `atividades/`: conteúdo organizado por categoria; cada atividade pode conter `cadastro.json`, `README.md`, descrições e materiais próprios.
- `referencias/rdt-00/`: cópias de fontes do catálogo anterior, usadas para importação/comparação.
- `referencias/rdt-01/`: referência conceitual do quadro/envelopes, sem importação automática.
- `referencias/automation/`: cópias de referências do Automation; não são servidas pela aplicação e não devem virar escopo de automação neste projeto.
- `scripts/`: importação, verificação do catálogo e testes do runtime de sincronização.
- `docs/`: documentação do projeto, incluindo piloto e sincronização.
- `.github/workflows/pages.yml`: publicação somente do conteúdo de `dist/`.

## Aplicação e interface

A aplicação funciona como site estático em HTML, CSS e JavaScript, com navegação por fragmentos de URL. Deve continuar compatível com hospedagem estática e com uso local.

Recursos já previstos:

- navegação por categorias e atividades;
- busca;
- favoritos, recentes e itens fixados;
- anotações com salvamento local/privado;
- criação de novos recursos;
- exportação Markdown;
- backup e restauração JSON;
- páginas específicas para atividades piloto;
- indicação de recursos online, locais e remotos;
- layout responsivo para telefone, tablet e desktop;
- busca opcional para agentes quando o navegador oferecer WebMCP.

Ao alterar a interface, preserve a navegação por hash, a operação sem dependências externas de execução e a ergonomia em telas pequenas. O conforto no celular é critério de aceitação, não uma etapa posterior.

## Catálogo e atividades

O catálogo é carregado por `window.HUB_CATALOG` em `dist/data/catalog.js`. Ele contém `version`, `categories` e `activities`.

Categorias normalmente possuem:

```json
{
  "id": "analise-fontes",
  "name": "Análise de fontes",
  "number": "01"
}
```

Atividades podem conter:

- `id`, `category`, `title` e `code`;
- `resources`, com `id`, `title`, `url` e `kind`;
- `description` e `source`;
- `pilot` para identificar pilotos;
- `image` para a arte da atividade;
- `environment` para informações de ambiente e disponibilidade.

As doze categorias atuais devem continuar distinguíveis e na ordem definida pelo usuário: Análise de fontes, Projetos, Estudo de Material Técnico, Desenvolvimentos, Engenharia Reversa, Lógica de Produtos, Beyond, SDC, Entretenimento, Pessoal, Universidades e Cursos. Categorias sem itens podem existir como espaços reservados.

Ao importar ou editar dados:

1. preserve IDs estáveis e relações entre categoria e atividade;
2. evite duplicar recursos já existentes;
3. não presuma que URLs antigas continuam válidas;
4. mantenha a origem em `source` quando a atividade vier de uma referência;
5. preserve acentos, títulos e descrições originais quando não houver pedido de revisão;
6. não publique dados privados das referências.

## Importação e verificação

`scripts/importar.mjs` transforma cópias das fontes em catálogo. A importação deve ser reproduzível e comparar as fontes antes de alterar o catálogo.

`scripts/verificar.mjs` valida o catálogo, a importação de backup e as rotas/renderizações sem navegador.

`scripts/verificar-sync.mjs` verifica a lógica de mesclagem.

`scripts/verificar-sync-runtime.mjs` simula envio, fila offline, retomada, recebimento e conflitos do Firebase.

Ao criar uma alteração, execute as verificações pertinentes e relate falhas reais, sem ocultar avisos.

## Dados locais, backup e sincronização

Anotações, favoritos, recentes, itens fixados, limite de cartões, recursos adicionados e registros pessoais pertencem ao estado do usuário, não ao catálogo público. O tema continua sendo uma preferência por aparelho.

O Firebase usa Firestore Standard na região `southamerica-east1`, plano Spark, com login Google. A configuração pública em `dist/assets/firebase-config.js` não é uma credencial administrativa. Não há chave de conta de serviço, Analytics ou Storage no projeto.

As regras restringem leitura e gravação à conta proprietária verificada e ao documento `users/{uid}/hub/state`. Não existe acesso público nem exclusão pelo cliente.

Comportamento de sincronização:

- o primeiro aparelho pode enviar seus dados quando a nuvem estiver vazia;
- nos demais aparelhos, o usuário escolhe entre nuvem e aparelho quando houver diferenças;
- antes de substituir dados locais, uma cópia é preservada;
- alterações são agrupadas após aproximadamente 1,8 segundo de inatividade;
- transações mesclam campos independentes;
- conflitos no mesmo campo/lista interrompem o envio para decisão do usuário;
- listas de recentes são combinadas;
- escolher a versão do aparelho substitui a versão correspondente na nuvem mediante confirmação;
- sem conexão, a fila permanece no armazenamento local e tenta reenviar quando a conexão voltar;
- o limite preventivo é de 750 KB por documento;
- o usuário deve aguardar o estado “Sincronizado com sua conta” antes de trocar de aparelho.

Não chame armazenamento local de sincronização. Backup JSON é portabilidade e recuperação, não mesclagem automática.

## Segurança e privacidade

- Não adicione credenciais, tokens ou dados pessoais ao catálogo, ao repositório ou aos logs.
- Não torne documentos Firebase públicos.
- Não publique `referencias/`, cópias de arquivos privados ou dados do usuário.
- Trate links de conversas e recursos pessoais como potencialmente privados e revise a audiência antes da publicação.
- Qualquer alteração de regras Firebase, autenticação ou publicação deve ser explicitada e validada.
- A configuração web do Firebase contém uma chave de API destinada ao cliente. Ela nunca deve ser tratada como credencial administrativa, mas deve permanecer restrita aos domínios autorizados do HUB (GitHub Pages e desenvolvimento local). Não publicar tokens de serviço, senhas ou credenciais administrativas.
- Se o GitHub detectar a chave pública, verificar as restrições no Google Cloud, revisar o uso da chave e revogá-la/rotacioná-la quando houver indício de uso indevido. Testar login e sincronização depois da alteração.

## Desenvolvimento e publicação

Para executar localmente, a partir da raiz do projeto:

```text
python -m http.server 8022 --bind 127.0.0.1 --directory dist
```

Depois, acessar `http://127.0.0.1:8022/`. O servidor deve permanecer restrito à máquina local; não abrir firewall nem expor a aplicação à rede sem solicitação explícita.

O GitHub Pages publica somente `dist/` a cada envio para a branch `main`. Nunca publicar as pastas de referências, dados privados ou fontes de apoio.

## Integrações futuras

Integrações com Windows, pastas locais, atalhos, VMs ou scripts do Automation são etapas futuras e devem ser implementadas por uma camada explícita. O piloto atual não executa comandos, não lê o estado das VMs e não edita arquivos originais externos.

Convenção externa observada no Automation: atalhos web do Windows devem usar `.lnk` com `explorer.exe` como destino e a URL como argumento; os ícones ficam em uma pasta ASCII chamada `Icons`. Essa convenção não transforma o Automation em parte do HUB.

## Procedimento padrão para alterações

1. Identifique a parte do Hub afetada: interface, catálogo, atividade, sincronização, publicação ou documentação.
2. Leia os arquivos relacionados antes de editar.
3. Preserve dados, IDs, rotas, responsividade e privacidade.
4. Faça a menor alteração necessária.
5. Execute `verificar.mjs` e os testes de sincronização quando aplicável.
6. Valide visualmente a rota alterada em desktop e, quando relevante, em viewport móvel.
7. Informe os arquivos modificados, os testes executados e qualquer limitação.

Se a solicitação também mencionar o Automation, separe os trabalhos: mantenha este contexto dedicado ao Hub e use o contexto próprio de `DV-17-AUT` para a automação.
