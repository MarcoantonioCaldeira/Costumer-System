# CRM-projetct

Este é um projeto de aplicação CRM (Customer Relationship Management) que consiste em um backend desenvolvido com NestJS e um frontend com Angular.


![Gravando_2025-06-10](https://github.com/user-attachments/assets/d2006a0b-7e61-48a6-bdaf-be658fa914e8)


## Tecnologias Utilizadas:

* **Backend:**
    * NestJS @v10
    * Prisma
    * MySQL
    * bcrypt (para hashing de senhas)
* **Frontend:**
    * Angular @v19
* **Orquestração/Containerização (Atualmente com problemas):**
    * Docker
    * Docker Compose
      
## Status do Docker (Problema Conhecido)

Atualmente, há um problema persistente com a inicialização dos contêineres Docker para este projeto. Embora as configurações do `docker-compose.yml` tenham sido ajustadas para incluir healthchecks do banco de dados e automação de migrações Prisma, o Docker ainda não está inicializando a aplicação de forma consistente.

A mensagem de erro mais recente indicava: "The table `User` does not exist in the current database.", mesmo após as tentativas de automação das migrações. Isso sugere que o processo de migração ou a comunicação inicial do Prisma com o banco de dados dentro do ambiente Docker ainda não está funcionando como esperado em todas as condições de inicialização.

**Portanto, a forma recomendada para rodar a aplicação neste momento é através da execução tradicional do frontend e backend.**

## Como Rodar a Aplicação (Tradicionalmente)

Para rodar o frontend e o backend, você precisará ter o Node.js (com npm) e o MySQL instalados em sua máquina local.

### Pré-requisitos

* **Node.js e npm:**
    * Verifique a instalação: `node -v` e `npm -v`
* **Xampp e DBeaver**
    * Instale o Xampp em sua maquina.
    * Apos instalar inicie o MySQL
    * Inicie o Dbeaver ou MySQl Workbench
    * Crie um banco de dados com as seguintes credenciais:
        * Nome do Banco de Dados: `db_costumer`
        * Servidor: `localhost` 
        * Usuário: `root`
        * Senha: ``
        * Porta: `3306` (padrão)

### 1. Backend (NestJS)

1.  Navegue até a pasta do backend:
    ```bash
    cd costumer-client-backend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure as variáveis de ambiente:
    Crie um arquivo `.env` na raiz da pasta `costumer-client-backend` com o seguinte conteúdo:
    ```
    DATABASE_URL="mysql://root@localhost:3306/db_costumer"
    JWT_SECRET=3G5T8W7Y1K
    ```
    Certifique-se de que as credenciais e o nome do banco de dados (`db_costumer`) correspondem à sua instalação local do MySQL.

4.  Execute as Migrações do Prisma:
    Este passo é **fundamental** para criar as tabelas no seu banco de dados.
    ```bash
    npx prisma migrate dev --name init
    ```
    * Se for a primeira vez, ele perguntará se você quer rodar a migração. Confirme.
    * Este comando criará a estrutura do banco de dados (`User`, etc.) definida no seu `prisma/schema.prisma`.

5.  Gere o Prisma Client:
    ```bash
    npx prisma generate
    ```

6.  Inicie a aplicação backend:
    ```bash
    npm run start:dev
    ```
    O backend deverá iniciar na porta `3000`. Você verá uma mensagem no terminal como "🚀 Aplicação rodando na porta 3000".

### 2. Frontend (Angular)

1.  Abra um **novo terminal** e navegue até a pasta do frontend:
    ```bash
    cd costumer-client-frontend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Inicie a aplicação frontend:
    ```bash
    npm start
    # Ou se preferir usar ng serve:
    # ng serve --open
    ```
    O Angular CLI irá compilar a aplicação e abri-la no seu navegador, geralmente em `http://localhost:4200/`.
    
### 3. Principais Endpoints da API
## 📋 Endpoints

### 🔐 Registrar Usuário

- **Método:** `POST`
- **URL:** `http://localhost:3000/users/register`
- **Body (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "password1234",
    "name": "John Doe"
  }
  ```
- **Resposta:**  
  - `201 Created` em caso de sucesso  
  - `400 Bad Request` se o email já estiver em uso

---

### 🔑 Login

- **Método:** `POST`
- **URL:** `http://localhost:3000/users/login`
- **Body (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "password1234"
  }
  ```
- **Resposta de Sucesso (200):**
  ```json
  {
    "token": "jwt_token_aqui"
  }
  ```

---

### 📦 Criar Produto

- **Método:** `POST`
- **URL:** `http://localhost:3000/products/create`
- **Auth** `Bearer token`
- **Body (JSON):**
  ```json
  {
    "name": "Product 4",
    "description": "Description",
    "price": 20.99,
    "stock": 500
  }
  ```
- **Resposta de Sucesso (200):**
  ```json
  {
    "id": 7,
    "name": "Product 4",
    "description": "Description",
    "price": 20.99,
    "stock": 500
  }
  ```

### 🛒 Criar Pedido

- **Método:** `POST`
- **URL:** `http://localhost:3000/orders/create`
- **Auth** `Bearer token`
- **Body (JSON):**
```json
{
  "items": [
    {
      "productId": 4,
      "quantity": 5
    },
    {
      "productId": 2,
      "quantity": 5
    }
  ]
}
```
- **Resposta de Sucesso (200):**
```json
{
  "id": 30,
  "calculatedTotalPrice": 209.9,
  "status": "pending",
  "user": {
    "id": 3,
    "name": "John Doe",
    "email": "user@example.com"
  },
  "items": [
    {
      "quantity": 5,
      "price": 20.99,
      "product": {
        "id": 4,
        "name": "Product 4",
        "price": 20.99
      }
    },
    {
      "quantity": 5,
      "price": 20.99,
      "product": {
        "id": 2,
        "name": "Product 2",
        "price": 20.99
      }
    }
  ]
}
```

**Observações:**

* Certifique-se de que o backend esteja rodando antes de iniciar o frontend, pois o frontend tentará se conectar aos endpoints do backend.
* Todos os Enpoints aparecerão no Swagger, esses listados acima são só os principais.
* Se você encontrar problemas de CORS (Cross-Origin Resource Sharing), pode ser necessário ajustar a configuração de CORS no seu backend NestJS para permitir requisições do domínio do frontend (`http://localhost:4200`).


