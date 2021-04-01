console.log("indexddb test");
if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
} else {
    let request=window.indexedDB.open("budget",3);
    request.onsuccess = function(event) {
        const db=event.target.result;
        const transaction = db.transaction(["new_trans"], "readwrite");
        const objectStore = transaction.objectStore("new_trans");
        const request = objectStore.add("new_trans");
        request.onsuccess = function(event) {
            console.log(request+"  objected added");
        };
        objectStore.getAll().onsuccess = function(event) {
            for ( const result of event.target.result) {
                objectStore.get(result.donKey).onsuccess=function(event){
                    console.log("Got all transactions " + JSON.stringify(event.target.result));
                }

            }
        };
        objectStore.getAll().onerror = function(event) {
            console.log("Got an error: " + request.error);
        };
    };
    request.onupgradeneeded = function(event) {
        const db=event.target.result;
        const objectStore = db.createObjectStore("new_trans", { keyPath: "donKey" });
        objectStore.transaction.oncomplete = function(event) {
           console.log("transaction completed")
        };
        console.log(objectStore);

    };
    request.error = function(event) {
        console.log(`error ${JSON.stringify(event)}`);
        console.log(`error ${request.errorCode}`);
    };
}