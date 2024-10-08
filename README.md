# Kanban Board Application

> Este é um projeto de aplicação Kanban simples desenvolvido em Laravel, que permite gerenciar tarefas através de um board visual com colunas e tarefas.

## Stack utilizada

**Front-end:** Laravel Blade, Html, CSS, JS, Jquery

**Back-end:** Laravel, Mysql

## Funcionalidades

- Visualização das Tarefas: Permite a visualização das tarefas agrupadas em colunas.
- Gerenciamento das Colunas: Adiciona novas colunas e personaliza a ordem e cores dos cabeçalhos

## Requisitos

> Para executar a aplicação localmente, você precisará de um servidor local como o XAMPP, Laragon, ou qualquer outra solução que suporte PHP e MySQL. Certifique-se de que o servidor local esteja configurado e em funcionamento.

## Instalação

Para que o projeto funcione é necessário que tenha alguma das

Clone o repositório

```bash
  https://github.com/GuilhermeSouza01/teste-kanban-project.git
```

Navegue até o diretório do projeto:

```
cd laravel_kanban
```

Instale as dependências do Composer:

```
composer install
```

Configurar o Arquivo .env:

Copie o arquivo .env.example para um novo arquivo .env e configure suas credenciais do banco de dados e outras variáveis de ambiente necessárias:

```
cp .env.example .env
```

Gere uma chave de aplicação para o Laravel:

```
php artisan key:generate
```

Configure o Banco de Dados:
Mude a conexão para mysql, descomente as linhas após "DB_CONNECTION" até "DB_PASSWORD"

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nome_do_banco
DB_USERNAME=usuario
DB_PASSWORD=senha

```

Execute as migrações:

Crie o banco de dados e execute as migrations para criar as tabelas:

```
php artisan migrate
```

Popule a tabela com os dados iniciais das colunas:

```
php artisan db:seed --class=ColumnsTableSeeder
```

Inicie o servidor de desenvolvimento com o XAMPP, Laragon ou outra ferramenta similar.

```
php artisan serve
```

Acesse a aplicação em http://localhost:8000/board ou no endereço configurado no seu servidor local.

## Licença

Este projeto está licenciado sob a Licença [MIT](https://choosealicense.com/licenses/mit/).
