# Weather
Website que utiliza uma Api para consulta de temperatura numa cidade escolhida pelo utilizador com própria Api.


Para aceder o Website:
http://localhost:3000


API:
Para fazer um get request á Api só com a cidade e resposta em unidades standard:
http://localhost:3000/api/nomedacidade

Para mudar unidade do get request á Api:
http://localhost:3000/api/nomedacidade/unidade
onde unidade deve ser metric, imperial ou standard

Para fazer um post request á Api:
Corpo de request em json para o url http://localhost:3000/api
Json deve ter esta estrutura:
{
  "cityname": nomedacidade
  "unit": unidade
}
onde nomedacidade é obrigatório e tem de ser escrito corretamente
onde unidade é opcional e deve ter o valor metric, imperial ou standard se é dado
