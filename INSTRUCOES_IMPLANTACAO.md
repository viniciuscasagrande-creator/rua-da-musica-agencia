# Rua da Música — separação de ambientes e usuários por agência

## Conteúdo do pacote
- `src/AccessGate.jsx`: página inicial com quatro acessos e tela de login.
- `src/AdminUsers.jsx`: administrador cadastra diversos usuários por agência.
- `src/App.jsx`, componentes e `api/b2b.js`: isolamento das consultas e gravações por agência, validado **no servidor**, nunca apenas no navegador.
- `api/auth.js`, `lib/auth.js`: autenticação com senha usando scrypt e sessão HMAC (8 horas).
- `migrations/001_portal_users.sql`: tabela nova `PortalUser`, vinculada a `Agency`.
- `scripts/setup-auth.mjs`: cria as tabelas e **somente o primeiro administrador**.

## Antes de publicar
1. Faça backup atualizado do Neon e teste a migração num banco de homologação.
2. Configure `DATABASE_URL` e `AUTH_SECRET` (segredo aleatório de no mínimo 32 caracteres) nas variáveis do ambiente Vercel. Não publique os valores no repositório.
3. Em ambiente local seguro, defina `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD` (12+ caracteres) e, opcionalmente, `BOOTSTRAP_ADMIN_NAME`. Execute `node scripts/setup-auth.mjs` uma vez, com acesso ao Neon. Apague as variáveis de bootstrap depois.
4. Instale dependências (`npm ci`) e execute `npm run build`; publique via fluxo existente da Vercel.
5. Entre em `/admin` com a conta criada e use **Gerenciar usuários** para cadastrar contas adicionais. Para cada perfil Agência, selecione a agência já cadastrada.
6. Teste com dois usuários de agências diferentes: cada um deve receber apenas a própria agência e reservas; tente consultar e alterar dados da outra por HTTP (o servidor deve bloquear/substituir o agencyId). Teste perfis operador, produtor e administrador.

## Notas de segurança e limitações
- **Não foi executado contra o Neon de produção.** O backup foi usado para gerar os arquivos, sem uso das credenciais inclusas nele.
- Login está protegido por senha e assinatura HMAC, mas antes de exposição pública recomenda-se adicionar rate limiting, registro de auditoria, política de redefinição de senhas e revisão de segurança.
- Os fluxos anteriores mantêm comportamento de demonstração em alguns pontos (datas, saldos e apresentação de vouchers). O pacote **não é autorização para vender ou validar ingresso real** sem validação transacional adicional.
- A interface administrativa permite **criar e listar** usuários; bloqueio, troca de senha e redefinição de acesso ainda devem ser desenvolvidos.
- O perfil `agency` recebe dados apenas de sua agência nas respostas de `GET /api/b2b`, e o servidor prevalece sobre o `agencyId` informado pelo navegador ao criar reservas.
- O `AUTH_SECRET` deve ser o mesmo entre instâncias do ambiente. Alterá-lo invalida sessões existentes.
- `sessionStorage` guarda o token até a aba ser fechada; use HTTPS e uma política CSP adequada na implantação.
- Faça o teste de build local. Este pacote não foi compilado neste ambiente porque a instalação das dependências não pôde ser concluída.
