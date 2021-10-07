use crate::model::Mensaje;
use crate::model::Tweet;
use crate::model::TweetRec;
use sqlx::mysql::MySqlPoolOptions;
use std::fs;
use std::time::{Duration, Instant};
static TWEETS_DB: &str = "data/tweets.json";
use mongodb::{bson::doc, sync::Client};
extern crate gcp_pubsub;
extern crate goauth;
use elapsed::ElapsedDuration;
type Exception = Box<dyn std::error::Error + Send + Sync + 'static>;
use futures::future::join_all;
use chrono::{DateTime, NaiveDate, NaiveDateTime, NaiveTime, Utc};
use chrono::format::ParseError;

fn _tweets() -> Result<Vec<Tweet>, serde_json::Error> {
    let data = fs::read_to_string(TWEETS_DB).expect("Error reading from file");
    let tweets: Result<Vec<Tweet>, serde_json::Error> = serde_json::from_str(&data);
    tweets
}

pub fn read_tweets() -> Option<Vec<Tweet>> {
    match _tweets() {
        Ok(tweets) => Some(tweets),
        Err(_) => None,
    }
}

fn _write_tweets(tweets: Vec<Tweet>) {
    let data = serde_json::to_string(&tweets).expect("Failed to turn tweets into serde string");
    fs::write(TWEETS_DB, data).expect("Failed to write data.");
}
pub fn insert_Tweet(tweet: TweetRec) -> Option<TweetRec> {
    let mut hstgs = "#".to_owned() + &tweet.hashtags[0].clone();
    let num = tweet.hashtags.len();
    let mut index = 1;
    while index < num {
        hstgs += &", ".to_owned();
        hstgs += &"#".to_owned();
        hstgs += &tweet.hashtags[index].clone();
        index += 1;
    }
    let new_tweet = Tweet {
        Nombre: tweet.nombre.clone(),
        Comentario: tweet.comentario.clone(),
        Fecha: tweet.fecha.clone(),
        Hashtags: hstgs,
        Upvotes: tweet.upvotes,
        Downvotes: tweet.downvotes,
    };
    match _tweets() {
        Ok(mut tweets) => {
            tweets.push(new_tweet.clone());
            _write_tweets(tweets);
            Some(tweet)
        }
        Err(_) => None,
    }
}

pub fn empty_tweets() {
    match _tweets() {
        Ok(mut tweets) => {
            tweets.clear();
            _write_tweets(tweets);
        }
        Err(_) => (),
    }
}

pub fn publish_data() {
    let client = Client::with_uri_str("mongodb://proyecto1-mongodb:FLAJuykpeNXSGoSgvUAq8CdQKwTG6TuiPvucxg3GbusrdEbD4ugMNqGvQmLYuz94iMyxPS4TFn8agUZ971bGrw==@proyecto1-mongodb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@proyecto1-mongodb@").unwrap();
    let mut rt0 = tokio::runtime::Runtime::new().unwrap();
    rt0.block_on(add_tweets_mongo(client));
    let mut rt = tokio::runtime::Runtime::new().unwrap();
    rt.block_on(add_tweets_mysql());
}

async fn add_tweets_mongo(client: mongodb::sync::Client) {
    let start = Instant::now();
    let db = client.database("mydb");
    let typed_collection = db.collection::<Tweet>("tweet");
    let mut subidos: i64 = 0;
    match _tweets() {
        Ok(mut tweets) => {
            typed_collection.insert_many(tweets.clone(), None);
            subidos = tweets.len() as i64;
        }
        Err(_) => (),
    }
    let duration = start.elapsed();

    let nuevo_mensaje = Mensaje {
        guardados: subidos,
        api: "Rustlang ContainerD".to_owned(),
        tiempoDeCarga: format!("{}", ElapsedDuration::new(duration)),
        bd: "MongoDB".to_owned(),
    };
    publicar(nuevo_mensaje).await;
}

async fn add_tweets_mysql() -> Result<(), sqlx::Error> {
    let start = Instant::now();
    let pool = MySqlPoolOptions::new()
        .max_connections(5)
        .connect("mysql://root:l9j6oytdaq9DGhbO@@34.123.196.134/mydb")
        .await?;
    let mut tweets_subidos = 0;
    match _tweets() {
        Ok(mut tweets) => {
            let num = tweets.len();
            let mut index = 0;
            while index < num {
                let date = NaiveDate::parse_from_str(&tweets[index].Fecha, "%d-%m-%Y").unwrap();
                let query = "INSERT INTO Tweet (Nombre,Comentario,Fecha,Hashtags,Upvotes,Downvotes) VALUES ('".to_owned() +
                &tweets[index].Nombre.clone()+&"', '".to_owned() + &tweets[index].Comentario +&"', '".to_owned() + 
                &date.format("%Y/%m/%d").to_string()  +&"', '".to_owned() + &tweets[index].Hashtags +&"', ".to_owned() + &tweets[index].Upvotes.to_string()+
                &", ".to_owned()+&tweets[index].Downvotes.to_string() + &");".to_owned();
                sqlx::query(&query).execute(&pool).await.unwrap();
                sqlx::query("commit;").execute(&pool).await.unwrap();
                index += 1;
                tweets_subidos += 1;
            }
            tweets.clear();
            _write_tweets(tweets);
        }
        Err(_) => (),
    }
    let duration = start.elapsed();
    let nuevo_mensaje = Mensaje {
        guardados: tweets_subidos,
        api: "Rustlang ContainerD".to_owned(),
        tiempoDeCarga: format!("{}", ElapsedDuration::new(duration)),
        bd: "MySQL".to_owned(),
    };
    publicar(nuevo_mensaje).await;
    Ok(())
}

async fn publicar(menasje: Mensaje) -> Result<(), Exception> {
    let file_path = "src/GCPKey.json";
    let topic_name = "dbUpdates";
    let credentials = goauth::credentials::Credentials::from_file(&file_path).unwrap();
    let mut client = gcp_pubsub::Client::new(credentials);
    println!("Refreshed token: {}", client.refresh_token().is_ok());
    let topic = client.topic(&topic_name);
    println!("Before sending messages");
    let results = vec![topic.publish(menasje)];
    println!("After sending messages");
    println!("{:?}", join_all(results).await);
    Ok(())
}
