use crate::model::Tweet;
use crate::model::TweetRec;
use sqlx::mysql::MySqlPoolOptions;
use std::fs;
static TWEETS_DB: &str = "data/tweets.json";
use mongodb::{bson::doc, sync::Client};

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
    add_tweets_mongo(client);
    let mut rt = tokio::runtime::Runtime::new().unwrap();
    rt.block_on(add_tweets_mysql());
}

fn add_tweets_mongo(client: mongodb::sync::Client) {
    let db = client.database("mydb");
    let typed_collection = db.collection::<Tweet>("tweet");
    match _tweets() {
        Ok(mut tweets) => {
            typed_collection.insert_many(tweets.clone(), None);
            _write_tweets(tweets);
        }
        Err(_) => (),
    }
}

async fn add_tweets_mysql() -> Result<(), sqlx::Error> {
    let pool = MySqlPoolOptions::new()
        .max_connections(5)
        .connect("mysql://root:l9j6oytdaq9DGhbO@@34.123.196.134/mydb")
        .await?;
    match _tweets() {
        Ok(mut tweets) => {
            let num = tweets.len();
            let mut index = 0;
            while index < num {
                let query = "INSERT INTO Tweet (Nombre,Comentario,Fecha,Hashtags,Upvotes,Downvotes) VALUES ('".to_owned() +
                &tweets[index].Nombre.clone()+&"', '".to_owned() + &tweets[index].Comentario +&"', '".to_owned() + 
                &tweets[index].Fecha  +&"', '".to_owned() + &tweets[index].Hashtags +&"', ".to_owned() + &tweets[index].Upvotes.to_string()+&", ".to_owned()+&tweets[index].Downvotes.to_string() +
                &");".to_owned();
                println!("{}",query);
                sqlx::query(&query).execute(&pool).await.unwrap();
                sqlx::query("commit;").execute(&pool).await.unwrap();
                index += 1;
            }
            tweets.clear();
            _write_tweets(tweets);
        }
        Err(_) => (),
    }
    Ok(())
}
