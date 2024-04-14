// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const {contextBridge , ipcRenderer } = require('electron') 
const { v4: uuidv4 } = require('uuid')

async function connectToMainProcess(content, vendingData){
    const uuid = generateRandomUUID()

    const payload = {
        hash : "",
        uuid,
        content,
        payload : vendingData
    }

    return await ipcRenderer.invoke(content, payload);
}

contextBridge.exposeInMainWorld('vending', {
    processId : async (uuid) => {
        return await connectToMainProcess("processId",uuid)
    }
})

function generateRandomUUID() {
    return uuidv4()
}
