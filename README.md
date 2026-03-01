# Sistema de Gerenciamento de Loja (PDV)

Um sistema web simples e eficiente para controle de vendas, estoque e relatórios financeiros, desenvolvido com Node.js e SQLite.

## 🚀 Funcionalidades

*   **Dashboard:** Visão geral com cards de Faturamento, Lucro, Total de Vendas e Ticket Médio.
*   **Controle de Estoque:** Cadastro, edição e exclusão de produtos com alertas de estoque baixo.
*   **Ponto de Venda (PDV):**
    *   Interface ágil para vendas.
    *   Busca rápida de produtos.
    *   Carregamento sob demanda ("Ver mais") para otimizar a performance.
*   **Relatórios:** Histórico detalhado de vendas com filtros por data e cálculo automático de lucro.
*   **Interface Moderna:** Design limpo, responsivo e com navegação facilitada.

## 🛠️ Tecnologias Utilizadas

*   **Backend:** Node.js, Express
*   **Frontend:** EJS (Template Engine), CSS3
*   **Banco de Dados:** SQLite (Simples e sem necessidade de configuração complexa)

## 📋 Pré-requisitos

Para rodar este projeto, você precisa ter instalado em sua máquina:

*   [Node.js](https://nodejs.org/) (Recomendado versão LTS)
*   [Git](https://git-scm.com/)

## 🔧 Como Rodar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
    ```

2.  **Acesse a pasta do projeto:**
    ```bash
    cd loja-sistema
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Inicie o servidor:**
    ```bash
    npm start
    ```
    *(Ou `node src/server.js` dependendo da sua configuração)*

5.  **Acesse no navegador:**
    Abra `http://localhost:3000`