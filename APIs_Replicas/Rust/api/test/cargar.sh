curl http://localhost:8000/iniciarCarga \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"nombre": "Darius Miroslav", "comentario": "seems to show a lot of creativity in my class", "fecha": "2021-10-4", "hashtags": ["test", "carga", "rust", ":v"], "upvotes": 500, "downvotes": 0}'
curl http://localhost:8000/iniciarCarga \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"nombre": "Luciana Susanoo", "comentario": "He gets quite excited when he sees an opportunity to participate in class and show off his English abilities. When he is focused", "fecha": "2021-10-4", "hashtags": ["test", "carga", "rust", ":v", "2"], "upvotes": 500, "downvotes": 0}'
