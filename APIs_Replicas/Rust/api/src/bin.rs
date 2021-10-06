#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

use lib::db;
use lib::model::Tweet;
use lib::model::TweetRec;
use rocket_contrib::json::Json;

fn main() {
    rocket().launch();
}

#[get("/tweets")]
fn get_tweets() -> Json<Option<Vec<Tweet>>> {
    Json(db::read_tweets())
}

#[get("/")]
fn say_hello() -> String {
    String::from("SOPES 1 - Proyecto 1\n")
}

#[post("/iniciarCarga", data = "<tweet>")]
fn create_Tweet(tweet: Json<TweetRec>) -> Json<Option<TweetRec>> {
    Json(db::insert_Tweet(tweet.0))
}

#[get("/vaciarJson")]
fn empty_tweets() -> String {
    db::empty_tweets();
    String::from("Done\n")
}

#[get("/subirCargaRustDocker")]
fn publish_data() -> String {
    db::publish_data();
    String::from("Done\n")
}

fn rocket() -> rocket::Rocket {
    db::empty_tweets();
    rocket::ignite().mount(
        "/",
        routes![
            get_tweets,
            say_hello,
            create_Tweet,
            empty_tweets,
            publish_data
        ],
    )
}
