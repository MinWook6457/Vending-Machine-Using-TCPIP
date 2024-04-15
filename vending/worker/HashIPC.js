
class HashIPC extends Map{
    add(content,uuid,data){
        var resolve,reject;

        const hash = createHash(content,uuid,data)

        console.log(hash)

        const promise = new Promise((resolve,reject) => {
            resolve = resolve;
            reject = reject;
        })

        this.set(hash, resolve);

        return [
            promise,
            {
              content,
              uuid,
              hash,
              payload: JSON.stringify(data),
            },
          ];
    }
}

function createHash(hashData) {
    const hashed = [hashData.content, hashData.uuid, hashData.data].join("")
    return crypto.createHash("sha1").update(hashed).digest("hex")
}
