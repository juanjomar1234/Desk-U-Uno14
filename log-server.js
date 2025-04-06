const express = require('express')
const app = express()
const port = 3002

app.get('/api/logs', async (req, res) => {
  // Conectar a la API de producción para logs
  const prodLogs = await fetch(`${process.env.PROD_API_URL}/api/logs`)
  const logs = await prodLogs.json()
  res.json(logs)
})

app.listen(port, () => {
  console.log(`Log viewer running on http://localhost:${port}`)
}) 