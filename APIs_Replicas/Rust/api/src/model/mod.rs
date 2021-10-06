use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct Tweet {
    pub Nombre: String,
    pub Comentario: String,
    pub Fecha: String, 
    pub Hashtags: String,
    pub Upvotes: i64,
    pub Downvotes: i64
}

#[derive(Clone, Serialize, Deserialize)]
pub struct TweetRec {
    pub nombre: String,
    pub comentario: String,
    pub fecha: String, 
    pub hashtags: Vec<String>,
    pub upvotes: i64,
    pub downvotes: i64
}

//	json_base := "{\"guardados\":%s, \"api\":\"%s\", \"tiempoDeCarga\":\"%s\", \"bd\":\"%s\"}"

#[derive(Clone, Serialize, Deserialize)]
pub struct Mensaje {
    pub guardados: i64,
    pub api: String,
    pub tiempoDeCarga: String, 
    pub bd:String,
}

