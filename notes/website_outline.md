Build an interface for a flash card viewer that accepts a "deck" of JSON data as an array of these objects: 
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

The app records a score for each tag and when you shuffle the deck, a sample of cards with your weakest tags appear at the top and cards with the strongest tags are omitted. Metadata is cached. You can name and edit the decks and view your best/worst tags. Also can reset progress for tags, or clear data entirely.
