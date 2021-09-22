curl http://localhost:8080/iniciarCarga \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"nombre": "Alexander Sosa", "comentario": "A Guillermo le gusta Cristian", "fecha": "2021-09-21", "hashtags": ["no", "soy", "chepix", ">:v"], "upvotes": 500, "downvotes": 0}'
curl http://localhost:8080/iniciarCarga \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"nombre": "Fernanda Sosa", "comentario": "A Cristian le gusta Guillermo", "fecha": "2021-09-21", "hashtags": ["no", "soy", "chepix", ">:v"], "upvotes": 500, "downvotes": 0}'
