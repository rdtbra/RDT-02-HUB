# Piloto local — escopo e preservação

## Organização

- `dist/`: aplicação estática completa, sem dependências externas de execução.
- `atividades/`: documentação separada dos dois pilotos e descrição original do livro.
- `referencias/rdt-00/`: cópias dos nove arquivos de catálogo.
- `referencias/rdt-01/`: cópia do quadro para referência, sem importar automaticamente seus envelopes.
- `referencias/automation/`: cópias dos atalhos InterBase e da lista histórica de páginas. Não são servidas pelo servidor do piloto.
- `scripts/importar.mjs`: transformação reproduzível das cópias do RDT-00 em catálogo.
- `scripts/verificar.mjs`: verificações de catálogo, importação de backup e renderização das rotas sem navegador.

## Menu

Todas as nove categorias do RDT-00 foram mantidas. Engenharia reversa, Lógica de produtos e Entretenimento foram acrescentadas conforme a organização do Automation. Categorias ainda sem itens são identificadas como espaços reservados. Recursos gerais permanecem em Pessoal, onde já estavam cadastrados, sem duplicar automaticamente os atalhos externos do Desktop.

As 191 atividades têm uma página e os acessos web disponíveis no catálogo. InterBase e EMT-01-ES têm conteúdo específico. A importação não presume que os endereços antigos continuam válidos.

## Estado e limites

Anotações, favoritos e recursos adicionados são salvos no armazenamento local do navegador. Há backup JSON e exportação Markdown. Importar um backup substitui os registros locais após confirmação; não é sincronização e não faz mesclagem.

Não há autenticação, serviço de sincronização, leitura de estado de VMs, execução de comandos, edição dos arquivos originais. Esses componentes continuam sendo etapas posteriores e não são simulados.

O aplicativo funciona com HTML, CSS e JavaScript. A navegação usa fragmentos de URL, compatíveis com hospedagem estática. A interface tem regras para telefone, tablet e desktop; a ergonomia com toque/caneta ainda precisa ser validada nos aparelhos reais.

Há uma busca opcional para agentes via WebMCP, ativada apenas quando o navegador oferece essa interface. O contrato foi verificado em contexto simulado; não houve validação em um navegador com WebMCP real.

## Abrir

Na pasta do projeto, execute `python -m http.server 8022 --bind 127.0.0.1 --directory dist` e acesse `http://127.0.0.1:8022/` no mesmo computador. O servidor fica restrito à máquina local. Não houve abertura de firewall ou exposição à rede.

## Próxima etapa

Avaliar os dois pilotos; decidir armazenamento privado e sincronização; validar nos Androids. Depois integrar o acesso ao ambiente Windows. Para publicar, servir somente `dist/`, nunca as pastas de referências e atalhos. Os links de conversas e recursos pessoais também exigem revisão da audiência antes de publicação.

## Publicação

O workflow em .github/workflows/pages.yml valida e publica somente dist/ no GitHub Pages. As cópias em referencias/ permanecem locais e estão excluídas do Git; para executar importar.mjs, é necessário tê-las na máquina. O catálogo gerado já acompanha a aplicação. Anotações e favoritos continuam privados no armazenamento de cada navegador e não são enviados ao repositório.

