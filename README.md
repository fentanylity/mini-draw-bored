2024-11-15
Atenção: estou enfrentando um problema entre requisições onde estão se cruzando, recomendo esperar atualizações antes de rodar em sua máquina. :heart:

## Inicialização da aplicação

```bash
npm i
npm run build
npm run start
```

### Como logar e testar as funcionalides

Por padrão o usuário que pode realizar as funcionalidade de CRUD tem o cargo de Admin por padrão, para criar o usuário administrador é preciso incluir um diretório `auth` com um `.json` innitials-users, certifique que essa pasta esteje fora do fluxo principal.

> Caso não haja o arquivo par inicialização, crie-la sequingo esse trecho de código no seu terminal preferido. 
``` bash
#Linux

mkdir -p auth
echo '{
    "name": "Kayne West",
    "email": "Ye@exemple.com",
    "password": "123123",
    "role": 1
}' > auth/initial-users.json

#Shell

New-Item -ItemType Directory -Path .\auth

@'
{
    "name": "Kayne West",
    "email": "Ye@exemple.com",
    "password": "123123",
    "role": 1
}
'@ | Out-File -FilePath .\auth\initial-users.json -Encoding UTF8

#CMD Windows (inferior 11)

mkdir auth
echo {^
    "name": "Kayne West",^
    "email": "Ye@exemple.com",^
    "password": "123123",^
    "role": 1^
} > auth\initial-users.json
```

Certifique de ter todos os modulos necessários para inicializar seu projeto.

### Funcionalidades

É possivel unico usuário em innnitias-users testas todas as funcionalidades, mas é possivel, somente com o mesmo, ou outro com cargo de admin, poderá acessar a página de `registar.html`, de acordo, após algum usuário for cadastrado, poderá o realizar encerrar sua sessão e inicar a mesma com o usuário com cargo inferior.


É possivel acessar o `public-acess.html` sem precisar estar logado, mas será necessário ter que digitar manulamente o url para acessá-lo **(TODO)** 

Essa página oferece um mini software bastante primitivo de desenho.

O usuário cadastrado e logado poderá realizar as seguintes funcionalidades:
- Salvar o desenho no seu computador(png)
- Visualizar a timelapse do desenho
(apng)
- Salvar no computador a timelapse.
- Publicar para outros usuários visualizar a timelapse.

A visualização dos desenhos publicados podera ser feita acessando a `private_acess.html`.

### CRUD dos usuários

Administradores podem realizar tarefas básicas de CRUD com os usuários, acessando o o `registrar.html` poderá ver a listagem, alterar a nome, email e senha (quando confirmada para evitar equivocos) acertido de (caso a senha não alterada) terá que confirmar a senha do usuário antes de atualizar qualquer do enunciados mencionados.


TODO:
- Sessão
    - JWT token ser eliminado, ou, não interferir com outras sessões
- Rotas protegidas
- Listagem
- Visualização dos desenhos (db only)
- Vinculo com a conta e desenhos (// optional)
- Aplicação de desenho otimizada
    - place-and-conquer algoritimo de bucket-fill // optional
    - adicionar paletas
    - controle de traço preciso (Equação gravitacional para ponto e massa do pincel/obejto)
    - Timestamp de acordo com a duração do desenho (otimização quando carregado, >12mb)