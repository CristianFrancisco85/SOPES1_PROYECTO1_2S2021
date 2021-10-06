use std::fs;
use crate::model::Tweet;
use crate::model::TweetRec;

static TWEETS_DB: &str = "data/tweets.json";
use mongodb::{
    bson::doc,
    sync::Client,
};

fn _tweets() -> Result<Vec<Tweet>, serde_json::Error> {
    let data = fs::read_to_string(TWEETS_DB).expect("Error reading from file");
    let tweets: Result<Vec<Tweet>, serde_json::Error> = serde_json::from_str(&data);
    tweets
}

pub fn read_tweets() -> Option<Vec<Tweet>> {
    match _tweets() {
        Ok(tweets) => Some(tweets),
        Err(_) => None
    }
}

fn _write_tweets(tweets: Vec<Tweet>) {
    let data = serde_json::to_string(&tweets).expect("Failed to turn tweets into serde string");
    fs::write(TWEETS_DB, data).expect("Failed to write data.");
}

pub fn insert_Tweet(tweet: TweetRec) -> Option<TweetRec>{
    let mut hstgs = "#".to_owned() + &tweet.hashtags[0].clone();
    let num = tweet.hashtags.len();
    let mut index = 1;
    while index < num{
        hstgs +=  &", ".to_owned();
        hstgs += &"#".to_owned();
        hstgs +=&tweet.hashtags[index].clone();
        index+=1;
    }
    let new_tweet = Tweet {
        Nombre: tweet.nombre.clone(),
        Comentario: tweet.comentario.clone(),
        Fecha: tweet.fecha.clone(),
        Hashtags: hstgs,
        Upvotes: tweet.upvotes,
        Downvotes: tweet.downvotes
    };
    match _tweets() {
        Ok(mut tweets) => {
            tweets.push(new_tweet.clone());
            _write_tweets(tweets);
            Some(tweet)
        },
        Err(_) => None
    }
}

pub fn empty_tweets() {
    match _tweets() {
        Ok(mut tweets) => {
            tweets.clear();
            _write_tweets(tweets);
            
        },
        Err(_) => ()
    }
}

pub fn publish_data(){
    let client = Client::with_uri_str("mongodb://proyecto1-mongodb:FLAJuykpeNXSGoSgvUAq8CdQKwTG6TuiPvucxg3GbusrdEbD4ugMNqGvQmLYuz94iMyxPS4TFn8agUZ971bGrw==@proyecto1-mongodb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@proyecto1-mongodb@").unwrap();
    add_tweets(client);
}

fn add_tweets(client: mongodb::sync::Client){
    let db = client.database("mydb");
    let typed_collection = db.collection::<Tweet>("tweet");
    match _tweets() {
        Ok(mut tweets) => {
            typed_collection.insert_many(tweets.clone(), None);
            tweets.clear();
            _write_tweets(tweets);
        },
        Err(_) => ()
    }
}

/*
use mongodb::{
    bson::doc,
    sync::Client,
};
use futures::stream::{StreamExt, TryStreamExt};
use serde::{Deserialize,Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Tweet{
    Upvotes: i64,
    Downvotes: i64,
    Nombre: String,
    Comentario: String,
    Fecha: String, 
    Hashtags: String
}
fn add_user(client: mongodb::sync::Client){
    let db = client.database("mydb");
    //let coll = db.collection("tweet");
    //coll.insert_one(doc ! {	"Upvotes" : 500, "Downvotes" : 1, "Nombre" : "Alejandro Sosa", "Comentario" : "Insert desde Rust mongodb", "Fecha" : "30/09/2021", "Hashtags" : "#siu, #kyc, #deepWebAlv"}, None);
    let typed_collection = db.collection::<Tweet>("tweet");
    let tweets = vec![
    Tweet {Upvotes : 500, Downvotes : 1, Nombre : "Alejandro Sosa 0".to_string(), Comentario : "Insert desde Rust mongodb 0".to_string(), Fecha : "30/09/2021".to_string(), Hashtags : "#siu, #kyc, #deepWebAlv".to_string()},
    Tweet {Upvotes : 500, Downvotes : 1, Nombre : "Alejandro Sosa 1".to_string(), Comentario : "Insert desde Rust mongodb 1".to_string(), Fecha : "30/09/2021".to_string(), Hashtags : "#siu, #kyc, #deepWebAlv".to_string()},
    Tweet {Upvotes : 500, Downvotes : 1, Nombre : "Alejandro Sosa 2".to_string(), Comentario : "Insert desde Rust mongodb 2".to_string(), Fecha : "30/09/2021".to_string(), Hashtags : "#siu, #kyc, #deepWebAlv".to_string()},
    Tweet {Upvotes : 500, Downvotes : 1, Nombre : "Alejandro Sosa 3".to_string(), Comentario : "Insert desde Rust mongodb 3".to_string(), Fecha : "30/09/2021".to_string(), Hashtags : "#siu, #kyc, #deepWebAlv".to_string()},
    Tweet {Upvotes : 500, Downvotes : 1, Nombre : "Alejandro Sosa 4".to_string(), Comentario : "Insert desde Rust mongodb 4".to_string(), Fecha : "30/09/2021".to_string(), Hashtags : "#siu, #kyc, #deepWebAlv".to_string()},
    ];
    typed_collection.insert_many(tweets, None);
    println!("Hola señor, soy Jarvis, completó la subida a mongodb desde rust de 5 structs");
}
fn main() {
    println!("Hello, world!");
    let client = Client::with_uri_str("mongodb://proyecto1-mongodb:FLAJuykpeNXSGoSgvUAq8CdQKwTG6TuiPvucxg3GbusrdEbD4ugMNqGvQmLYuz94iMyxPS4TFn8agUZ971bGrw==@proyecto1-mongodb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@proyecto1-mongodb@").unwrap();
    add_user(client);
}
*/

