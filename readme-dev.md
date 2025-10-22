# Development readme

* Current State: Kind of works fine, need to assert user stories and verify all features are working, fix broken features, and modularize components to break down the mega-monolithic app.

## Features to verify:

Build an app that is a study tool for viewing flash cards, accepts a "deck" of JSON data as an array of this object:

```json
{
    "front": "Question",
    "back": "Answer",
    "tags": [
        "tag1",
        "tag2"
    ]
}
```

The app tracks score for each tag and when you shuffle the deck, cards with your weakest tags appear at the top and cards with the strongest tags are omitted. Metadata is cached. You can name and edit the decks and view your best/worst tags. User can reset progress for tags individually, or clear data entirely.

---

## Future Development

* Improvements: use sqlite (or another) data store to allow easy flash card management, view all cards in a table, perform CRUD on individual cards, select subsets of cards to study instead of a whole deck, study with mix of cards from different decks, using tag as common property to join sets of cards.

* Deployment: host at local domain https://apps.gob.lan/flash-cards/ via nginx reverse proxy. (I am not sure how to deploy a next.js app locally, please show me how to do this. The development server is already set up to host apps built with other frameworks, static files, etc, so if this is a special case then we need to walk through the steps.)