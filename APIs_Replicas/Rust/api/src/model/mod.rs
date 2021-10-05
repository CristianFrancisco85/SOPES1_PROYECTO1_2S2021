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