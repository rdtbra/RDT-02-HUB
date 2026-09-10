# Sincronização Firebase

Projeto rdt-02-hub, Firestore Standard (default), southamerica-east1, plano Spark. Login Google. O domínio rdtbra.github.io foi autorizado no Firebase Authentication. As regras foram publicadas no console e restringem leitura e gravação à conta proprietária verificada e ao documento users/{uid}/hub/state. Não há acesso público nem exclusão pelo cliente.

A configuração Web em dist/assets/firebase-config.js é pública e não é uma credencial administrativa. Nenhuma chave de conta de serviço é usada. Não carregamos Analytics ou Storage.

O catálogo e as imagens continuam no Pages. Ordem, fixadas, favoritos, recentes, limite de cartões, recursos adicionados e registros pessoais ficam num documento privado por conta. O tema permanece por aparelho.

## Uso

Entre com Google. No primeiro aparelho, os dados locais são enviados se a nuvem estiver vazia. Nos demais, se houver diferenças, escolha usar a nuvem ou o aparelho. Antes da substituição, uma cópia é preservada no armazenamento local; a página Backup e meus dados permite baixar essas cópias.

As alterações são agrupadas por 1,8 segundo de inatividade. Transações mesclam campos independentes e interrompem o envio em conflitos no mesmo campo/lista. Listas de recentes são combinadas. Escolher usar o aparelho em um conflito substitui a referência da nuvem por essa versão mediante confirmação. A cópia local anterior é preservada.

Sem conexão, o hub aberto mantém os registros e a fila no armazenamento local; ao retornar, tenta enviar. Isto não instala o site para abertura offline. Aguarde Sincronizado com sua conta antes de trocar de aparelho. Se houver erro, use Tentar novamente. O limite preventivo de 750 KB por documento requer revisão da estrutura se as anotações crescerem além disso.

## Validação

scripts/verificar.mjs verifica a aplicação; verificar-sync.mjs verifica mesclagem; verificar-sync-runtime.mjs simula Firebase para envio, fila offline, retomada, recebimento e conflito. Teste real entre Windows/Android depende do login do proprietário. O navegador interno pode não concluir o popup do Google; preferir Chrome/Edge para a primeira validação.
