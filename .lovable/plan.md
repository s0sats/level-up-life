
# 🎮 QuestLife — Sistema de Produtividade Gamificado

## Visão Geral
Plataforma completa de produtividade gamificada com visual vibrante estilo gamer, cores neon, gradientes e efeitos brilhantes. Usuários evoluem através de hábitos, tarefas e metas, competindo em rankings globais.

---

## Fase 1: Fundação e Autenticação

### Sistema de Login/Registro
- Tela única e estilizada com elementos gamer
- Animações de entrada e transições suaves
- Login com email/senha
- Redirecionamento automático ao Dashboard

### Estrutura do Banco de Dados
- Perfis de usuário (username, avatar, nível, XP, coins, streak)
- Tabelas para hábitos, tarefas e metas
- Sistema de conquistas e badges
- Histórico de atividades

---

## Fase 2: Dashboard Principal

### Painel Central
- Barra de XP animada com efeito de preenchimento
- Indicador de nível com animação ao subir
- Contador de streak com chamas visuais
- Cards de resumo diário com gradientes neon
- Acesso rápido a todas as seções

### Gráficos de Evolução
- Gráfico de linha mostrando progresso mensal
- Métricas visuais: taxa de conclusão, melhor dia, maior streak

---

## Fase 3: Sistema de Hábitos

### Criação de Hábitos
- Seletor de emoji/ícone
- Escolha de dias da semana
- Preview visual do hábito

### Gerenciamento
- Marcar como concluído com animação de XP
- Estados: Ativo, Arquivado, Excluído
- Contador de streak individual por hábito

---

## Fase 4: Tarefas e Metas

### Sistema de Tarefas
- Criação com níveis de prioridade (baixa, média, alta)
- XP proporcional à prioridade
- Indicador de prazo com alerta visual

### Sistema de Metas
- Barra de progresso gradual
- Marcos intermediários
- Celebração ao completar meta

---

## Fase 5: Sistema de XP e Níveis

### Mecânica de XP
- Ganhos por: hábitos, streaks, tarefas, metas, login diário
- Penalidades automáticas à meia-noite
- Notificações animadas de ganho/perda

### Sistema de Níveis
- Progressão visual com efeitos especiais
- Marcos a cada 10 níveis com recompensas
- Animação épica ao subir de nível

### Exclusão Inteligente
- Modal de confirmação mostrando XP que será removido
- Opção clara de arquivar vs excluir

---

## Fase 6: Economia (Coins e Loja)

### Sistema de Moedas
- Conversão automática de parte do XP
- Exibição no header com animação

### Loja Virtual
- Ícones de perfil
- Molduras animadas
- Temas visuais
- Escudos de proteção (24h, 3 dias, 7 dias)
- Cards com preview e preços

---

## Fase 7: Perfil e Personalização

### Perfil do Usuário
- Avatar personalizável
- Moldura selecionável
- Badges e conquistas exibidas
- Estatísticas públicas

### Configurações de Privacidade
- Controle do que é visível publicamente

---

## Fase 8: Comunidade e Competição

### Rankings
- Global, mensal e por desafios
- Filtros por XP, nível e streak
- Posição do usuário destacada
- Pódio animado para top 3

### Sistema de Desafios
- Desafios individuais com recompensas
- Desafios comunitários com objetivos coletivos
- Progresso em tempo real

### Comunidade
- Feed de perfis públicos
- Comparação de progresso
- Visualização de conquistas de outros

---

## Design Visual

### Paleta de Cores
- Fundo escuro com gradientes
- Roxo, ciano, magenta e amarelo neon
- Efeitos glow em elementos interativos
- Transições e animações fluidas

### Elementos Gamer
- Barras de progresso estilo RPG
- Ícones de conquista brilhantes
- Cards com bordas luminosas
- Partículas em celebrações

---

## Tecnologias

### Backend (Lovable Cloud)
- Autenticação de usuários
- Banco de dados para todos os dados
- Cálculos automáticos de XP e níveis
- Processamento de penalidades

### Frontend
- React com animações suaves
- Gráficos interativos com Recharts
- Design responsivo para mobile
