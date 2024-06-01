if an API responded json in the following format, how can I convert the object to create a new object but sorted from latest created_time

```json
{
    "1": {
        "_id": "66546d990f066c75f1fc38d6",
        "created_time": "26/05/2024 14:46:12 GMT +0700"
    },
    "2": {
        "_id": "66546d990f066c75f1fc38d7",
        "created_time": "26/05/2024 14:48:15 GMT +0700"
    },
    "3": {
        "_id": "66546d990f066c75f1fc38dd",
        "created_time": "26/05/2024 15:03:36 GMT +0700"
    },
    "4": {
        "_id": "66546d990f066c75f1fc38d8",
        "created_time": "26/05/2024 14:52:45 GMT +0700"
    },
    "5": {
        "_id": "66546d990f066c75f1fc38ca",
        "created_time": "26/05/2024 13:45:11 GMT +0700"
    },
    "6": {
        "_id": "66546d990f066c75f1fc38ce",
        "created_time": "26/05/2024 14:02:33 GMT +0700"
    },
    "7": {
        "_id": "66546d990f066c75f1fc38c5",
        "created_time": "26/05/2024 13:26:09 GMT +0700"
    },
    "8": {
        "_id": "66546d990f066c75f1fc38d2",
        "created_time": "26/05/2024 14:24:36 GMT +0700"
    },
    "9": {
        "_id": "66546d990f066c75f1fc38db",
        "created_time": "26/05/2024 14:59:15 GMT +0700"
    },
    "10": {
        "_id": "66546d990f066c75f1fc38e1",
        "created_time": "26/05/2024 15:12:02 GMT +0700"
    }
}
```