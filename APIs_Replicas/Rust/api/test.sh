curl http://localhost:8000/iniciarCarga \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"Nombre": "Rossemery Enriquez", "Comentario": "tweet de prueba hacia rust", "Fecha": "30-09-2021", "Hashtags": "#este, #es, #un, #test", "Upvotes": 500, "Downvotes": 0}'
curl http://localhost:8000/iniciarCarga \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"Nombre": "Cesar Sosa", "Comentario": "tweet de prueba hacia rust 2", "Fecha": "30-09-2021", "Hashtags": "#este, #es, #un, #test", "Upvotes": 500, "Downvotes": 0}'
