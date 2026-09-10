# RDT-02-HUB

Hub pessoal organizado por atividades, para uso prático no celular Android, tablet Android e Windows.

## Direção do projeto

Cada atividade funciona como uma pasta de trabalho com contexto: reúne materiais, referências, anotações, ferramentas de IA, acessos ao ambiente de trabalho e um registro de onde parar e retomar.

A navegação principal será por páginas, listas e busca. O quadro visual de envelopes poderá existir como visualização opcional. Os dispositivos compartilharão os dados, com apresentação adequada a cada tela.

O hub organiza e conecta recursos. Não precisa substituir leitores, aplicativos de escrita manual, editores de código ou o ambiente de virtualização.

## Referências preservadas

- `C:\Dados\Hubs\RDT-00-HUB`: acervo de atividades, materiais e referências.
- `C:\Dados\Hubs\RDT-01-HUB`: conceito de envelopes flexíveis e conexões entre atividades.
- `C:\Dados\Automation\DV-17-AUT`: automações Windows, pastas, programas e controle das VMs.

Este é um projeto separado. A criação dele não altera nem substitui os projetos anteriores. A importação deverá comparar as fontes, preservando informações e evitando duplicações.

## Requisitos prioritários

- Encontrar, abrir e retomar atividades confortavelmente nos três dispositivos.
- Permitir recursos variados e associar um mesmo recurso a várias atividades.
- Salvar automaticamente e sincronizar os registros entre dispositivos; exportação será um recurso de portabilidade, não o procedimento cotidiano de salvamento.
- Distinguir recursos online, recursos locais e acessos remotos, indicando sua disponibilidade.
- Preservar os ambientes Windows e VMware existentes, sem exigir uma VM intermediária para acessar o hub.
- Manter os dados exportáveis em formatos comuns.

## Primeiro piloto proposto

1. Análise de fontes do InterBase.
2. Estudo de um livro técnico, a selecionar.
3. Um recurso de entretenimento, a selecionar.

Validar primeiro organização, abertura e retomada nos aparelhos reais. Depois integrar uma ação de VM e ampliar o acervo. O conforto no celular é critério de aceitação, não uma adaptação final.

## Decisões ainda abertas

- Tecnologia da interface e serviço de armazenamento e sincronização.
- Hospedagem, autenticação e custos.
- Integração local e acesso remoto aos hosts VMware.
- Tratamento de anotações manuscritas e materiais offline.
- Implementação e prioridade do quadro visual opcional.

## Estado atual

Piloto local implementado em `dist/`, com 12 categorias, 191 atividades importadas e páginas específicas para InterBase e EMT-01-ES. Há anotações com salvamento automático local, favoritos, novos recursos, exportação Markdown e backup JSON. Sincronização entre aparelhos, autenticação, e controle de VMs ainda não foram implementados. A publicação no GitHub Pages está configurada para servir somente `dist/` a cada envio à branch `main`.

Veja [o guia do piloto](docs/PILOTO.md) para abrir a aplicação, conhecer os diretórios e entender seus limites.

