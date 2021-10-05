#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

use rocket_contrib::json::Json;
use lib::db;
use lib::model::Tweet;

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
//iniciarCarga

#[post("/iniciarCarga", data="<tweet>")]
fn create_tweet(tweet: Json<Tweet>) -> Json<Option<Tweet>> {
    Json(db::insert_tweet(tweet.0))
}

#[get("/vaciarJson")]
fn empty_tweets()-> String {
    db::empty_tweets();
    String::from("Done\n")
}

#[get("/subirCargaRustDocker")]
fn publish_data()-> String {
    db::publish_data();
    String::from("Done\n")
}

fn rocket() -> rocket::Rocket {
    rocket::ignite().mount(
        "/",
        routes![get_tweets, say_hello,  create_tweet, empty_tweets, publish_data],
    )
}