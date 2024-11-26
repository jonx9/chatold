module.exports = {
    apps: [
        {
            name: 'CHAT-SUMA',
            exec_mode: 'cluster',
            port: 4000,
            instances: 'max', // Or a number of instances
            script: 'app.js',
            args: 'start',
        }
    ]
}