# Projeto: API Rest e Representação de Dados

Este é um repositório para a atividade 4 da disciplina de Sistemas Distribuídos e Redes de Comunicação. O projeto consiste em desenvolver uma API Rest e Representação de Dados utilizando diferentes tecnologias. O aluno responsável pelo projeto é Caio Eduardo Pereira Nunes, de matrícula 549486.

## Descrição do Projeto

### Calculadora REST

A Calculadora REST é um projeto programado em JavaScript com o framework Next.js. Ele utiliza uma API fornecida pelos professores da disciplina para realizar cálculos das quatro operações básicas (adição, subtração, multiplicação e divisão).

### Servidor REST

O Servidor REST é um projeto programado em JavaScript com Node.js. Ele utiliza o banco de dados SQLite com o ORM Sequelize. O servidor faz uso da API pública "https://imgflip.com/api", que fornece uma lista de memes. A aplicação "Save a Meme" foi desenvolvida para permitir que os usuários salvem seus memes favoritos. As funcionalidades implementadas são cadastro/autenticação de usuário e um sistema de favoritos, onde o usuário pode salvar memes. A API pode exportar resultados em JSON e XML, sendo possível especificar o formato desejado através do parâmetro de query "format". Um dos endpoints (/api/meme/proto) retorna uma resposta utilizando Protocol Buffer.

#### Documentação Swagger com especificação Open API

A documentação Swagger foi gerada com base na especificação Open API. O JSON gerado pelo Swagger Editor pode ser acessado através do endpoint /api-docs do servidor REST.

### Cliente WEB

O Cliente WEB é um projeto programado em JavaScript com Next.js. A aplicação apresenta uma tela de login e uma dashboard com uma lista de memes provenientes do servidor REST. O usuário pode favoritar memes e também possui uma página de favoritos, onde pode desfavoritar os memes salvos.

### Cliente Android

O Cliente Android é um projeto programado em JavaScript com React Native. A aplicação possui uma tela de login e uma dashboard que exibe uma lista de memes provenientes do servidor REST. O usuário pode favoritar memes e possui uma página de favoritos para gerenciar os memes salvos.

## Vídeo Demonstração

Confira a execução dos 4 projetos desenvolvidos e a demonstração da documentação Swagger com especificação Open API neste [!vídeo](https://youtu.be/hGBX9Sg6orQ).
